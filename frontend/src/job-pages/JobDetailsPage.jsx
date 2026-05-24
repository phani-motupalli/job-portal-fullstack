import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`https://job-portal-fullstack-pr5j.onrender.com/api/jobs/${id}`);
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError("Job not found.");
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setApplying(true);
    try {
      const response = await fetch("https://job-portal-fullstack-pr5j.onrender.com/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: id }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        setApplied(true);
        setMessage("Successfully applied! Check your dashboard.");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
    setApplying(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-gray-500">Loading job details...</p>
      </div>
    </div>
  );

  if (error && !job) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Link to="/" className="text-indigo-600 hover:underline">Back to Jobs</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:underline mb-6 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>

        {/* Job Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 h-24 relative">
            <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-white opacity-10 rounded-full"/>
          </div>
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-10 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                <span className="text-3xl font-bold text-white">
                  {job?.company?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="bg-indigo-50 text-indigo-600 text-sm font-semibold px-4 py-2 rounded-full">
                Full Time
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{job?.title}</h1>
            <p className="text-gray-500 text-lg mb-4">{job?.company}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1 bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full">
                📍 {job?.location}
              </span>
              <span className="flex items-center gap-1 bg-green-50 text-green-600 text-sm px-4 py-2 rounded-full">
                💰 {job?.salary}
              </span>
              <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-sm px-4 py-2 rounded-full">
                📅 {new Date(job?.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        {/* Job Description Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Job Description
          </h2>
          <p className="text-gray-600 leading-relaxed">{job?.description}</p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && job && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Apply Button */}
        <div className="flex gap-4">
          <button
            onClick={handleApply}
            disabled={applying || applied}
            className={`flex-1 py-4 rounded-2xl font-bold text-lg transition shadow-lg ${
              applied
                ? "bg-green-500 text-white cursor-default"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-xl"
            }`}
          >
            {applying ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Applying...
              </span>
            ) : applied ? "✅ Applied Successfully!" : "Apply Now →"}
          </button>
          <Link
            to="/dashboard"
            className="px-8 py-4 rounded-2xl font-bold text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 transition"
          >
            Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}

export default JobDetailsPage;