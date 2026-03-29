const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri || uri.includes('localhost')) {
    console.warn('⚠️  Warning: MONGODB_URI is not set to a production Atlas URL. Current value:', uri);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    if (error.message.includes('timeout')) {
      console.error('👉 Tip: Check if your IP address is whitelisted in MongoDB Atlas (Network Access).');
    }
  }
};

module.exports = connectDB;
