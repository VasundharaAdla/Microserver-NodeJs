const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'Authentication microservice - User registration, login, JWT validation',
    },
    servers: [{ url: `http://localhost:${config.port}`, description: 'Auth Service' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from /login',
        },
      },
    },
    security: [],
  },
  apis: [path.join(__dirname, '../routes/auth.js')],
};

module.exports = swaggerJsdoc(swaggerOptions);
