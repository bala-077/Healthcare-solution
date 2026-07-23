const postSwagger = {
  '/api/v1/posts': {
    get: {
      tags: ['Posts'],
      summary: 'Get home feed',
      description: 'Fetch current user profile and the latest 5 posts.',
      parameters: [
        {
          name: 'firebaseUid',
          in: 'header',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Returns profile and posts' },
      },
    },
    post: {
      tags: ['Posts'],
      summary: 'Create a new post',
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
                content: { type: 'string', example: 'This is my first post!' },
                image: { type: 'string', example: 'https://example.com/post.jpg' },
              },
              required: ['content'],
            },
          },
        },
      },
      responses: {
        201: { description: 'Post created successfully' },
        400: { description: 'Validation failed' },
      },
    },
  },
};

module.exports = postSwagger;
