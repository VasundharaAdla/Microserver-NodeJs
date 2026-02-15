const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');

const app = express();

// CORS - permissive for Swagger and API calls
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());

// Swagger UI
const swaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    tryItOutEnabled: true,
  },
  customSiteTitle: 'E-Commerce API Docs',
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// API routes
app.use('/', routes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', gateway: 'running' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
