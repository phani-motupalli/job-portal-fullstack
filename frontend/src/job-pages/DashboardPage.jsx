import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApplications, getSavedJobs } from "../services/api";
import {
  IconSparkles,
  IconBookmark,
  IconBrain,
  IconChevronRight,
} from "../components/Icons";

const PIPELINE_COLUMNS = [
  { id: "pending", label: "Applied", icon: "📋", color: "border-slate-300 bg-slate-50 text-slate-700" },
  { id: "reviewing", label: "Reviewing", icon: "🔍", color: "border-indigo-300 bg-indigo-50 text-indigo-700" },
  { id: "shortlisted", label: "Shortlisted", icon: "⭐", color: "border-purple-300 bg-purple-50 text-purple-700" },
  { id: "interviewing", label: "Interviewing", icon: "💬", color: "border-teal-300 bg-teal-50 text-teal-700" },
  { id: "accepted", label: "Offered 🎉", icon: "🏆", color: "border-emerald-300 bg-emerald-50 text-emerald-700" },
  { id: "rejected", label: "Archived", icon: "✕", color: "border-rose-200 bg-rose-50 text-rose-700" },
];

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pipeline"); // pipeline, saved

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appRes, savedRes] = await Promise.all([
        getApplications(),
        getSavedJobs().catch(() => ({ data: [] })),
      ]);
      setApplications(appRes.data || []);
      setSavedJobs(savedRes.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Profile readiness score
  const calculateProfileStrength = () => {
    let score = 20; // base account
    if (user?.headline) score += 15;
    if (user?.skills && user.skills.length >= 3) score += 25;
    if (user?.resumeText && user.resumeText.length > 50) score += 25;
    if (user?.github || user?.linkedin || user?.portfolio) score += 15;
    return Math.min(100, score);
  };

  const profileStrength = calculateProfileStrength();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-sm">Loading your applications pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Profile Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg border border-white/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">
                  Welcome, {user?.name} 👋
                </h1>
                <p className="text-indigo-200 text-xs sm:text-sm mt-0.5">
                  {user?.headline || "Tech Candidate • Applications Command Center"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(user?.skills || []).slice(0, 5).map((s, idx) => (
                    <span key={idx} className="bg-white/10 text-teal-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Strength Widget */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[240px]">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-indigo-200">Profile Readiness</span>
                <span className="text-teal-300 font-black">{profileStrength}%</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 to-indigo-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
              <Link
                to="/profile"
                className="text-[11px] font-bold text-teal-300 hover:text-white mt-2 block transition"
              >
                + Complete Skills & ATS Resume →
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-6 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                activeTab === "pipeline"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
              }`}
            >
              <span>Application Pipeline ({applications.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                activeTab === "saved"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
              }`}
            >
              <IconBookmark className="w-4 h-4" />
              <span>Saved Bookmarks ({savedJobs.length})</span>
            </button>
          </div>

          <Link
            to="/jobs"
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>Browse More Roles</span>
            <IconChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── KANBAN PIPELINE VIEW ─────────────────────────────────── */}
        {activeTab === "pipeline" && (
          <div>
            {applications.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  🚀
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No Applications Yet</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Explore job openings, calculate your SkillMatch score, and submit 1-click applications.
                </p>
                <Link
                  to="/jobs"
                  className="bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700"
                >
                  Explore Job Openings
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {PIPELINE_COLUMNS.map((col) => {
                  const colApps = applications.filter((a) => {
                    if (col.id === "pending") return !a.status || a.status === "pending";
                    return a.status === col.id;
                  });

                  return (
                    <div
                      key={col.id}
                      className="bg-slate-100/70 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col min-h-[420px]"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-700">
                          <span>{col.icon}</span>
                          <span>{col.label}</span>
                        </div>
                        <span className="w-5 h-5 rounded-full bg-white text-slate-700 font-black text-[11px] flex items-center justify-center shadow-sm">
                          {colApps.length}
                        </span>
                      </div>

                      {/* Cards List in this stage */}
                      <div className="space-y-3 flex-1">
                        {colApps.map((app) => (
                          <div
                            key={app._id}
                            className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition text-left flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                  {app.jobId?.company || "Company"}
                                </span>
                                {app.matchScore > 0 && (
                                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                                    {app.matchScore}% Match
                                  </span>
                                )}
                              </div>

                              <h4 className="font-bold text-xs text-slate-900 leading-tight line-clamp-1 mb-1">
                                {app.jobId?.title || "Role"}
                              </h4>
                              <p className="text-[11px] text-slate-500 mb-2">
                                📍 {app.jobId?.location || "India"}
                              </p>

                              {/* Recruiter feedback notes if available */}
                              {app.recruiterNotes && (
                                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-medium mb-2">
                                  💬 Recruiter note: {app.recruiterNotes}
                                </div>
                              )}
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 mt-2">
                              <span className="text-[10px] text-slate-400">
                                {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                              {app.jobId?._id && (
                                <Link
                                  to={`/jobs/${app.jobId._id}`}
                                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                                >
                                  <IconBrain className="w-3 h-3" />
                                  <span>Prep Room</span>
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SAVED BOOKMARKS TAB ──────────────────────────────────── */}
        {activeTab === "saved" && (
          <div>
            {savedJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  🔖
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No Saved Jobs</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Bookmark exciting jobs while browsing to save them for later applications.
                </p>
                <Link
                  to="/jobs"
                  className="bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700"
                >
                  Explore Openings
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-bold text-slate-500">{job.company}</span>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {job.jobType || "Full Time"}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 mb-1">{job.title}</h3>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{job.description}</p>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 mb-4">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.salary}</span>
                      </div>
                    </div>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm"
                    >
                      View & Apply →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;