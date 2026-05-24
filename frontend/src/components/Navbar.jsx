import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
};

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-satisfy text-2xl tracking-wide">
  JobPortal
      </Link>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/" className="hover:underline">Jobs</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            {user.role === "recruiter" && (
            <Link to="/post-job" className="hover:underline">Post Job</Link>
            )}
            <Link to="/profile" className="hover:underline">{user.name}</Link>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-1 rounded font-semibold hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="hover:underline">Jobs</Link>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="bg-white text-blue-600 px-4 py-1 rounded font-semibold hover:bg-gray-100">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;