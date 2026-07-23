const userService = require('../service/userService');
const catchAsync = require('../utils/catchAsync');

// @desc    Get users for discover screen (exclude current user and existing connections)
// @route   GET /api/users/discover
// @access  Private
const discoverUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getDiscoverUsers(req.user);
  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc    Get all users (for search)
// @route   GET /api/users/all
// @access  Private
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers(req.user, req.query.search);
  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Send connection request
// @route   POST /api/users/connect
// @access  Private
const sendConnectionRequest = catchAsync(async (req, res, next) => {
  const { receiverId } = req.body;
  const result = await userService.sendConnectionRequest(req.user, receiverId);
  
  res.status(200).json({
    success: true,
    message: result.status === 'cancelled' ? 'Connection request cancelled' : 'Connection request sent successfully',
    status: result.status
  });
});

// @desc    Accept connection request
// @route   POST /api/users/connect/accept
// @access  Private
const acceptConnectionRequest = catchAsync(async (req, res, next) => {
  const { senderId } = req.body;
  await userService.acceptConnectionRequest(req.user, senderId);

  res.status(200).json({
    success: true,
    message: 'Connection accepted',
  });
});

// Helper endpoint for testing: Get current user profile
const getMyProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({ success: true, data: req.user });
});

// @desc    Get populated connections for current user
// @route   GET /api/users/connections
// @access  Private
const getMyConnections = catchAsync(async (req, res, next) => {
  const user = await req.user.populate('connections', 'name occupation profileImage');
  res.status(200).json({ success: true, data: user.connections });
});

// @desc    Get populated connection requests for current user
// @route   GET /api/users/connection-requests
// @access  Private
const getConnectionRequests = catchAsync(async (req, res, next) => {
  const user = await req.user.populate('connectionRequests', 'name occupation profileImage');
  res.status(200).json({ success: true, data: user.connectionRequests });
});

module.exports = {
  discoverUsers,
  sendConnectionRequest,
  acceptConnectionRequest,
  getMyProfile,
  getMyConnections,
  getConnectionRequests,
  getAllUsers,
  getUserById
};
