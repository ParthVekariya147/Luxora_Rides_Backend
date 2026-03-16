const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/luxora_backend';
    const conn = await mongoose.connect(uri); // Mongoose v6+ uses modern parser and topology by default

    console.log(`MongoDB Connected🚀: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
