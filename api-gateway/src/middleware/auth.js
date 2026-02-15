const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = config.jwtSecret;

/**
 * Middleware: Validate JWT and attach user to request
 * Used for protected routes (create/update/delete products, validate-token)
 */
const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * Middleware: Validate JWT AND require ADMIN role
 * Used for delete product
 */
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required to delete products.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = { validateToken, requireAdmin };
