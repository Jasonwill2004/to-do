import mongoose from "mongoose";
import testConfig from './test.config.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    const uri = process.env.NODE_ENV === 'test' 
      ? testConfig.mongodb.uri
      : process.env.MONGO_URI;

    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB Disconnected');
  }
};