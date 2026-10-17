const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  toggleSaveJob,
  getSavedJobs,
} = require("./authController");
const protect = require("../middleware/authMiddleware");

// POST /api/auth/register — public
router.post("/register", register);

// POST /api/auth/login — public
router.post("/login", login);

// GET /api/auth/profile — protected
router.get("/profile", protect, getProfile);

// PUT /api/auth/profile — protected
router.put("/profile", protect, updateProfile);

// POST /api/auth/save-job — protected
router.post("/save-job", protect, toggleSaveJob);

// GET /api/auth/saved-jobs — protected
router.get("/saved-jobs", protect, getSavedJobs);

module.exports = router;