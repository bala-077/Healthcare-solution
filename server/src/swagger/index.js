const authSwagger = require('./auth.swagger');
const userSwagger = require('./user.swagger');
const postSwagger = require('./post.swagger');
const chatSwagger = require('./chat.swagger');

const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Healthcare Platform API',
    version: '1.0.0',
    description: 'API Documentation for the Healthcare Platform',
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Development server',
    },
  ],
  paths: {
    ...authSwagger,
    ...userSwagger,
    ...postSwagger,
    ...chatSwagger,
  },
};

module.exports = swaggerDocs;
