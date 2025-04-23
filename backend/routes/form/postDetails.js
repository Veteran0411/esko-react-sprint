import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import mongoose from "mongoose";   // Import the existing connection

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsPath = path.join(__dirname, '..', '..', 'public', 'uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const dataPath = path.join(__dirname, '..', '..', 'data', 'data.json');

router.post('/', upload.single('pic'), async (req, res) => {
  try {
    console.log("Attempting to write to:", dataPath);
    
    // Read existing data
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const existingData = JSON.parse(rawData);

    // Create new entry
    const newEntry = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phoneNo: req.body.phoneNo,
      funFact: req.body.funFact,
      joiningDate: req.body.joiningDate,
      pic: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : "http://localhost:5000/uploads/default.jpg",
      skills: req.body.skills || "React, Node.js", // Use submitted skills or default
      nickname: "Newbie",
      rating: 3.5,
      role: "Intern"
    };

    // Add to MongoDB
    const db = await mongoose.connection.db.collection('data').insertOne(newEntry);

    console.log("MongoDB data inserted successfully:", db);
    // Keep existing JSON file logic
    const updatedData = [...existingData, newEntry];
    fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2));
    console.log("Successfully wrote to:", dataPath);

    res.status(201).json({
      success: true,
      message: 'Data added successfully to MongoDB and JSON file',
      data: newEntry,
      filePath: dataPath
    });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update data',
      error: error.message,
      attemptedPath: dataPath
    });
  }
});

export default router;