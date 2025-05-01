import express from 'express';
import multer from 'multer';
import { createProfile } from '../../controllers/profileController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get base URL from environment variables
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

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
    // First try to save to MongoDB using the controller
    await createProfile(req, res);
    
    // Then also save to local JSON file (optional, for fallback)
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const existingData = JSON.parse(rawData);
    
    const newEntry = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phoneNo: req.body.phoneNo,
      funFact: req.body.funFact,
      joiningDate: req.body.joiningDate,
      pic: req.file ? `${BASE_URL}/uploads/${req.file.filename}` : `${BASE_URL}/uploads/default.jpg`,
      skills: req.body.skills || "React, Node.js",
      nickname: "Newbie",
      rating: 3.5,
      role: "Intern"
    };

    const updatedData = [...existingData, newEntry];
    fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2));
    console.log("Successfully wrote to:", dataPath);
  } catch (error) {
    console.error('Error in post route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request',
      error: error.message
    });
  }
});

export default router;