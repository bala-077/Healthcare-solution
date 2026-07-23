const postService = require('../service/postService');
const catchAsync = require('../utils/catchAsync');

// @desc    Get home feed (profile + 5 sample posts)
// @route   GET /api/posts
// @access  Private
const getHomeFeed = catchAsync(async (req, res, next) => {
  const posts = await postService.getHomeFeed();

  res.status(200).json({
    success: true,
    data: {
      profile: req.user,
      posts,
    },
  });
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = catchAsync(async (req, res, next) => {
  const { content } = req.body;
  
  // Extract Cloudinary URLs from multer req.files
  const images = req.files ? req.files.map(file => file.path) : [];
  
  const post = await postService.createPost(req.user._id, content, images);

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc    Like or unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = catchAsync(async (req, res, next) => {
  const post = await postService.likePost(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Increment share count on a post
// @route   PUT /api/posts/:id/share
// @access  Private
const sharePost = catchAsync(async (req, res, next) => {
  const post = await postService.sharePost(req.params.id);
  res.status(200).json({
    success: true,
    data: post,
  });
});

module.exports = {
  getHomeFeed,
  createPost,
  likePost,
  sharePost,
};
