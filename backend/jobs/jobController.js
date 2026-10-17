const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");
const {
  extractSkills,
  calculateMatchScore,
  scanATS,
  generateInterviewQuestions,
} = require("../utils/aiMatcher");

// ── GET ALL JOBS (With Search, Filtering & Stats) ─────────────────
exports.getJobs = async (req, res) => {
  try {
    const { search, jobType, experienceLevel, location } = req.query;
    const filter = { status: "active" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skillsRequired: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (jobType && jobType !== "All") {
      filter.jobType = jobType;
    }

    if (experienceLevel && experienceLevel !== "All") {
      filter.experienceLevel = experienceLevel;
    }

    if (location && location !== "All") {
      filter.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    // Attach applicant count to each job
    const jobIds = jobs.map((j) => j._id);
    const appCounts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    appCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const jobsWithCounts = jobs.map((job) => ({
      ...job.toObject(),
      applicantCount: countMap[job._id.toString()] || 0,
    }));

    res.json(jobsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── CREATE JOB (Recruiter) ────────────────────────────────────────
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      salary,
      location,
      jobType,
      experienceLevel,
      skillsRequired,
      benefits,
      interviewQuestions,
    } = req.body;

    if (!title || !company || !description || !salary || !location) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Process skills array
    let skills = Array.isArray(skillsRequired)
      ? skillsRequired
      : typeof skillsRequired === "string" && skillsRequired.trim()
      ? skillsRequired.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (skills.length === 0) {
      skills = extractSkills(`${title} ${description}`);
      if (skills.length === 0) {
        skills = ["JavaScript", "React", "Node.js"];
      }
    }

    // Process benefits array
    let benefitsArr = Array.isArray(benefits)
      ? benefits
      : typeof benefits === "string" && benefits.trim()
      ? benefits.split(",").map((b) => b.trim()).filter(Boolean)
      : ["Flexible Work Hours", "Health Insurance", "Learning & Development Budget"];

    // Process or auto-generate interview questions
    let questions = Array.isArray(interviewQuestions) && interviewQuestions.length > 0
      ? interviewQuestions
      : generateInterviewQuestions(title, skills);

    const job = await Job.create({
      title,
      company,
      description,
      salary,
      location,
      jobType: jobType || "Full Time",
      experienceLevel: experienceLevel || "Fresher / Entry Level",
      skillsRequired: skills,
      benefits: benefitsArr,
      interviewQuestions: questions,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET JOB BY ID (Includes AI Match Score for logged-in users) ────
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const jobObj = job.toObject();

    // Applicant count
    const appCount = await Application.countDocuments({ jobId: job._id });
    jobObj.applicantCount = appCount;

    // If request contains an authorization header, try to compute match score
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.role === "student") {
          const matchData = calculateMatchScore(
            user.skills || [],
            job.skillsRequired || [],
            job.description
          );
          jobObj.userMatch = matchData;
        }
      } catch (e) {
        // Token error ignored for public view
      }
    }

    res.json(jobObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── APPLY TO JOB ──────────────────────────────────────────────────
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, coverNote } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const alreadyApplied = await Application.findOne({
      jobId,
      userId: req.user._id,
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    // Compute Candidate Match Score
    const user = await User.findById(req.user._id);
    const matchAnalysis = calculateMatchScore(
      user.skills || [],
      job.skillsRequired || [],
      job.description
    );

    const application = await Application.create({
      jobId,
      userId: req.user._id,
      coverNote: coverNote || "",
      matchScore: matchAnalysis.matchScore,
      matchedSkills: matchAnalysis.matchedSkills,
      missingSkills: matchAnalysis.missingSkills,
      status: "pending",
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET MY APPLICATIONS (Candidate) ───────────────────────────────
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.user._id,
    })
      .populate("jobId")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET MY JOBS (Recruiter) ───────────────────────────────────────
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });

    // Aggregate applications for each job
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("userId", "name email headline skills experience portfolio github linkedin")
      .sort({ createdAt: -1 });

    const jobMap = {};
    jobs.forEach((j) => {
      jobMap[j._id.toString()] = {
        ...j.toObject(),
        applications: [],
      };
    });

    applications.forEach((app) => {
      const jId = app.jobId.toString();
      if (jobMap[jId]) {
        jobMap[jId].applications.push(app);
      }
    });

    res.json(Object.values(jobMap));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET APPLICANTS FOR SPECIFIC JOB (Recruiter) ───────────────────
exports.getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view applicants for this job" });
    }

    const applications = await Application.find({ jobId })
      .populate("userId", "name email headline skills experience education portfolio github linkedin resumeText")
      .sort({ matchScore: -1, createdAt: -1 });

    res.json({
      job,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE APPLICATION STATUS (Recruiter Pipeline) ───────────────
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params; // Application ID
    const { status, recruiterNotes } = req.body;

    const application = await Application.findById(id).populate("jobId");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify recruiter owns the job
    if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    if (status) application.status = status;
    if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes;

    await application.save();

    res.json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE JOB (Recruiter) ────────────────────────────────────────
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await Application.deleteMany({ jobId: id });
    await Job.findByIdAndDelete(id);

    res.json({ message: "Job and related applications removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── ATS RESUME SCANNER ────────────────────────────────────────────
exports.scanATSResume = async (req, res) => {
  try {
    const { jobId, resumeText } = req.body;
    let textToScan = resumeText;

    if (!textToScan && req.user) {
      const user = await User.findById(req.user._id);
      textToScan = user?.resumeText || (user?.skills ? user.skills.join(", ") : "");
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const result = scanATS(job.description, job.title, textToScan);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};