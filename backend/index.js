import express from "express";
import cors from "cors";
import  getDetailsRoutes from "./routes/getDetails.js"
import postDetailsRoutes from "./routes/form/postDetails.js"
import getProjectsRoutes from "./routes/project/project.js";
import adminRoutes from "./routes/adminRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from "./db/connect.js";
import profileRoutes from "./routes/profileRoutes.js"; 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (optional for now)
// Route middleware
app.use("/api/getDetails", getDetailsRoutes);
app.use("/api/postDetails",postDetailsRoutes);
app.use("/api/projects",getProjectsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profiles", profileRoutes); // Add this route

// when we work with es6 we have to get dirname like this
//  (import meta url) file:///C:/Users/soha/IdeaProjects/react%20sprint/project/backend/index.js
// __filename: C:/Users/soha/IdeaProjects/react sprint/project/backend/index.js
// __dirname:  C:/Users/soha/IdeaProjects/react sprint/project/backend

const __filename = fileURLToPath(import.meta.url); // absolute path of current executing file (index.js)
const __dirname = path.dirname(__filename); //directory name of the current executing file (index.js)

// Make uploads publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Connect to MongoDB asynchronously in the background
connectDB().catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
});
