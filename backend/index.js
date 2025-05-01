import express from "express";
import cors from "cors";
import getDetailsRoutes from "./routes/getDetails.js";
import postDetailsRoutes from "./routes/form/postDetails.js";
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

// API Routes
app.use("/api/getDetails", getDetailsRoutes);
app.use("/api/postDetails", postDetailsRoutes);
app.use("/api/projects", getProjectsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profiles", profileRoutes);

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Serve React static files
const frontendPath = path.join(__dirname, 'client');
app.use(express.static(frontendPath));

// Catch-all route for React SPA
// Replace the existing catch-all route with this:
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});