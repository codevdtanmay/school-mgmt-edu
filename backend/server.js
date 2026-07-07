import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Serve React build
app.use(express.static(path.join(__dirname, "dist")));

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running"
  });
});

// React Router support
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next(); // Let Express continue to API routes / 404
  }

  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});