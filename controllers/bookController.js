// bookController.js
import {
  generateUploadURL,
  generateReadURL
} from "../services/fileService.js";

import {
  saveBook,
  getAllBooks,
  getBookById
} from "../models/bookModel.js";
import pool from "../config/db.js";

export const getUploadURL = async (req, res) => {
  try {
    const { fileName, contentType, fileType } = req.body;

    const folder = fileType === "pdf" ? "books" : "cover";
    const filePath = `${folder}/${Date.now()}_${fileName}`;

    const uploadURL = await generateUploadURL(filePath, contentType);

    res.json({
      success: true,
      uploadURL,
      filePath
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed generating upload URL" });
  }
};

// export const createBook = async (req, res) => {
//   try {
//     const { userId, fileName, pdfPath, coverImagePath, contentType } = req.body;

//     const book = await saveBook({
//       userId,
//       fileName,
//       fileUrl: pdfPath,
//       coverImageUrl: coverImagePath,
//       contentType
//     });

//     res.json({ success: true, book });

//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Failed to save book" });
//   }
// };

export const createBook = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { fileName, pdfPath, coverImagePath, contentType } = req.body;

    const book = await saveBook({
      userId,
      fileName,
      fileUrl: pdfPath,
      coverImageUrl: coverImagePath,
      contentType
    });

    res.status(201).json({ success: true, book });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to save book" });
  }
};


export const getBooks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, file_name, file_url, cover_image_url, content_type, user_id
       FROM books
       ORDER BY created_at DESC`
    );

    const rows = result.rows;

    const books = await Promise.all(
      rows.map(async (b) => {
        const coverReadUrl = b.cover_image_url ? await generateReadURL(b.cover_image_url) : null;
        const pdfReadUrl = b.file_url ? await generateReadURL(b.file_url) : null;
        return {
          id: b.id,
          fileName: b.file_name,
          coverImageUrl: b.cover_image_url, // relative path stored in DB
          fileUrl: b.file_url,
          contentType: b.content_type,
          userId: b.user_id,
          coverReadUrl,
          pdfReadUrl,
        };
      })
    );

    res.json({ success: true, books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch books" });
  }
};

export const getReadURL = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);

    if (!book) return res.status(404).json({ error: "Book not found" });

    const signedURL = await generateReadURL(book.file_url);

    res.json({
      success: true,
      url: signedURL
    });

  } catch (e) {
    res.status(500).json({ error: "Failed generating read URL" });
  }
};
