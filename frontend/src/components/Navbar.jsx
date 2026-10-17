import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconSparkles } from "./Icons";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <IconSparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 via-purple-600 to-teal-500 bg-clip-text text-transparent">
                JobPortal<span className="text-teal-500 font-black">.ai</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200/60">
                AI Powered
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/jobs"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                isActive("/jobs")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
              }`}
            >
              Explore Jobs
            </Link>

            {user ? (
              <>
                {user.role === "recruiter" ? (
                  <>
                    <Link
                      to="/recruiter-dashboard"
                      className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                        isActive("/recruiter-dashboard")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                      }`}
                    >
                      Recruiter CRM
                    </Link>
                    <Link
                      to="/post-job"
                      className="ml-2 inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700 transition"
                    >
                      <span>+ Post Job</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                        isActive("/dashboard")
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                      }`}
                    >
                      Applications Pipeline
                    </Link>
                  </>
                )}

                {/* Profile Link & Logout */}
                <div className="h-5 w-px bg-slate-200 mx-1" />

                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition ${
                    isActive("/profile")
                      ? "border-indigo-300 bg-indigo-50/50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {user?.name?.split(" ")[0]}
                    </p>
                    <span className="text-[10px] text-indigo-600 font-medium capitalize">
                      {user?.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 px-2.5 py-2 rounded-lg hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-2">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50"
            >
              Explore Jobs
            </Link>
            {user ? (
              <>
                {user.role === "recruiter" ? (
                  <>
                    <Link
                      to="/recruiter-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50"
                    >
                      Recruiter CRM
                    </Link>
                    <Link
                      to="/post-job"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-semibold text-indigo-600 font-bold hover:bg-indigo-50"
                    >
                      + Post Job
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50"
                  >
                    Applications Pipeline
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50"
                >
                  My Profile ({user.name})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-sm font-semibold text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-indigo-600 text-white py-2 rounded-xl text-sm font-bold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;