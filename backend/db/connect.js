// db/connect.js
import mongoose from 'mongoose';
import dotenv from "dotenv"

dotenv.config(); 

const connectDB = async () => {
  try {
   const conn= await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    return conn; // Return the connection object
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process with failure if DB connection fails
  }
};

export default connectDB;
