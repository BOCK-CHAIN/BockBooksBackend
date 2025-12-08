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
    const books = await getAllBooks();
    res.json({ success: true, books });

  } catch (e) {
    res.status(500).json({ error: "Failed fetching books" });
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
