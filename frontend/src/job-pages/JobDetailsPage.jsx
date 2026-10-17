import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getJobById,
  applyToJob,
  scanATS,
  toggleSaveJob,
} from "../services/api";
import {
  IconMapPin,
  IconDollar,
  IconBriefcase,
  IconSparkles,
  IconBrain,
  IconFileText,
  IconCheckCircle,
  IconXCircle,
  IconBookmark,
  IconClock,
} from "../components/Icons";

function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, ats, interview
  const [isSaved, setIsSaved] = useState(false);

  // Application state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [error, setError] = useState("");

  // ATS Scanner state
  const [resumeText, setResumeText] = useState(user?.resumeText || "");
  const [scanningATS, setScanningATS] = useState(false);
  const [atsResult, setAtsResult] = useState(null);

  // Interview state
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    if (user && job) {
      const ids = (user.savedJobs || []).map((j) => (typeof j === "string" ? j : j._id));
      setIsSaved(ids.includes(job._id));
    }
  }, [user, job]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await getJobById(id);
      setJob(res.data);
    } catch (err) {
      setError("Job details could not be loaded.");
    }
    setLoading(false);
  };

  const handleToggleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const res = await toggleSaveJob(id);
      setIsSaved(res.data.isSaved);
      updateUser({ savedJobs: res.data.savedJobs });
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setApplying(true);
    setError("");
    try {
      await applyToJob({ jobId: id, coverNote });
      setApplied(true);
      setApplyMessage("Application submitted successfully! Track your progress on the dashboard.");
      setApplyModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application.");
    }
    setApplying(false);
  };

  const handleRunATSScan = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setScanningATS(true);
    try {
      const res = await scanATS({
        jobId: id,
        resumeText: resumeText || user?.skills?.join(", ") || "",
      });
      setAtsResult(res.data);
    } catch (err) {
      console.error("ATS Scan failed:", err);
    }
    setScanningATS(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-sm">Loading job insights...</p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-slate-200">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Job Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <Link
            to="/jobs"
            className="inline-block bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-indigo-700"
          >
            Back to All Jobs
          </Link>
        </div>
      </div>
    );
  }

  const matchData = job?.userMatch;
  const questions = job?.interviewQuestions || [];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            ← Back to Job Openings
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                isSaved
                  ? "bg-pink-50 text-pink-700 border-pink-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <IconBookmark className="w-4 h-4" filled={isSaved} />
              <span>{isSaved ? "Saved to Bookmarks" : "Save Job"}</span>
            </button>
          </div>
        </div>

        {/* ── TOP HERO CARD ────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                {job?.company?.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {job?.company}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {job?.title}
                </h1>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <IconMapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job?.location}
                  </span>
                  <span>•</span>
                  <span>{job?.applicantCount || 0} Applicants</span>
                </div>
              </div>
            </div>

            {/* Apply CTA Header button */}
            <div className="w-full sm:w-auto">
              {applied ? (
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2">
                  <IconCheckCircle className="w-5 h-5 text-emerald-600" />
                  {applyMessage || "Application Submitted!"}
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      navigate("/login");
                      return;
                    }
                    setApplyModalOpen(true);
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <IconSparkles className="w-4 h-4 text-teal-300" />
                  <span>Apply Now with Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Key Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Annual Package</span>
              <p className="text-base font-extrabold text-emerald-700 mt-0.5">{job?.salary}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Employment Type</span>
              <p className="text-base font-bold text-slate-800 mt-0.5">{job?.jobType || "Full Time"}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Experience Level</span>
              <p className="text-base font-bold text-slate-800 mt-0.5">{job?.experienceLevel || "Fresher / Entry"}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Date Posted</span>
              <p className="text-base font-bold text-slate-800 mt-0.5">
                {new Date(job?.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* ── AI SKILLMATCH WIDGET (UNIQUE FEATURE #1) ─────────────── */}
        {user?.role === "student" && matchData && (
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-teal-300 mb-2">
                  <IconSparkles className="w-3.5 h-3.5" /> SkillMatch™ Compatibility Engine
                </div>
                <h2 className="text-2xl font-extrabold">Your Profile Match for this Role</h2>
                <p className="text-indigo-200 text-sm mt-1 max-w-xl">
                  {matchData.upskillTip}
                </p>
              </div>

              {/* Radial / Progress Circle */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white/20 min-w-[200px] justify-center">
                <div className="text-center">
                  <span className="text-4xl font-black text-teal-300">{matchData.matchScore}%</span>
                  <span className="block text-[11px] text-indigo-200 uppercase font-bold tracking-wider">
                    Match Score
                  </span>
                </div>
              </div>
            </div>

            {/* Matched vs Missing Skill Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-2.5">
                  <IconCheckCircle className="w-4 h-4 text-emerald-400" />
                  Matching Skills You Have ({matchData.matchedSkills?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchData.matchedSkills?.length > 0 ? (
                    matchData.matchedSkills.map((s, idx) => (
                      <span key={idx} className="bg-emerald-500/20 text-emerald-200 text-xs px-2.5 py-1 rounded-lg border border-emerald-500/30 font-semibold">
                        ✓ {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-indigo-200/60 italic">No direct matches. Consider adding your skills in Profile.</span>
                  )}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2.5">
                  <IconClock className="w-4 h-4 text-amber-400" />
                  Skill Gaps to Upskill ({matchData.missingSkills?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchData.missingSkills?.length > 0 ? (
                    matchData.missingSkills.map((s, idx) => (
                      <span key={idx} className="bg-amber-500/20 text-amber-200 text-xs px-2.5 py-1 rounded-lg border border-amber-500/30 font-semibold">
                        + {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-300 font-bold">100% Skill coverage achieved! 🎉</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── INTERACTIVE TABS: OVERVIEW / ATS SCAN / INTERVIEW PREP ─ */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 pb-2">
          {[
            { id: "overview", label: "Job Description & Perks", icon: <IconBriefcase className="w-4 h-4" /> },
            { id: "ats", label: "ATS Resume Scanner", icon: <IconFileText className="w-4 h-4" /> },
            { id: "interview", label: `Interview Prep Room (${questions.length})`, icon: <IconBrain className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── TAB 1: OVERVIEW ──────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <IconBriefcase className="w-5 h-5 text-indigo-600" />
                Role Overview
              </h2>
              <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {job?.description}
              </div>
            </div>

            {/* Skills & Tech Stack */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <IconSparkles className="w-5 h-5 text-indigo-600" />
                Required Technical Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {(job?.skillsRequired || ["React", "JavaScript", "Node.js"]).map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-3.5 py-1.5 rounded-xl text-xs font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits & Perks */}
            {job?.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <IconCheckCircle className="w-5 h-5 text-emerald-600" />
                  Perks & Benefits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {job.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                      <span className="text-emerald-500">✓</span> {b}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: ATS RESUME SCANNER (UNIQUE FEATURE #2) ────────── */}
        {activeTab === "ats" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Automated Screening Simulator
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  ATS Resume Compatibility Check
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Compare your resume text against this job's requirements before applying.
                </p>
              </div>
              <button
                onClick={handleRunATSScan}
                disabled={scanningATS}
                className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center gap-2"
              >
                {scanningATS ? "Analyzing Keywords..." : "Run ATS Scan Now"}
              </button>
            </div>

            {/* Resume Input Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Your Resume Text / Summary
              </label>
              <textarea
                rows={5}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text, work experience bullets, or key projects here to test ATS keyword density..."
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 text-xs sm:text-sm text-slate-800 font-mono leading-relaxed focus:outline-none"
              />
            </div>

            {/* ATS Results Card */}
            {atsResult && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 text-center">
                    <span className="text-xs font-bold text-indigo-600 uppercase">ATS Score</span>
                    <div className="text-4xl font-black text-indigo-700 mt-1">
                      {atsResult.atsScore}%
                    </div>
                    <span className="text-[11px] text-indigo-500 font-semibold">
                      {atsResult.atsScore >= 75 ? "Excellent Passing Probability" : "Needs Optimization"}
                    </span>
                  </div>

                  <div className="bg-teal-50 p-5 rounded-2xl border border-teal-100 text-center">
                    <span className="text-xs font-bold text-teal-600 uppercase">Action Verbs</span>
                    <div className="text-4xl font-black text-teal-700 mt-1">
                      {atsResult.actionVerbsCount}
                    </div>
                    <span className="text-[11px] text-teal-600 font-semibold">Impact Words Used</span>
                  </div>

                  <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 text-center">
                    <span className="text-xs font-bold text-purple-600 uppercase">Readability</span>
                    <div className="text-4xl font-black text-purple-700 mt-1">
                      {atsResult.readability}
                    </div>
                    <span className="text-[11px] text-purple-500 font-semibold">{atsResult.wordCount} Words Analyzed</span>
                  </div>
                </div>

                {/* Keyword Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                      <IconCheckCircle className="w-4 h-4 text-emerald-600" /> Matched Keywords Found
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.matchedKeywords.length > 0 ? (
                        atsResult.matchedKeywords.map((k, i) => (
                          <span key={i} className="bg-white text-emerald-700 text-xs px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                            ✓ {k}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None detected yet.</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2">
                      <IconXCircle className="w-4 h-4 text-amber-600" /> Missing Target Keywords
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.missingKeywords.length > 0 ? (
                        atsResult.missingKeywords.map((k, i) => (
                          <span key={i} className="bg-white text-amber-700 text-xs px-2.5 py-1 rounded-lg border border-amber-200 font-semibold">
                            + {k}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold">All key technologies matched!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Specific Recommendations */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase mb-2 flex items-center gap-1.5">
                    <IconBrain className="w-4 h-4 text-indigo-600" /> AI Suggestions to Pass Screening
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {atsResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: INTERVIEW PREP ROOM (UNIQUE FEATURE #3) ──────── */}
        {activeTab === "interview" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Built-in Practice Simulator
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                Role-Tailored Interview Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ace your interview with real questions and model answers crafted specifically for {job?.title}.
              </p>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const isOpen = expandedQuestion === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => setExpandedQuestion(isOpen ? -1 : idx)}
                      className="w-full p-5 text-left bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between gap-4 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          Q{idx + 1}
                        </span>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 mr-2">
                            {q.category || "Technical"}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{q.question}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 flex-shrink-0">
                        {isOpen ? "Hide Answer ▲" : "Reveal Answer ▼"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="p-5 bg-white border-t border-slate-100 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-2">
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                          Model Answer & Technical Strategy:
                        </span>
                        <p>{q.answerGuide}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── EASY APPLY MODAL ─────────────────────────────────────── */}
        {applyModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setApplyModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>

              <div className="mb-6">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Direct One-Click Application
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Apply for {job?.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Applying as <strong className="text-slate-700">{user?.name}</strong> ({user?.email})
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Personal Cover Pitch (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly highlight why you're a great fit for this role, key projects, or availability..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 text-xs text-slate-800 leading-relaxed focus:outline-none"
                  />
                </div>

                <div className="bg-indigo-50 p-3.5 rounded-xl text-xs text-indigo-800 flex items-center gap-2">
                  <IconSparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>
                    Your profile skills ({user?.skills?.length || 0}) and match score will be transmitted directly to the recruiter CRM.
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30"
                  >
                    {applying ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetailsPage;