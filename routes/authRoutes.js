// const express = require("express");
// const router = express.Router();
// const { registerUser, loginUser } = require("../controllers/authController");

// router.post("/signup", registerUser);
// router.post("/login", loginUser);

// module.exports = router;


import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();
router.post("/signup", registerUser);
router.post("/login", loginUser);

export default router;

