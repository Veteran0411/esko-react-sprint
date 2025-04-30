import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import connectDB from '../db/connect.js';

const createAdmin = async () => {
  try {
    await connectDB();
    
    const admin = new Admin({
      username: 'admin',
      password: 'admin123'  // Will be hashed automatically
    });

    await admin.save();
    console.log('Admin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();