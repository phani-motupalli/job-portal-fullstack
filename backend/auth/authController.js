const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ── REGISTER ──────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, skills, headline } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
      skills: Array.isArray(skills) ? skills : [],
      headline: headline || "",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      headline: user.headline,
      skills: user.skills,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      headline: user.headline,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      education: user.education,
      portfolio: user.portfolio,
      github: user.github,
      linkedin: user.linkedin,
      resumeText: user.resumeText,
      savedJobs: user.savedJobs || [],
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET PROFILE ───────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE PROFILE ────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      name,
      headline,
      bio,
      skills,
      experience,
      education,
      portfolio,
      github,
      linkedin,
      resumeText,
    } = req.body;

    if (name) user.name = name;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills.map((s) => s.trim()).filter(Boolean)
        : typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
    }
    if (experience !== undefined) user.experience = experience;
    if (education !== undefined) user.education = education;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (resumeText !== undefined) user.resumeText = resumeText;

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── TOGGLE SAVE JOB ───────────────────────────────────────────────
exports.toggleSaveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.savedJobs.indexOf(jobId);
    let isSaved = false;
    if (index === -1) {
      user.savedJobs.push(jobId);
      isSaved = true;
    } else {
      user.savedJobs.splice(index, 1);
      isSaved = false;
    }

    await user.save();
    res.json({ isSaved, savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET SAVED JOBS ────────────────────────────────────────────────
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedJobs");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.savedJobs || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};