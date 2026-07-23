const express = require('express');
const authRoutes = require('./v1/auth');
const userRoutes = require('./v1/users');
const postRoutes = require('./v1/posts');
const chatRoutes = require('./v1/chats');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/chats', chatRoutes);

module.exports = router;