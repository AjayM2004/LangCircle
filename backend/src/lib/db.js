import mongoose from "mongoose";

// Asynchronous function to connect to MongoDB
export const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Log successful connection with the host name
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Log any connection errors and exit the process
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};