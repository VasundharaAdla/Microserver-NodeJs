const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API Gateway',
      version: '1.0.0',
      description: 'Unified API documentation for Auth Service and Product Service. All APIs are routed through this gateway. **1) Login via POST /auth/login 2) Copy the token 3) Click Authorize and paste it 4) Call protected endpoints.**',
      contact: {
        name: 'API Gateway',
      },
    },
    servers: [
      { url: '/', description: 'Current server (use same URL as Swagger UI)' },
      { url: `http://localhost:${config.port}`, description: 'Localhost' },
    ],
  },
  apis: [path.join(__dirname, '../routes/docs.js')],
};

module.exports = swaggerJsdoc(swaggerOptions);
