const express = require('express');
const { getHomeFeed, createPost, likePost, sharePost } = require('../../controller/postController');
const { protect } = require('../../middleware/authMiddleware');
const { validate } = require('../../middleware/validate');
const { createPostSchema } = require('../../validator');
const upload = require('../../middleware/upload');

const router = express.Router();

router.get('/', protect, getHomeFeed);
router.post('/', protect, upload.array('images', 5), validate(createPostSchema), createPost);
router.put('/:id/like', protect, likePost);
router.put('/:id/share', protect, sharePost);

module.exports = router;
