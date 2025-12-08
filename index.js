import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadProxy from "./routes/uploadProxy.js";
import "./config/db.js"; // initializes database connection

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // to parse JSON request bodies

// Routes
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/books", uploadProxy); // exposes /books/upload-proxy

// Health Check Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Book Library Backend is running 🚀" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
