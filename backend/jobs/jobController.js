const Job = require("../models/Job");
const Application = require("../models/Application");

// ── GET ALL JOBS ──────────────────────────────────────────────────
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── CREATE JOB ────────────────────────────────────────────────────
exports.createJob = async (req, res) => {
  try {
    const { title, company, description, salary, location } = req.body;

    // Check if all fields are provided
    if (!title || !company || !description || !salary || !location) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const job = await Job.create({
      title,
      company,
      description,
      salary,
      location,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET JOB BY ID ─────────────────────────────────────────────────
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── APPLY TO JOB ──────────────────────────────────────────────────
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      jobId,
      userId: req.user._id,
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = await Application.create({
      jobId,
      userId: req.user._id,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET MY APPLICATIONS ───────────────────────────────────────────
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.user._id,
    }).populate("jobId");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET MY JOBS (Recruiter) ───────────────────────────────────────
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};