const express = require('express');
const { discoverUsers, sendConnectionRequest, acceptConnectionRequest, getMyProfile, getMyConnections, getConnectionRequests, getAllUsers, getUserById } = require('../../controller/userController');
const { protect } = require('../../middleware/authMiddleware');
const { validate } = require('../../middleware/validate');
const { connectRequestSchema, acceptConnectSchema } = require('../../validator');

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.get('/all', protect, getAllUsers);
router.get('/connections', protect, getMyConnections);
router.get('/connection-requests', protect, getConnectionRequests);
router.get('/discover', protect, discoverUsers);
router.get('/:id', protect, getUserById);
router.post('/connect', protect, validate(connectRequestSchema), sendConnectionRequest);
router.post('/connect/accept', protect, validate(acceptConnectSchema), acceptConnectionRequest);

module.exports = router;
