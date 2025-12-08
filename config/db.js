// // config/db.js
// import pg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const { Pool } = pg;

// // Neon works best with this format:
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false, // required for Neon
//   }
// });

// pool.connect()
//   .then(() => console.log("Connected to Neon PostgreSQL"))
//   .catch(err => console.error("DB connection error:", err));

// export default pool;


import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

// Neon requires sslmode=require
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool
  .connect()
  .then(client => {
    console.log("Connected to Neon PostgreSQL");
    client.release();
  })
  .catch(err => console.error("DB Connection Error:", err));

export default pool;
