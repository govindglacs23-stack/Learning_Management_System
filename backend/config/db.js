// Database configuration and connection
const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/lms';

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  try {
    console.log(`Connecting to MongoDB: ${mongoUri}`);
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error (${mongoUri}): ${error.message}`);
    console.error('Trying fallback local URI 127.0.0.1:27017...');

    if (mongoUri !== 'mongodb://127.0.0.1:27017/lms') {
      try {
        const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/lms', options);
        console.log(`MongoDB Connected to local fallback: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackError) {
        console.error(`Fallback connection error: ${fallbackError.message}`);
      }
    }

    console.error('All MongoDB connection attempts failed. Please check your MongoDB URL and network access.');
    process.exit(1);
  }
};

module.exports = connectDB;
