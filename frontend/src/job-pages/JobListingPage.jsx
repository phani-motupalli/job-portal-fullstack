import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function JobListingPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://job-portal-fullstack-wpsm.onrender.com/api/jobs");
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 py-16 px-4 relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 bg-white opacity-10 rounded-full"/>
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-white opacity-10 rounded-full"/>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="font-satisfy text-5xl text-white mb-4">Find Your Dream Job</h1>
          <p className="text-indigo-200 text-lg mb-8">
            Discover thousands of opportunities from top companies
          </p>
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-2 flex gap-2">
            <div className="flex-1 flex items-center gap-3 px-4">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by job title, company or location..."
                className="w-full py-3 focus:outline-none text-gray-800"
              />
            </div>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-bold text-indigo-600">{filteredJobs.length}</span> jobs found
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>🎯 Full Time</span>
            <span>🏠 Remote</span>
            <span>💼 Internship</span>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100 group">
                {/* Company Initial */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {job.company?.charAt(0).toUpperCase()}
                  </div>
                  <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Full Time
                  </span>
                </div>

                {/* Job Info */}
                <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-indigo-600 transition">
                  {job.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{job.company}</p>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    📍 {job.location}
                  </span>
                  <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full">
                    💰 {job.salary}
                  </span>
                </div>

                {/* Apply Button */}
                <Link
                  to={`/jobs/${job._id}`}
                  className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition text-sm"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobListingPage;