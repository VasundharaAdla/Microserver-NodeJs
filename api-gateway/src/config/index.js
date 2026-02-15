const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

module.exports = {
  port: process.env.PORT_GATEWAY || process.env.PORT || 5000,
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
};
