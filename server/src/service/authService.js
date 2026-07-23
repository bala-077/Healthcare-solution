const User = require('../model/User');
const AppError = require('../utils/AppError');

class AuthService {
  async onboardUser(firebaseUid, mobileNumber, name, occupation, profileImage) {
    let user = await User.findOne({ firebaseUid });

    if (user) {
      user.name = name;
      user.occupation = occupation;
      if (profileImage) user.profileImage = profileImage;
      await user.save();
      return { user, isNew: false };
    } else {
      // Check if mobile number is already taken by another firebaseUid
      const existingMobile = await User.findOne({ mobileNumber });
      if (existingMobile) {
        throw new AppError('User with this mobile number already exists', 400);
      }

      user = await User.create({
        firebaseUid,
        mobileNumber,
        name,
        occupation,
        profileImage: profileImage || '',
      });
      return { user, isNew: true };
    }
  }
}

module.exports = new AuthService();
