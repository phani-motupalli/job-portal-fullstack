import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createJob } from "../services/api";
import {
  IconBriefcase,
  IconSparkles,
  IconCheckCircle,
  IconBrain,
} from "../components/Icons";

const POPULAR_SKILLS = [
  "React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript",
  "Python", "AWS", "Docker", "Tailwind CSS", "Next.js", "SQL", "Git"
];

const DEFAULT_BENEFITS = [
  "Work From Home / Remote Option",
  "Health & Wellness Insurance",
  "Learning & Certification Budget",
  "Flexible Work Schedule",
  "Annual Company Retreat"
];

function PostJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [experienceLevel, setExperienceLevel] = useState("Fresher / Entry Level");

  // Skills
  const [skills, setSkills] = useState(["React", "JavaScript"]);
  const [skillInput, setSkillInput] = useState("");

  // Benefits
  const [benefits, setBenefits] = useState(["Work From Home / Remote Option", "Health & Wellness Insurance"]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Recruiter authorization check
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-slate-200">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Login Required</h2>
          <p className="text-xs text-slate-500 mb-6">Please sign in as a recruiter to post jobs.</p>
          <Link to="/login" className="bg-indigo-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "recruiter") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-slate-200">
          <div className="text-4xl mb-3">🚫</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Recruiter Access Only</h2>
          <p className="text-xs text-slate-500 mb-6">
            Your current account is registered as a Student. Only recruiters can publish job openings.
          </p>
          <Link to="/jobs" className="bg-indigo-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
            Explore Openings
          </Link>
        </div>
      </div>
    );
  }

  const handleAddSkill = (s) => {
    const val = (s || skillInput).trim();
    if (!val) return;
    if (!skills.some((ex) => ex.toLowerCase() === val.toLowerCase())) {
      setSkills([...skills, val]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (rem) => {
    setSkills(skills.filter((s) => s !== rem));
  };

  const toggleBenefit = (b) => {
    if (benefits.includes(b)) {
      setBenefits(benefits.filter((item) => item !== b));
    } else {
      setBenefits([...benefits, b]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createJob({
        title,
        company,
        description,
        salary,
        location,
        jobType,
        experienceLevel,
        skillsRequired: skills,
        benefits,
      });

      setSuccess("Job posted successfully with AI SkillMatch & Interview Prep enabled! 🎉");
      setTimeout(() => navigate("/recruiter-dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
              Talent Acquisition
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Create a High-Impact Job Opening 💼
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Our AI engine automatically extracts skills, generates mock interview questions, and ranks applicants.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <IconCheckCircle className="w-5 h-5 text-emerald-600" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Core Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <IconBriefcase className="w-5 h-5 text-indigo-600" />
              Role Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Tech Solutions"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hyderabad, India (or Remote)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Annual Salary / Compensation *
                </label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 10 - 15 LPA or $90,000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Employment Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none bg-white"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Target Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none bg-white"
                >
                  <option value="Fresher / Entry Level">Fresher / Entry Level</option>
                  <option value="Mid-Level (1-3 yrs)">Mid-Level (1-3 yrs)</option>
                  <option value="Senior (4+ yrs)">Senior (4+ yrs)</option>
                  <option value="Lead / Principal">Lead / Principal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Detailed Job Description *
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe day-to-day responsibilities, tech stack, team culture, and qualifications..."
                className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Card 2: SkillMatch Requirements */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <IconSparkles className="w-5 h-5 text-indigo-600" />
              Required Skills (Powers SkillMatch™ AI)
            </h2>
            <p className="text-xs text-slate-500">
              Applicants are scored against these competencies automatically upon applying.
            </p>

            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-2xl bg-slate-50 border border-slate-200">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-white/80 hover:text-white font-black"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type skill & press Enter..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-700"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.map((ps) => (
                <button
                  key={ps}
                  type="button"
                  onClick={() => handleAddSkill(ps)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold"
                >
                  + {ps}
                </button>
              ))}
            </div>
          </div>

          {/* Card 3: Benefits & Perks */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <IconCheckCircle className="w-5 h-5 text-emerald-600" />
              Perks & Benefits Offered
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEFAULT_BENEFITS.map((ben) => {
                const checked = benefits.includes(ben);
                return (
                  <button
                    type="button"
                    key={ben}
                    onClick={() => toggleBenefit(ben)}
                    className={`text-left p-3 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
                      checked
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{checked ? "✓" : "+"}</span>
                    <span>{ben}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Interview Room Notice */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center gap-3">
            <IconBrain className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div>
              <strong className="block font-bold">Auto-Generated Interview Prep Room Enabled</strong>
              <span>
                Our AI platform will automatically craft role-tailored technical & situational mock questions for this position.
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/30 transition"
            >
              {loading ? "Publishing Role..." : "Publish Job Opening →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJobPage;