const express = require("express");
const router = express.Router();
const {
  getJobs,
  createJob,
  getJobById,
  applyToJob,
  getApplications,
  getMyJobs,
  getJobApplicants,
  updateApplicationStatus,
  deleteJob,
  scanATSResume,
} = require("./jobController");
const protect = require("../middleware/authMiddleware");

// GET /api/jobs — public (supports ?search, ?jobType, ?experienceLevel, ?location)
router.get("/", getJobs);

// POST /api/jobs/create — protected (recruiter)
router.post("/create", protect, createJob);

// GET /api/jobs/applications — protected (candidate)
router.get("/applications", protect, getApplications);

// GET /api/jobs/myjobs — protected (recruiter)
router.get("/myjobs", protect, getMyJobs);

// GET /api/jobs/applicants/:jobId — protected (recruiter view candidate list)
router.get("/applicants/:jobId", protect, getJobApplicants);

// PUT /api/jobs/applications/:id — protected (recruiter update status)
router.put("/applications/:id", protect, updateApplicationStatus);

// DELETE /api/jobs/:id — protected (recruiter delete job)
router.delete("/:id", protect, deleteJob);

// POST /api/jobs/ats-scan — protected (ATS Resume Matcher)
router.post("/ats-scan", protect, scanATSResume);

// GET /api/jobs/:id — public / optional auth for match calculation
router.get("/:id", getJobById);

// POST /api/jobs/apply — protected (candidate apply with cover note)
router.post("/apply", protect, applyToJob);

module.exports = router;