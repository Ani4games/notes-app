import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notesapp';

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) {
    return;
  }

  try {
    // Try connecting with Mongoose 6+ approach (no options needed)
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // If the error mentions options, try fallback approach
    if (error.message.includes('options') || error.message.includes('useNewUrlParser')) {
      console.log('⚠️  Trying fallback connection for older Mongoose versions...');
      try {
        // Fallback for Mongoose 5.x
        await mongoose.connect(MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('✅ MongoDB connected successfully (fallback)');
      } catch (fallbackError) {
        console.error('❌ Fallback connection also failed:', fallbackError.message);
        throw fallbackError;
      }
    } else {
      throw error;
    }
  }
}