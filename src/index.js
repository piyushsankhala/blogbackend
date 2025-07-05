import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config(); // Load .env variables

const mydatabase = "blogwebsitebackend";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${mydatabase}`);

    console.log("✅ Database connected successfully");

    // Start the server only after DB is connected
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Stop the process on failure
  }
};

connectDB();
