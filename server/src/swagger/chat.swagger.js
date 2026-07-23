const chatSwagger = {
  '/api/v1/chats/{receiverId}': {
    get: {
      tags: ['Chats'],
      summary: 'Get chat history',
      description: 'Fetch chat messages between the current user and the specified receiver.',
      parameters: [
        {
          name: 'firebaseUid',
          in: 'header',
          required: true,
          schema: { type: 'string' },
        },
        {
          name: 'receiverId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'The ID of the user to get chat history with',
        },
      ],
      responses: {
        200: { description: 'Returns an array of chat messages' },
        403: { description: 'Not connected' },
      },
    },
  },
  '/api/v1/chats': {
    post: {
      tags: ['Chats'],
      summary: 'Send a message',
      description: 'Send a text message or share a post with a connected user.',
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
                message: { type: 'string', example: 'Hello there!' },
                sharedPostId: { type: 'string', example: '60d0fe4f5311236168a109cb' },
              },
              required: ['receiverId'],
            },
          },
        },
      },
      responses: {
        201: { description: 'Message sent' },
        400: { description: 'Validation failed' },
        403: { description: 'Not connected' },
      },
    },
  },
};

module.exports = chatSwagger;
