const authSwagger = {
  '/api/v1/auth/onboarding': {
    post: {
      tags: ['Auth'],
      summary: 'Onboard a new user',
      description: 'Creates or updates a user profile. Requires a valid firebaseUid in the headers.',
      parameters: [
        {
          name: 'firebaseUid',
          in: 'header',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Firebase UID for authentication',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                mobileNumber: { type: 'string', example: '+919876543210' },
                name: { type: 'string', example: 'John Doe' },
                occupation: { type: 'string', example: 'Doctor' },
                profileImage: { type: 'string', example: 'https://example.com/image.jpg' },
              },
              required: ['mobileNumber', 'name', 'occupation'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User successfully onboarded',
        },
        400: {
          description: 'Validation failed or user exists',
        },
      },
    },
  },
};

module.exports = authSwagger;
