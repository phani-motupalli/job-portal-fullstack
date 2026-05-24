import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch("https://job-portal-fullstack-pr5j.onrender.com/api/jobs/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message);
        } else {
          setApplications(data);
        }
      } catch (err) {
        setError("Something went wrong.");
      }
      setLoading(false);
    };
    fetchApplications();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted": return "✅";
      case "rejected": return "❌";
      default: return "⏳";
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-white opacity-10 rounded-full"/>
          <div className="absolute bottom-[-20px] left-20 w-24 h-24 bg-white opacity-10 rounded-full"/>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-1">
              My Dashboard 👋
            </h1>
            <p className="text-indigo-200">
              Welcome back, <span className="font-semibold text-white">{user?.name}</span>!
              Track all your job applications here.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Applied",
              value: applications.length,
              icon: "📋",
              color: "bg-indigo-50 text-indigo-600",
            },
            {
              label: "Accepted",
              value: applications.filter((a) => a.status === "accepted").length,
              icon: "✅",
              color: "bg-green-50 text-green-600",
            },
            {
              label: "Pending",
              value: applications.filter((a) => a.status === "pending").length,
              icon: "⏳",
              color: "bg-yellow-50 text-yellow-600",
            },
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

        {/* Applications List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              My Applications
            </h2>
            <Link
              to="/"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Browse More Jobs
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {applications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No applications yet</h3>
              <p className="text-gray-500 mb-6">Start applying to jobs to track them here</p>
              <Link
                to="/"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Browse Jobs →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-indigo-50 transition border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {app.jobId?.company?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{app.jobId?.title}</h3>
                      <p className="text-gray-500 text-sm">{app.jobId?.company} • {app.jobId?.location}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Applied on {new Date(app.createdAt).toLocaleDateString("en-US", {
                          month: "long", day: "numeric", year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)} {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                    </span>
                    <Link
                      to={`/jobs/${app.jobId?._id}`}
                      className="text-indigo-600 hover:underline text-sm font-medium"
                    >
                      View →
                    </Link>
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

export default DashboardPage;