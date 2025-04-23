// db/connect.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
   const conn= await mongoose.connect("mongodb://localhost:27017/intern-portal");
    console.log("✅ MongoDB Connected");
    return conn; // Return the connection object
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process with failure if DB connection fails
  }
};

export default connectDB;
