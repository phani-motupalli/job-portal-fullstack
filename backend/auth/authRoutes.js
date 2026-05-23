const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("./authController");
const protect = require("../middleware/authMiddleware");

// POST /api/auth/register — public
router.post("/register", register);

// POST /api/auth/login — public
router.post("/login", login);

// GET /api/auth/profile — protected (must be logged in)
router.get("/profile", protect, getProfile);

module.exports = router;