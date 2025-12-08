// import pool from "../config/db.js";
// import { v4 as uuidv4 } from "uuid";

// export const saveBook = async ({
//   userId,
//   fileName,
//   fileUrl,
//   coverImageUrl,
//   contentType
// }) => {
//   const id = uuidv4();

//   const result = await pool.query(
//     `INSERT INTO books 
//      (id, user_id, file_name, file_url, cover_image_url, content_type)
//      VALUES ($1, $2, $3, $4, $5, $6)
//      RETURNING *`,
//     [id, userId, fileName, fileUrl, coverImageUrl, contentType]
//   );

//   return result.rows[0];
// };

// export const getAllBooks = async () => {
//   const res = await pool.query(
//     `SELECT id, file_name, cover_image_url, created_at
//      FROM books ORDER BY created_at DESC`
//   );
//   return res.rows;
// };

// export const getBookById = async (id) => {
//   const res = await pool.query(
//     `SELECT * FROM books WHERE id=$1`,
//     [id]
//   );
//   return res.rows[0];
// };


// bookModel.js
import pool from "../config/db.js";

export const saveBook = async ({
  userId,
  fileName,
  fileUrl,
  coverImageUrl,
  contentType
}) => {
  const query = `
    INSERT INTO books (id, user_id, file_name, file_url, cover_image_url, content_type)
    VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [userId, fileName, fileUrl, coverImageUrl, contentType];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllBooks = async () => {
  const { rows } = await pool.query("SELECT * FROM books ORDER BY created_at DESC");
  return rows;
};

export const getBookById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  return rows[0];
};
