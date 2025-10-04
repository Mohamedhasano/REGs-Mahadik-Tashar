import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/regs-global';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('');
    console.log('🔧 MongoDB not installed? No problem!');
    console.log('👉 Use MongoDB Atlas (Free): https://www.mongodb.com/cloud/atlas/register');
    console.log('👉 Or install locally: https://www.mongodb.com/try/download/community');
    console.log('');
    console.log('⚠️  Server will continue without database (limited features)');
    console.log('');
    // Don't exit - let server run without DB for development
    // process.exit(1);
  }
};

