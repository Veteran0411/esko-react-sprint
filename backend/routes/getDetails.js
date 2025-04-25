import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose"; // Reuse Mongoose connection

const router = express.Router();

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to local JSON fallback
const dataPath = path.join(__dirname, "..", "data", "data.json");

// Function to fetch data from MongoDB (using existing Mongoose connection)
async function getDataFromMongoDB() {
  try {

    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected");
    }

  
    const data = await mongoose.connection.db.collection("data").find({}).toArray();
    return data;

  } catch (error) {
    console.error("Error fetching from MongoDB:", error);
    throw error;
  }
}

// Function to fetch data from local JSON (fallback)
function getDataFromLocalFile() {
  try {
    console.log("Looking for data.json at:", dataPath);
    const rawData = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading data.json:", error);
    throw error;
  }
}

// Route handler (try MongoDB first, fallback to JSON)
router.get("/", async (req, res) => {
  try {
    const mongoData = await getDataFromMongoDB();
    console.log("MongoDB data fetched successfully.");
    console.log("MongoDB data:", mongoData); // Log the fetched data
    res.json(mongoData);
  } catch (mongoError) {
    console.log("Falling back to local JSON file...");
    try {
      const localData = getDataFromLocalFile();
      console.log("Local JSON data fetched successfully.");
      res.json(localData);
    } catch (fileError) {
      res.status(500).json({ 
        error: "All data sources failed",
        details: {
          mongoError: mongoError.message,
          fileError: fileError.message,
          expectedPath: path.normalize("C:/Users/soha/IdeaProjects/react sprint/project/backend/data/data.json")
        }
      });
    }
  }
});

export default router;