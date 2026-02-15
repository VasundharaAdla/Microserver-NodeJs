const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Validates auth: either X-User-Id from gateway OR Authorization Bearer JWT.
 * Sets req.userId and req.userRole for downstream use.
 */
const requireAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const role = req.headers['x-user-role'];

  if (userId) {
    req.userId = userId;
    req.userRole = role || 'USER';
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Token or X-User-Id required' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.userId;
    req.userRole = decoded.role || 'USER';
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Requires ADMIN role. Must be used after requireAuth.
 * Fetches role from X-User-Role (gateway) or from JWT (direct call).
 */
const requireAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'] || req.userRole;
  if (!role || role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required to delete products' });
  }
  req.userRole = role;
  next();
};

module.exports = { requireAuth, requireAdmin };
