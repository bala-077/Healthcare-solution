const express = require('express');
const { onboardUser } = require('../../controller/authController');
const { protect } = require('../../middleware/authMiddleware');
const { validate } = require('../../middleware/validate');
const { onboardingSchema } = require('../../validator');

const router = express.Router();

router.post('/onboarding', protect, validate(onboardingSchema), onboardUser);

module.exports = router;
