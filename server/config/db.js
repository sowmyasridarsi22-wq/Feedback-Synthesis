
import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing from server/.env');
  }

  try {
    await mongoose.connect(uri, {
      family: 4,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}
