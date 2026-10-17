import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/api";
import {
  IconUser,
  IconSparkles,
  IconCheckCircle,
  IconBriefcase,
  IconFileText,
} from "../components/Icons";

const SUGGESTED_SKILLS = [
  "React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript",
  "Python", "Tailwind CSS", "Next.js", "AWS", "Docker", "Git", "SQL"
];

function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resumeText, setResumeText] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await getProfile();
      const d = res.data;
      setName(d.name || "");
      setHeadline(d.headline || "");
      setBio(d.bio || "");
      setSkills(d.skills || []);
      setExperience(d.experience || "");
      setEducation(d.education || "");
      setPortfolio(d.portfolio || "");
      setGithub(d.github || "");
      setLinkedin(d.linkedin || "");
      setResumeText(d.resumeText || "");
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddSkill = (skillToAdd) => {
    const s = (skillToAdd || skillInput).trim();
    if (!s) return;
    if (!skills.some((existing) => existing.toLowerCase() === s.toLowerCase())) {
      setSkills([...skills, s]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await updateProfile({
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
      });
      updateUser(res.data);
      setSuccessMsg("Profile & AI SkillMatch competencies updated successfully! 🎉");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg("Failed to update profile.");
    }
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-semibold">Loading profile settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg border border-white/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                  {user?.role === "recruiter" ? "🏢 Recruiter Profile" : "🎓 Candidate Profile"}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.name}</h1>
                <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white text-xs font-bold transition border border-white/20"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Feedback banners */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
            <IconCheckCircle className="w-5 h-5 text-emerald-600" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold">
            {errorMsg}
          </div>
        )}

        {/* ── PROFILE FORM ────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Bio & Headline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <IconUser className="w-5 h-5 text-indigo-600" />
              Professional Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Full Stack MERN Engineer | React & Node.js"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bio / Summary
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Passionate engineer who loves solving complex backend problems..."
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: AI SkillMatch Competency Center */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <IconSparkles className="w-5 h-5 text-indigo-600" />
                Technical Skills & Competencies (Feeds SkillMatch™)
              </h2>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {skills.length} Skills Listed
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Our AI Match engine uses these skills to calculate your real-time compatibility score for every job posting.
            </p>

            {/* Current Skills Chips */}
            <div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-2xl bg-slate-50 border border-slate-200">
              {skills.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No skills added yet. Type or click below.</span>
              ) : (
                skills.map((s) => (
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
                ))
              )}
            </div>

            {/* Add skill input */}
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
                placeholder="Add a technology (e.g. Next.js, Docker, Redis) and press Enter..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-700"
              >
                + Add Skill
              </button>
            </div>

            {/* Quick click suggestions */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                Quick Add Popular Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SKILLS.map((sk) => (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleAddSkill(sk)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60"
                  >
                    + {sk}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Links & Experience */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <IconBriefcase className="w-5 h-5 text-indigo-600" />
              Experience & Portfolios
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Years of Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none bg-white"
                >
                  <option value="">Select Experience</option>
                  <option value="Fresher / Student">Fresher / Student (0 yrs)</option>
                  <option value="1-2 years">1 - 2 years</option>
                  <option value="3-5 years">3 - 5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Education
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. B.Tech in Computer Science"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://myportfolio.dev"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: ATS Resume Text */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <IconFileText className="w-5 h-5 text-indigo-600" />
              ATS Resume Summary
            </h2>
            <p className="text-xs text-slate-500">
              Save your resume text here so you can run 1-click ATS scans on any job posting in seconds.
            </p>
            <textarea
              rows={5}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste plain text of your resume, key technical projects, work experience bullets..."
              className="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:border-indigo-500 focus:outline-none leading-relaxed bg-slate-50"
            />
          </div>

          {/* Submit CTA */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <IconSparkles className="w-4 h-4 text-teal-300" />
              <span>{saving ? "Saving Changes..." : "Save Profile & Sync Skills"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;