const express = require('express');
const { getChatHistory, getRecentChats, sendMessage } = require('../../controller/chatController');
const { protect } = require('../../middleware/authMiddleware');
const { validate } = require('../../middleware/validate');
const { sendMessageSchema } = require('../../validator');

const router = express.Router();

router.get('/recent', protect, getRecentChats);
router.get('/:receiverId', protect, getChatHistory);
router.post('/', protect, validate(sendMessageSchema), sendMessage);

module.exports = router;
