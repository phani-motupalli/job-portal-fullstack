const express = require("express");
const router = express.Router();
const {
  getJobs,
  createJob,
  getJobById,
  applyToJob,
  getApplications,
} = require("./jobController");

// GET /api/jobs — public
router.get("/", getJobs);

// POST /api/jobs/create — protected (Day 3 we add protection)
router.post("/create", createJob);

// GET /api/jobs/applications — protected (Day 3 we add protection)
router.get("/applications", getApplications);

// GET /api/jobs/:id — public
router.get("/:id", getJobById);

// POST /api/jobs/apply — protected (Day 3 we add protection)
router.post("/apply", applyToJob);

module.exports = router;