const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full Time", "Part Time", "Remote", "Internship", "Contract"],
      default: "Full Time",
    },
    experienceLevel: {
      type: String,
      enum: ["Fresher / Entry Level", "Mid-Level (1-3 yrs)", "Senior (4+ yrs)", "Lead / Principal"],
      default: "Fresher / Entry Level",
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    interviewQuestions: [
      {
        question: { type: String, required: true },
        answerGuide: { type: String, default: "" },
        category: { type: String, default: "Technical" },
      },
    ],
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);