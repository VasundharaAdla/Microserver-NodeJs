const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { validateToken, requireAdmin } = require('../middleware/auth');
const config = require('../config');

const router = express.Router();
const { authServiceUrl, productServiceUrl } = config;

const addUserHeaders = (proxyReq, req) => {
  if (req.user) {
    proxyReq.setHeader('X-User-Id', req.user.userId);
    proxyReq.setHeader('X-User-Role', req.user.role || 'USER');
  }
};

const addCorsHeaders = (proxyRes) => {
  proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
  proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
};

const proxyErrorHandler = (err, req, res) => {
  console.error('Proxy error:', err.message);
  if (!res.headersSent) {
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'Unable to reach service. Ensure Auth Service and Product Service are running.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

const proxyOpts = (target, options = {}) => ({
  target,
  changeOrigin: true,
  timeout: 30000,
  onError: proxyErrorHandler,
  onProxyRes: addCorsHeaders,
  ...options,
});

// ----- AUTH ROUTES (with /auth prefix) -----
router.use(
  '/auth/register',
  createProxyMiddleware(proxyOpts(authServiceUrl, { pathRewrite: { '^/auth': '' } }))
);

router.use(
  '/auth/login',
  createProxyMiddleware(proxyOpts(authServiceUrl, { pathRewrite: { '^/auth': '' } }))
);

router.use(
  '/auth/validate-token',
  validateToken,
  createProxyMiddleware(proxyOpts(authServiceUrl, { pathRewrite: { '^/auth': '' } }))
);

// ----- AUTH ROUTES (without /auth prefix) -----
router.use('/register', createProxyMiddleware(proxyOpts(authServiceUrl)));
router.use('/login', createProxyMiddleware(proxyOpts(authServiceUrl)));
router.use(
  '/validate-token',
  validateToken,
  createProxyMiddleware(proxyOpts(authServiceUrl))
);

// ----- PRODUCT ROUTES -----
router.get(
  /^\/products(\/.*)?$/,
  createProxyMiddleware(proxyOpts(productServiceUrl))
);

router.post(
  '/products',
  validateToken,
  createProxyMiddleware(proxyOpts(productServiceUrl, { onProxyReq: addUserHeaders }))
);

router.put(
  /^\/products\/.+$/,
  validateToken,
  createProxyMiddleware(proxyOpts(productServiceUrl, { onProxyReq: addUserHeaders }))
);

router.delete(
  /^\/products\/.+$/,
  requireAdmin,
  createProxyMiddleware(proxyOpts(productServiceUrl, { onProxyReq: addUserHeaders }))
);

module.exports = router;
