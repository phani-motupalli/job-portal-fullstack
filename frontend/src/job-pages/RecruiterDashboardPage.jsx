import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function RecruiterDashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "recruiter") { navigate("/dashboard"); return; }

    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/jobs/myjobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) setError(data.message);
        else setJobs(data);
      } catch (err) {
        setError("Something went wrong.");
      }
      setLoading(false);
    };
    fetchMyJobs();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-gray-500">Loading your jobs...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-white opacity-10 rounded-full"/>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Recruiter Dashboard 🏢</h1>
              <p className="text-indigo-200">Manage your job postings and applications</p>
            </div>
            <Link
              to="/post-job"
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
            >
              + Post New Job
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Jobs Posted", value: jobs.length, icon: "💼", color: "bg-indigo-50 text-indigo-600" },
            { label: "Total Applications", value: jobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0), icon: "📋", color: "bg-purple-50 text-purple-600" },
            { label: "Active Jobs", value: jobs.length, icon: "✅", color: "bg-green-50 text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-md p-6 text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              💼
            </span>
            My Job Postings
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs posted yet</h3>
              <p className="text-gray-500 mb-6">Post your first job to start finding candidates</p>
              <Link
                to="/post-job"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Post First Job →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-indigo-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {job.company?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{job.title}</h3>
                        <p className="text-gray-500 text-sm">{job.company} • {job.location} • {job.salary}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Posted on {new Date(job.createdAt).toLocaleDateString("en-US", {
                            month: "long", day: "numeric", year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold">
                        {job.applications?.length || 0} Applications
                      </span>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-indigo-600 hover:underline text-sm font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboardPage;