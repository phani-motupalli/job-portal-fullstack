import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      try {
        const response = await fetch("https://job-portal-fullstack-wpsm.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) setError(data.message);
        else setUser(data);
      } catch (err) {
        setError("Something went wrong.");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
};

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Link to="/login" className="text-indigo-600 hover:underline">Go to Login</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 h-36 relative">
            <div className="absolute top-[-40px] right-[-40px] w-40 h-40 bg-white opacity-10 rounded-full"/>
            <div className="absolute bottom-[-20px] left-20 w-20 h-20 bg-white opacity-10 rounded-full"/>
          </div>
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-14 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                <span className="text-4xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                user?.role === "recruiter"
                  ? "bg-green-100 text-green-700"
                  : "bg-indigo-100 text-indigo-700"
              }`}>
                {user?.role === "recruiter" ? "🏢 Recruiter" : "🎓 Student"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-gray-500 mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            Account Details
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                label: "Full Name",
                value: user?.name,
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                label: "Email Address",
                value: user?.email,
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                label: "Account Type",
                value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1),
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                label: "Member Since",
                value: new Date(user?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                }),
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                  <p className="text-gray-800 font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/"
            className="bg-white text-indigo-600 border-2 border-indigo-600 py-3 rounded-xl font-semibold text-center hover:bg-indigo-50 transition"
          >
            Browse Jobs
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition shadow-md"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;