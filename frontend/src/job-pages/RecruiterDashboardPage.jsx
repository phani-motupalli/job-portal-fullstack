import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getMyJobs,
  getJobApplicants,
  updateApplicationStatus,
  deleteJob,
} from "../services/api";
import {
  IconBriefcase,
  IconSparkles,
  IconUser,
  IconTrash,
  IconExternal,
} from "../components/Icons";

const PIPELINE_STATUSES = [
  { id: "pending", label: "Applied", color: "bg-slate-100 text-slate-700" },
  { id: "reviewing", label: "Reviewing", color: "bg-indigo-100 text-indigo-700" },
  { id: "shortlisted", label: "Shortlisted", color: "bg-purple-100 text-purple-700" },
  { id: "interviewing", label: "Interviewing", color: "bg-teal-100 text-teal-700" },
  { id: "accepted", label: "Offered 🎉", color: "bg-emerald-100 text-emerald-800" },
  { id: "rejected", label: "Rejected", color: "bg-rose-100 text-rose-700" },
];

function RecruiterDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Applicant Drawer / Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState({});
  const [noteInputs, setNoteInputs] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "recruiter") {
      navigate("/dashboard");
      return;
    }
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getMyJobs();
      setJobs(res.data || []);
    } catch (err) {
      console.error("Error loading recruiter jobs:", err);
    }
    setLoading(false);
  };

  const handleOpenApplicants = async (job) => {
    setSelectedJob(job);
    setLoadingApplicants(true);
    try {
      const res = await getJobApplicants(job._id);
      setApplicants(res.data.applications || []);
      // Pre-fill notes
      const notes = {};
      (res.data.applications || []).forEach((a) => {
        notes[a._id] = a.recruiterNotes || "";
      });
      setNoteInputs(notes);
    } catch (err) {
      console.error("Error loading applicants:", err);
    }
    setLoadingApplicants(false);
  };

  const handleStatusChange = async (appId, newStatus) => {
    setStatusUpdating((prev) => ({ ...prev, [appId]: true }));
    try {
      await updateApplicationStatus(appId, {
        status: newStatus,
        recruiterNotes: noteInputs[appId] || "",
      });
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
      // update local jobs application counts
      fetchJobs();
    } catch (err) {
      alert("Failed to update applicant status.");
    }
    setStatusUpdating((prev) => ({ ...prev, [appId]: false }));
  };

  const handleSaveNotes = async (appId) => {
    try {
      await updateApplicationStatus(appId, {
        recruiterNotes: noteInputs[appId] || "",
      });
      alert("Candidate notes saved successfully!");
    } catch (err) {
      alert("Failed to save notes.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to remove this job posting and its applicant records?")) {
      return;
    }
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      if (selectedJob?._id === jobId) setSelectedJob(null);
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applications?.length || 0), 0);
  const interviewingCount = jobs.reduce(
    (acc, j) =>
      acc + (j.applications?.filter((a) => a.status === "interviewing" || a.status === "shortlisted").length || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-sm">Loading recruiter CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Recruiter Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-teal-300 mb-2">
                <IconSparkles className="w-3.5 h-3.5" /> Employer Talent Command Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">Recruiter CRM & ATS</h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                Review incoming candidates ranked by AI SkillMatch, manage pipeline, and schedule interviews.
              </p>
            </div>
            <Link
              to="/post-job"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
              <span>+ Post New Opening</span>
            </Link>
          </div>
        </div>

        {/* CRM Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active Roles</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{jobs.length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Candidates</span>
            <div className="text-3xl font-black text-indigo-600 mt-1">{totalApplicants}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Shortlisted / Interviews</span>
            <div className="text-3xl font-black text-teal-600 mt-1">{interviewingCount}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Hiring Velocity</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">High</div>
          </div>
        </div>

        {/* ── JOB POSTINGS TABLE ───────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <IconBriefcase className="w-5 h-5 text-indigo-600" />
            Your Open Positions ({jobs.length})
          </h2>

          {jobs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl p-6">
              <p className="text-slate-500 text-sm mb-4">You have not posted any openings yet.</p>
              <Link
                to="/post-job"
                className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-700"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const count = job.applications?.length || 0;
                return (
                  <div
                    key={job._id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-600 uppercase">
                          {job.company}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">•</span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {job.jobType || "Full Time"}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900">{job.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.salary}</span>
                        <span>
                          📅 {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleOpenApplicants(job)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
                      >
                        <IconUser className="w-4 h-4" />
                        <span>Manage Applicants ({count})</span>
                      </button>

                      <Link
                        to={`/jobs/${job._id}`}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white text-xs font-bold"
                        title="View Public Post"
                      >
                        <IconExternal className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                        title="Delete Job"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── APPLICANT REVIEW MODAL / DRAWER (UNIQUE RECRUITER CRM) ─ */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                ✕
              </button>

              <div className="mb-6 pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Candidate Pipeline
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  Applicants for {selectedJob.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ranked by AI SkillMatch Score against required competencies.
                </p>
              </div>

              {loadingApplicants ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Retrieving applicant profiles...</p>
                </div>
              ) : applicants.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No candidates have applied for this position yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map((app) => {
                    const cand = app.userId || {};
                    return (
                      <div
                        key={app._id}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                      >
                        {/* Candidate Top Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-base flex items-center justify-center shadow">
                              {cand.name?.charAt(0).toUpperCase() || "C"}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-900">{cand.name}</h4>
                              <p className="text-xs text-slate-500">{cand.email}</p>
                              {cand.headline && (
                                <p className="text-xs text-indigo-600 font-semibold">{cand.headline}</p>
                              )}
                            </div>
                          </div>

                          {/* Match Score Badge */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                                {app.matchScore || 70}% SkillMatch
                              </span>
                              <span className="block text-[10px] text-slate-400 mt-1">
                                Applied {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Candidate Skills */}
                        {cand.skills && cand.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cand.skills.map((s, idx) => (
                              <span
                                key={idx}
                                className="bg-white text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-slate-200"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Candidate Pitch */}
                        {app.coverNote && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                            <span className="font-bold text-slate-900 block mb-0.5">Cover Pitch:</span>
                            {app.coverNote}
                          </div>
                        )}

                        {/* External Links */}
                        <div className="flex items-center gap-3 text-xs font-bold">
                          {cand.github && (
                            <a
                              href={cand.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              GitHub <IconExternal className="w-3 h-3" />
                            </a>
                          )}
                          {cand.linkedin && (
                            <a
                              href={cand.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              LinkedIn <IconExternal className="w-3 h-3" />
                            </a>
                          )}
                          {cand.portfolio && (
                            <a
                              href={cand.portfolio}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              Portfolio <IconExternal className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Pipeline Stage Buttons */}
                        <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-500 mr-1">Move Stage:</span>
                            {PIPELINE_STATUSES.map((st) => (
                              <button
                                key={st.id}
                                disabled={statusUpdating[app._id]}
                                onClick={() => handleStatusChange(app._id, st.id)}
                                className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition ${
                                  app.status === st.id
                                    ? `${st.color} border-current ring-2 ring-indigo-400/30`
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {st.label}
                              </button>
                            ))}
                          </div>

                          {/* Recruiter Private Notes */}
                          <div className="w-full flex items-center gap-2 mt-2">
                            <input
                              type="text"
                              value={noteInputs[app._id] || ""}
                              onChange={(e) =>
                                setNoteInputs((prev) => ({ ...prev, [app._id]: e.target.value }))
                              }
                              placeholder="Private evaluation feedback / interview date..."
                              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                            />
                            <button
                              onClick={() => handleSaveNotes(app._id)}
                              className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-black"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboardPage;