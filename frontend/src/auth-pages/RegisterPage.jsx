import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("https://job-portal-fullstack-wpsm.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute top-[-80px] left-[-80px] w-64 h-64 bg-white opacity-10 rounded-full"/>
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 bg-white opacity-10 rounded-full"/>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-teal-300 opacity-20 rounded-full"/>
        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="font-satisfy text-5xl mb-4">JobPortal</h1>
          <p className="text-indigo-200 text-lg mb-10">Your career journey starts here</p>

          {/* Benefits */}
          <div className="space-y-4 text-left">
            {[
              { icon: "🎯", title: "Find Your Dream Job", desc: "Browse thousands of opportunities" },
              { icon: "🏢", title: "Top Companies", desc: "Connect with leading employers" },
              { icon: "🚀", title: "Fast Hiring", desc: "Get hired within weeks" },
              { icon: "🔒", title: "Safe & Secure", desc: "Your data is always protected" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{item.title}</div>
                  <div className="text-indigo-200 text-xs">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account 🎉</h2>
            <p className="text-gray-500 mt-2">Join thousands of students and recruiters</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition bg-white text-gray-800"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition bg-white text-gray-800"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password with eye icon */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-indigo-500 transition bg-white text-gray-800"
                  placeholder="Min 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    role === "student"
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="text-2xl mb-1">🎓</div>
                  <div className="font-semibold text-gray-800 text-sm">Student</div>
                  <div className="text-gray-500 text-xs">Looking for jobs</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    role === "recruiter"
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="text-2xl mb-1">🏢</div>
                  <div className="font-semibold text-gray-800 text-sm">Recruiter</div>
                  <div className="text-xs text-gray-500">Posting jobs</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-xl disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;