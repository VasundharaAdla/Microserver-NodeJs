const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');

const app = express();
const cors = require("cors");

// CORS: credentials: true cannot be used with origin: "*" (browser rejects it).
// Use origin: true to reflect request origin when you need credentials, or keep credentials: false for public API.
app.use(cors({
  origin: true, // reflect request origin (e.g. http://localhost:5000 for Swagger)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Ensure preflight OPTIONS gets CORS headers and short-circuits
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Parse JSON only for non-proxied routes. Proxied routes must keep the raw body
// so http-proxy-middleware can forward it; otherwise the auth/product services get an empty body.
const jsonParser = express.json();
const isProxiedRoute = (req) => {
  const p = req.path;
  return p.startsWith('/auth') || p === '/register' || p === '/login' || p.startsWith('/validate-token') || p.startsWith('/products');
};
app.use((req, res, next) => {
  if (isProxiedRoute(req)) return next();
  return jsonParser(req, res, next);
});

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
