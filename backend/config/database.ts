import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.warn('DATABASE_URL not set. Backend will run without database connection.');
      return;
    }

    // Check if it's MongoDB
    if (dbUrl.startsWith('mongodb://') || dbUrl.startsWith('mongodb+srv://')) {
      await mongoose.connect(dbUrl);
      console.log('MongoDB connected successfully');
    } else {
      console.log('PostgreSQL configuration detected. Using alternative setup.');
      // PostgreSQL connection would be handled separately
    }
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('Database disconnected');
  }
};
