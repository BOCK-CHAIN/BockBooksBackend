import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET; // change to env variable later

// ---------------- REGISTER -----------------
export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ success: false, message: "Missing fields" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
  "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
  [email, hashedPassword, role]
);
    return res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Signup error" });
  }
};

// ---------------- LOGIN -----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "2d" });
    return res.status(200).json({ success: true, token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Login error" });
  }
};
