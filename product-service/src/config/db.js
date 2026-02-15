const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async (retries = 5) => {
  const mongoUri = config.mongoUri;
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(mongoUri);
      console.log('Product Service: MongoDB Connected');
      return;
    } catch (error) {
      console.error(`MongoDB Connection attempt ${i + 1}/${retries}:`, error.message);
      if (i === retries - 1) process.exit(1);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
};

module.exports = connectDB;
