import Project from '../models/Project.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsPath = path.join(__dirname, '..', 'data', 'projects.json');

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    console.log("MongoDB projects fetched successfully");
    res.status(200).json(projects);
  } catch (mongoError) {
    console.log("Falling back to local JSON file...");
    try {
      const rawData = fs.readFileSync(projectsPath, "utf-8");
      const localProjects = JSON.parse(rawData);
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
};

export const updateProjectAssignments = async (req, res) => {
  try {
    const { projectName, assignedEmails } = req.body;

    const updatedProject = await Project.findOneAndUpdate(
      { projectName },
      { 
        isAssigned: true,
        assignedTo: assignedEmails || []
      },
      { new: true }
    );

    if (updatedProject) {
      // Also update JSON file as fallback
      try {
        const rawData = fs.readFileSync(projectsPath, "utf-8");
        const projects = JSON.parse(rawData);
        const updatedProjects = projects.map(project => 
          project.projectName === projectName 
            ? { ...project, isAssigned: true, assignedTo: assignedEmails || [] }
            : project
        );
        fs.writeFileSync(projectsPath, JSON.stringify(updatedProjects, null, 2));
      } catch (fileError) {
        console.warn("Warning: JSON update failed, but MongoDB update successful");
      }

      return res.status(200).json({
        success: true,
        message: 'Project assignments updated successfully',
        project: updatedProject
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });

  } catch (error) {
    console.error('Error updating project assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project assignments',
      error: error.message
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      createdAt: new Date(),
      isAssigned: false,
      assignedTo: []
    };

    const newProject = new Project(projectData);
    const savedProject = await newProject.save();
    console.log("Project added to MongoDB successfully");

    // Also update JSON file as fallback
    try {
      const rawData = fs.readFileSync(projectsPath, "utf-8");
      const projects = JSON.parse(rawData);
      projects.push(savedProject.toObject());
      fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
      console.log("Project added to JSON file successfully");
    } catch (fileError) {
      console.warn("Warning: JSON update failed, but MongoDB save successful");
    }

    res.status(201).json({
      success: true,
      message: 'Project added successfully',
      project: savedProject
    });

  } catch (error) {
    console.error('Error adding new project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add new project',
      error: error.message
    });
  }
};