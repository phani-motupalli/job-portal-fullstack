import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./auth-pages/LoginPage";
import RegisterPage from "./auth-pages/RegisterPage";
import ProfilePage from "./auth-pages/ProfilePage";
import JobListingPage from "./job-pages/JobListingPage";
import JobDetailsPage from "./job-pages/JobDetailsPage";
import DashboardPage from "./job-pages/DashboardPage";
import PostJobPage from "./job-pages/PostJobPage";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobListingPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/post-job" element={<PostJobPage />} />
      </Routes>
    </Router>
  );
}

export default App;