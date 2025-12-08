import express from "express";
import {
  getUploadURL,
  createBook,
  getBooks,
  getReadURL
} from "../controllers/bookController.js";

import { verifyToken, isAuthor } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
//  AUTHOR-ONLY ROUTES
// =========================

// Step 1: Generate upload URL for PDF OR cover
router.post("/upload-url", verifyToken, isAuthor, getUploadURL);

// Step 2: Save book record in DB
router.post("/", verifyToken, isAuthor, createBook);


// =========================
//  PUBLIC ROUTES
// =========================

// List all books (reader can view)
router.get("/", getBooks);

// Generate signed READ URL (optional: protect using verifyToken)
router.get("/:id/read", verifyToken, getReadURL);

export default router;
