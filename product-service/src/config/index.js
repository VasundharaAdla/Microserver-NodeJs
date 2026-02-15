const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

module.exports = {
  port: process.env.PORT_PRODUCT || process.env.PORT || 5002,
  mongoUri: process.env.MONGO_URI_PRODUCT || process.env.MONGO_URI || 'mongodb://localhost:27017/product_db',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
};
