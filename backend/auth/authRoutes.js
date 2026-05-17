const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("./authController");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/profile (protected - Day 3)
router.get("/profile", getProfile);

module.exports = router;