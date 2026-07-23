const userSwagger = {
  '/api/v1/users/me': {
    get: {
      tags: ['Users'],
      summary: 'Get current user profile',
      parameters: [
        {
          name: 'firebaseUid',
          in: 'header',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Returns the current user profile' },
      },
    },
  },
  '/api/v1/users/discover': {
    get: {
      tags: ['Users'],
      summary: 'Discover new users',
      description: 'Fetch all users excluding the current user and their existing connections.',
      parameters: [
        {
          name: 'firebaseUid',
          in: 'header',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Array of users' },
      },
    },
  },
  '/api/v1/users/connect': {
    post: {
      tags: ['Users'],
      summary: 'Send a connection request',
      parameters: [
        {
          name: 'firebaseUid',
          in: 'header',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                receiverId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
              },
              required: ['receiverId'],
            },
          },
        },
      },
      responses: {
        200: { description: 'Connection request sent successfully' },
        400: { description: 'Invalid request' },
      },
    },
  },
  '/api/v1/users/connect/accept': {
    post: {
      tags: ['Users'],
      summary: 'Accept a connection request',
      parameters: [
        {
          name: 'firebaseUid',
          in: 'header',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                senderId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
              },
              required: ['senderId'],
            },
          },
        },
      },
      responses: {
        200: { description: 'Connection accepted' },
        400: { description: 'Invalid request' },
      },
    },
  },
};

module.exports = userSwagger;
