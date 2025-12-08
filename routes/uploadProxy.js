import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { verifyToken, isAuthor } from "../middleware/authMiddleware.js";
import { uploadBufferToGCS } from "../services/fileService.js";
import { saveBook } from "../models/bookModel.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });

// POST /books/upload-proxy
router.post(
  "/upload-proxy",
  verifyToken,
  isAuthor,
  upload.fields([{ name: "pdf", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const title = req.body.fileName || req.body.title || "Untitled";
      const pdfFile = req.files?.pdf?.[0];
      const coverFile = req.files?.cover?.[0];

      if (!pdfFile || !coverFile) return res.status(400).json({ success: false, message: "pdf and cover required" });

      if (!pdfFile.mimetype.startsWith("application/pdf")) {
        return res.status(400).json({ success: false, message: "Invalid pdf file type" });
      }
      if (!coverFile.mimetype.startsWith("image/")) {
        return res.status(400).json({ success: false, message: "Invalid cover file type" });
      }

      const pdfPath = `books/${Date.now()}_${uuidv4()}_${pdfFile.originalname}`;
      const coverPath = `cover/${Date.now()}_${uuidv4()}_${coverFile.originalname}`;

      await uploadBufferToGCS(pdfFile.buffer, pdfPath, pdfFile.mimetype);
      await uploadBufferToGCS(coverFile.buffer, coverPath, coverFile.mimetype);

      const book = await saveBook({
        userId,
        fileName: title,
        fileUrl: pdfPath,
        coverImageUrl: coverPath,
        contentType: pdfFile.mimetype,
      });

      return res.status(201).json({ success: true, book });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Upload failed" });
    }
  }
);

export default router;