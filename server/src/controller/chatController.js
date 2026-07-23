const chatService = require('../service/chatService');
const catchAsync = require('../utils/catchAsync');

// @desc    Get chat messages between current user and another user
// @route   GET /api/chats/:receiverId
// @access  Private
const getChatHistory = catchAsync(async (req, res, next) => {
  const { receiverId } = req.params;

  const chats = await chatService.getChatHistory(req.user, receiverId);

  res.status(200).json({
    success: true,
    data: chats,
  });
});

// @desc    Send a message or share a post
// @route   POST /api/chats
// @access  Private
const sendMessage = catchAsync(async (req, res, next) => {
  const { receiverId, message, sharedPostId } = req.body;

  const populatedChat = await chatService.sendMessage(req.user, receiverId, message, sharedPostId);

  res.status(201).json({
    success: true,
    data: populatedChat,
  });
});

// @desc    Get recent chats list
// @route   GET /api/chats/recent
// @access  Private
const getRecentChats = catchAsync(async (req, res, next) => {
  const recentChats = await chatService.getRecentChats(req.user);

  res.status(200).json({
    success: true,
    data: recentChats,
  });
});

module.exports = {
  getChatHistory,
  getRecentChats,
  sendMessage,
};
