import express from "express";
import { getAllProjects, updateProjectAssignments, createProject } from '../../controllers/projectController.js';

const router = express.Router();

// Routes
router.get('/getProjects', getAllProjects);
router.post('/updateAssignments', updateProjectAssignments);
router.post('/postProjects', createProject);

export default router;