import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[DB Warning] MONGODB_URI is not set. Database operations will fail.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'studentDB',
    });
    console.log(`[DB Success] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[DB Error] Failed to connect to MongoDB: ${error.message}`);
    return false;
  }
};

export const getDBStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return states[stateCode] || 'unknown';
};
