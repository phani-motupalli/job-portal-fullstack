import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJobs, toggleSaveJob } from "../services/api";
import {
  IconSearch,
  IconMapPin,
  IconDollar,
  IconSparkles,
  IconBookmark,
  IconFilter,
  IconBrain,
} from "../components/Icons";

const QUICK_SKILLS = ["React", "Node.js", "Python", "MongoDB", "JavaScript", "AWS", "TypeScript"];
const JOB_TYPES = ["All", "Full Time", "Remote", "Internship", "Part Time", "Contract"];
const EXP_LEVELS = ["All", "Fresher / Entry Level", "Mid-Level (1-3 yrs)", "Senior (4+ yrs)", "Lead / Principal"];

function JobListingPage() {
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedExp, setSelectedExp] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  useEffect(() => {
    if (user?.savedJobs) {
      const ids = user.savedJobs.map((j) => (typeof j === "string" ? j : j._id));
      setSavedJobIds(new Set(ids));
    }
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getJobs();
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
    setLoading(false);
  };

  const handleToggleSave = async (jobId) => {
    if (!user) {
      alert("Please log in to save jobs.");
      return;
    }
    try {
      const res = await toggleSaveJob(jobId);
      const newSaved = new Set(savedJobIds);
      if (res.data.isSaved) {
        newSaved.add(jobId);
      } else {
        newSaved.delete(jobId);
      }
      setSavedJobIds(newSaved);
      updateUser({ savedJobs: Array.from(newSaved) });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // Calculate live match percentage between current user skills & job skills
  const computeMatchScore = (job) => {
    if (!user || user.role !== "student" || !user.skills || user.skills.length === 0) {
      return null;
    }
    const userSkillsLower = user.skills.map((s) => s.toLowerCase().trim());
    const jobSkills = job.skillsRequired || [];
    if (jobSkills.length === 0) return 70; // baseline

    let matchedCount = 0;
    jobSkills.forEach((req) => {
      if (userSkillsLower.some((us) => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us))) {
        matchedCount++;
      }
    });

    return Math.min(100, Math.max(25, Math.round((matchedCount / jobSkills.length) * 100)));
  };

  // Filter application
  const filteredJobs = jobs.filter((job) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q) ||
      (job.skillsRequired && job.skillsRequired.some((s) => s.toLowerCase().includes(q)));

    const matchesType = selectedType === "All" || job.jobType === selectedType;
    const matchesExp = selectedExp === "All" || job.experienceLevel === selectedExp;
    const matchesSkill =
      !selectedSkill ||
      (job.skillsRequired && job.skillsRequired.some((s) => s.toLowerCase() === selectedSkill.toLowerCase()));

    return matchesSearch && matchesType && matchesExp && matchesSkill;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-teal-300 mb-3">
              <IconSparkles className="w-3.5 h-3.5" />
              Live Career Opportunities
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Explore Tech Roles & Match Score
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
              Find openings, check your AI SkillMatch compatibility, and unlock role-specific interview prep.
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 mb-8 space-y-4">
          {/* Main search bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-indigo-500 transition">
              <IconSearch className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by job title, company, or keyword..."
                className="w-full bg-transparent focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-xs text-slate-400 hover:text-slate-600 font-bold">
                  Clear
                </button>
              )}
            </div>

            {/* Job Type Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All Job Types" : type}
                  </option>
                ))}
              </select>

              {/* Exp Level Dropdown */}
              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                {EXP_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp === "All" ? "All Experience" : exp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Skill filter chips */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <IconFilter className="w-3.5 h-3.5" /> Popular Tech:
            </span>
            {QUICK_SKILLS.map((skill) => {
              const active = selectedSkill.toLowerCase() === skill.toLowerCase();
              return (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(active ? "" : skill)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
            {(search || selectedType !== "All" || selectedExp !== "All" || selectedSkill) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedType("All");
                  setSelectedExp("All");
                  setSelectedSkill("");
                }}
                className="text-xs text-red-600 hover:underline font-bold ml-auto"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="text-indigo-600 font-extrabold">{filteredJobs.length}</span> open positions
          </p>
          {user?.skills?.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              <IconSparkles className="w-3.5 h-3.5" /> AI Skill Matching Active
            </span>
          )}
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-sm">Discovering top tech jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No matching roles found</h3>
            <p className="text-xs text-slate-500 mb-6">
              Try adjusting your keyword, experience filter, or job type.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedType("All");
                setSelectedExp("All");
                setSelectedSkill("");
              }}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-indigo-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const matchScore = computeMatchScore(job);
              const isSaved = savedJobIds.has(job._id);

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Top Row: Company Icon, Badges, Bookmark */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                          {job.company?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-500">{job.company}</span>
                          <span className="block text-[11px] font-semibold text-slate-400">
                            {job.jobType || "Full Time"}
                          </span>
                        </div>
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={() => handleToggleSave(job._id)}
                        className={`p-2 rounded-xl transition ${
                          isSaved
                            ? "bg-pink-50 text-pink-600"
                            : "bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        }`}
                        title={isSaved ? "Remove from saved" : "Save job"}
                      >
                        <IconBookmark className="w-4 h-4" filled={isSaved} />
                      </button>
                    </div>

                    {/* Job Title */}
                    <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition leading-snug mb-2">
                      {job.title}
                    </h3>

                    {/* AI SkillMatch Badge if calculated */}
                    {matchScore !== null && (
                      <div className="mb-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border shadow-sm">
                          {matchScore >= 80 ? (
                            <span className="bg-emerald-50 text-emerald-700 border-emerald-200/80 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                              {matchScore}% AI Match • Top Candidate
                            </span>
                          ) : matchScore >= 50 ? (
                            <span className="bg-amber-50 text-amber-700 border-amber-200/80 flex items-center gap-1">
                              ⚡ {matchScore}% AI Match • Solid Fit
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 border-slate-200 flex items-center gap-1">
                              🌱 {matchScore}% Match • Growth Role
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap gap-2 mb-4 text-xs font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                        <IconMapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-md">
                        <IconDollar className="w-3.5 h-3.5 text-emerald-600" />
                        {job.salary}
                      </span>
                    </div>

                    {/* Tech Skill Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {(job.skillsRequired || ["React", "JavaScript"]).slice(0, 4).map((skill, i) => {
                        const isMatch =
                          user?.skills &&
                          user.skills.some((us) => us.toLowerCase() === skill.toLowerCase());
                        return (
                          <span
                            key={i}
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                              isMatch
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {isMatch ? `✓ ${skill}` : skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                      <IconBrain className="w-3.5 h-3.5 text-indigo-500" />
                      Interview Prep Ready
                    </span>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold transition shadow-sm"
                    >
                      View & Apply →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobListingPage;