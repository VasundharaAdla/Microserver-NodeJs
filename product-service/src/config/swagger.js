const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Service API',
      version: '1.0.0',
      description: 'Product microservice - CRUD operations. **Login via Auth Service, then click Authorize to add JWT.**',
    },
    servers: [{ url: `http://localhost:${config.port}`, description: 'Product Service' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT from Auth Service /login (without "Bearer " prefix)',
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/products.js')],
};

module.exports = swaggerJsdoc(swaggerOptions);
