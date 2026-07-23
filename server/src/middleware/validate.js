const { z } = require('zod');

// Validate body parameters
const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
      });
    }
    next(error);
  }
};

module.exports = { validate };
