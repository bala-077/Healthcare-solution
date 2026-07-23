const User = require('../model/User');

const protect = async (req, res, next) => {
  try {
    let firebaseUid;
    
    // For development/testing purposes, allow passing firebaseUid directly in headers
    if (req.headers.firebaseuid) {
      firebaseUid = req.headers.firebaseuid;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // In a real app, verify token with firebase-admin here
      // const token = req.headers.authorization.split(' ')[1];
      // const decodedToken = await admin.auth().verifyIdToken(token);
      // firebaseUid = decodedToken.uid;
      
      // We will mock this by assuming the token string is the firebaseUid
      firebaseUid = req.headers.authorization.split(' ')[1];
    }
    
    if (!firebaseUid) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const user = await User.findOne({ firebaseUid });

    if (!user && req.originalUrl !== '/api/auth/onboarding') {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found. Please onboard.' });
    }

    // Attach user to request, or just firebaseUid if onboarding
    req.user = user;
    req.firebaseUid = firebaseUid;
    
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
