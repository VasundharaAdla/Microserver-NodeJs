const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const productRoutes = require('./routes/products');

const app = express();

app.use(cors());
app.use(express.json());

// Swagger UI with Authorize
const swaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
  },
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// API routes
app.use('/products', productRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
