import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to local JSON fallback
const projectsPath = path.join(__dirname, "..", "..", "data", "projects.json");

// Function to fetch projects from MongoDB
async function getProjectsFromMongoDB() {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected");
    }
    const projects = await mongoose.connection.db.collection("projects").find({}).toArray();
    return projects;
  } catch (error) {
    console.error("Error fetching from MongoDB:", error);
    throw error;
  }
}

// Function to fetch projects from local JSON
function getProjectsFromLocalFile() {
  try {
    console.log("Looking for projects.json at:", projectsPath);
    const rawData = fs.readFileSync(projectsPath, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading projects.json:", error);
    throw error;
  }
}

// Get all projects
router.get('/getProjects', async (req, res) => {
  try {
    const mongoProjects = await getProjectsFromMongoDB();
    console.log("MongoDB projects fetched successfully");
    res.status(200).json(mongoProjects);
  } catch (mongoError) {
    console.log("Falling back to local JSON file...");
    try {
      const localProjects = getProjectsFromLocalFile();
      console.log("Local JSON projects fetched successfully");
      res.status(200).json(localProjects);
    } catch (fileError) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch projects from all sources",
        error: {
          mongoError: mongoError.message,
          fileError: fileError.message
        }
      });
    }
  }
});

// Update project assignments
router.post('/updateAssignments', async (req, res) => {
  try {
    const { projectName, assignedEmails } = req.body;

    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const result = await mongoose.connection.db.collection("projects")
        .findOneAndUpdate(
          { projectName: projectName },
          { 
            $set: { 
              isAssigned: true,
              assignedTo: assignedEmails || []
            }
          },
          { returnDocument: 'after' }
        );

      if (result.value) {
        return res.status(200).json({
          success: true,
          message: 'Project assignments updated successfully in MongoDB',
          project: result.value
        });
      }
    }

    // Fallback to JSON file
    console.log("Falling back to local JSON file for update...");
    const rawData = fs.readFileSync(projectsPath, "utf-8");
    const projects = JSON.parse(rawData);

    const updatedProjects = projects.map(project => {
      if (project.projectName === projectName) {
        return {
          ...project,
          isAssigned: true,
          assignedTo: assignedEmails || []
        };
      }
      return project;
    });

    fs.writeFileSync(projectsPath, JSON.stringify(updatedProjects, null, 2));
    const updatedProject = updatedProjects.find(p => p.projectName === projectName);

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project assignments updated successfully in JSON file',
      project: updatedProject
    });

  } catch (error) {
    console.error('Error updating project assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project assignments',
      error: error.message
    });
  }
});

// Add new project
router.post('/postProjects', async (req, res) => {
  try {
    const newProject = {
      ...req.body,
      createdAt: new Date().toISOString(),
      isAssigned: false,
      assignedTo: []
    };

    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const result = await mongoose.connection.db.collection("projects")
        .insertOne(newProject);

      if (result.acknowledged) {
        console.log("Project added to MongoDB successfully");
      }
    }

    // Also update JSON file as fallback
    try {
      const rawData = fs.readFileSync(projectsPath, "utf-8");
      const projects = JSON.parse(rawData);
      projects.push(newProject);
      
      fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
      console.log("Project added to JSON file successfully");

      res.status(201).json({
        success: true,
        message: 'Project added successfully',
        project: newProject
      });
    } catch (fileError) {
      console.error("Error updating JSON file:", fileError);
      // If MongoDB was successful, still return success
      if (mongoose.connection.readyState === 1) {
        res.status(201).json({
          success: true,
          message: 'Project added to MongoDB only',
          project: newProject
        });
      } else {
        throw fileError;
      }
    }

  } catch (error) {
    console.error('Error adding new project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add new project',
      error: error.message
    });
  }
});

export default router;