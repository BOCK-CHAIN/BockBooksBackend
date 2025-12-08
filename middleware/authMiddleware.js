// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET;

// exports.verifyToken = (req, res, next) => {
//     const token = req.headers["authorization"];

//     if (!token)
//         return res.status(401).json({ success: false, message: "Token missing" });

//     jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
//         if (err)
//             return res.status(401).json({ success: false, message: "Invalid token" });

//         req.user = decoded;
//         next();
//     });
// };

// exports.isAuthor = (req, res, next) => {
//     if (req.user.role !== "author")
//         return res.status(403).json({ success: false, message: "Authors only" });

//     next();
// };



import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "Token missing" });

  const token = authHeader.includes(" ") ? authHeader.split(" ")[1] : authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const isAuthor = (req, res, next) => {
  if (!req.user || req.user.role !== "author")
    return res.status(403).json({ success: false, message: "Authors only" });
  next();
};
