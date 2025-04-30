import express from "express";
import { getAllProfiles } from "../controllers/profileController.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to local JSON fallback
const dataPath = path.join(__dirname, "..", "data", "data.json");

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
    // First try to get data from MongoDB using the controller
    await getAllProfiles(req, res);
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
          expectedPath: path.normalize(dataPath)
        }
      });
    }
  }
});

export default router;