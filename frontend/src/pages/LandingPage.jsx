import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getJobs } from "../services/api";
import {
  IconSparkles,
  IconSearch,
  IconBrain,
  IconFileText,
  IconCheckCircle,
  IconMapPin,
  IconDollar,
  IconChevronRight,
} from "../components/Icons";

function LandingPage() {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then((res) => {
        setFeaturedJobs(res.data.slice(0, 3));
      })
      .catch((err) => console.error("Error loading featured jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Ambient glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-teal-300 mb-8 shadow-inner">
            <IconSparkles className="w-4 h-4 text-teal-300 animate-spin" style={{ animationDuration: "6s" }} />
            Next-Generation AI Career & Job Discovery Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Match Smarter.{" "}
            <span className="bg-gradient-to-r from-teal-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              Interview Better.
            </span>{" "}
            Get Hired.
          </h1>

          <p className="text-lg sm:text-xl text-indigo-100/90 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            The only job portal with built-in <strong className="text-white">SkillMatch™ AI</strong>, 
            instant <strong className="text-white">ATS Resume Screening</strong>, and role-specific 
            <strong className="text-white"> Interview Prep Rooms</strong>.
          </p>

          {/* Quick Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 border border-white/40"
          >
            <div className="flex-1 flex items-center gap-3 px-3 text-slate-700">
              <IconSearch className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job title, tech skill (React, Node, Python), or company..."
                className="w-full bg-transparent py-2.5 focus:outline-none text-sm sm:text-base font-medium placeholder:text-slate-400 text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <span>Explore Opportunities</span>
              <IconChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Trust stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 pt-10 border-t border-white/10 text-left">
            {[
              { val: "94%", label: "Placement Match Accuracy", sub: "Powered by AI vectors" },
              { val: "10,000+", label: "Verified Tech Jobs", sub: "From seed to unicorn" },
              { val: "< 2 mins", label: "ATS Resume Scan", sub: "Instant keyword feedback" },
              { val: "1-Click", label: "Interview Prep Room", sub: "Tailored mock answers" },
            ].map((stat, i) => (
              <div key={i} className="p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 mb-0.5">{stat.val}</div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">{stat.label}</div>
                <div className="text-[11px] text-indigo-200/70">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4 UNIQUE PILLARS / WHY WE STAND OUT ───────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Why We Are Unique
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
            Built for the Modern Tech Candidate
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Traditional job boards are black holes. We give you full transparency, intelligent scoring, and interview mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <IconSparkles className="w-6 h-6 text-indigo-600" />,
              color: "bg-indigo-50 border-indigo-100 text-indigo-600",
              title: "SkillMatch™ AI Engine",
              desc: "Analyzes your exact tech skills against job requirements. See match percentages, missing gaps, and targeted upskill advice before applying.",
            },
            {
              icon: <IconFileText className="w-6 h-6 text-teal-600" />,
              color: "bg-teal-50 border-teal-100 text-teal-600",
              title: "Smart ATS Resume Scanner",
              desc: "Tests your resume against any job description in real-time. Highlights missing target keywords and suggests impact action verbs.",
            },
            {
              icon: <IconBrain className="w-6 h-6 text-purple-600" />,
              color: "bg-purple-50 border-purple-100 text-purple-600",
              title: "Role Interview Prep Room",
              desc: "Every job posting comes with a built-in interview simulator featuring technical questions, system design guides, and model answers.",
            },
            {
              icon: <IconCheckCircle className="w-6 h-6 text-emerald-600" />,
              color: "bg-emerald-50 border-emerald-100 text-emerald-600",
              title: "Kanban Pipeline Tracker",
              desc: "Candidates track stages (Reviewing, Shortlisted, Interviewing, Offered). Recruiters review candidates ranked by skill match score.",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between group"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${card.color} group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED JOBS PREVIEW ─────────────────────────────────── */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">
                Fresh Openings
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Featured Opportunities
              </h2>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 text-sm"
            >
              <span>View All Openings ({featuredJobs.length}+)</span>
              <IconChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading fresh jobs...</div>
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
              <p className="text-slate-600 font-medium">No jobs available right now.</p>
              <Link to="/post-job" className="text-indigo-600 font-bold text-sm mt-2 inline-block">
                Post the first opening →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition border border-slate-200/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                        {job.company?.charAt(0).toUpperCase()}
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {job.jobType || "Full Time"}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 hover:text-indigo-600 transition mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 mb-3">{job.company}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                        <IconMapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                        <IconDollar className="w-3.5 h-3.5 text-emerald-600" />
                        {job.salary}
                      </span>
                    </div>

                    {/* Skill chips */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {(job.skillsRequired || ["React", "JavaScript"]).slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/jobs/${job._id}`}
                    className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 transition"
                  >
                    View Details & Prep →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── DUAL CTA SECTION ─────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Candidates */}
          <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <span className="text-xs uppercase font-extrabold tracking-widest text-teal-300">
                For Job Seekers
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-3">
                Accelerate Your Tech Career
              </h3>
              <p className="text-indigo-200 text-sm leading-relaxed mb-6">
                Create a free profile, get instant SkillMatch scoring on thousands of roles, and ace your technical interviews.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-indigo-900 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition shadow-lg text-sm"
              >
                <span>Create Student Account</span>
                <IconChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* For Recruiters */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
            <div className="relative z-10">
              <span className="text-xs uppercase font-extrabold tracking-widest text-purple-300">
                For Employers & Recruiters
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-3">
                Hire Pre-Ranked Top Talent
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Post roles in 60 seconds. Our algorithm scores candidate profiles against your technical requirements automatically.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-6 py-3 rounded-xl hover:opacity-95 transition shadow-lg text-sm"
              >
                <span>Post Jobs & Hire</span>
                <IconChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 px-4 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 JobPortal.ai — Next-Gen AI-Powered Career Platform.</p>
          <div className="flex gap-6 font-medium">
            <Link to="/jobs" className="hover:text-white transition">All Jobs</Link>
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;