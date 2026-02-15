const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

module.exports = {
  port: process.env.PORT_AUTH || process.env.PORT || 5001,
  mongoUri: process.env.MONGO_URI_AUTH || process.env.MONGO_URI || 'mongodb://localhost:27017/auth_db',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpires: process.env.JWT_EXPIRES || '7d',
};
