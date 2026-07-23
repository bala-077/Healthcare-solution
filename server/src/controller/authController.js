const authService = require('../service/authService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Register or update user (Onboarding)
// @route   POST /api/auth/onboarding
// @access  Private (Requires firebase token)
const onboardUser = catchAsync(async (req, res, next) => {
  const { mobileNumber, name, occupation, profileImage } = req.body;
  const { firebaseUid } = req; // From authMiddleware

  if (!firebaseUid) {
    return next(new AppError('Firebase UID is required from auth token', 400));
  }

  const { user } = await authService.onboardUser(firebaseUid, mobileNumber, name, occupation, profileImage);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  onboardUser,
};
