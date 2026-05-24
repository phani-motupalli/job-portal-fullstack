const express = require("express");
const router = express.Router();
const {
  getJobs,
  createJob,
  getJobById,
  applyToJob,
  getApplications,
  getMyJobs,
} = require("./jobController");
const protect = require("../middleware/authMiddleware");

// GET /api/jobs — public
router.get("/", getJobs);

// POST /api/jobs/create — protected
router.post("/create", protect, createJob);

// GET /api/jobs/applications — protected
router.get("/applications", protect, getApplications);

// GET /api/jobs/myjobs — protected (recruiter only)
router.get("/myjobs", protect, getMyJobs);

// GET /api/jobs/:id — public
router.get("/:id", getJobById);

// POST /api/jobs/apply — protected
router.post("/apply", protect, applyToJob);

module.exports = router;