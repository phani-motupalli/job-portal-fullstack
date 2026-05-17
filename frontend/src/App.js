import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./auth-pages/LoginPage";
import RegisterPage from "./auth-pages/RegisterPage";
import ProfilePage from "./auth-pages/ProfilePage";
import JobListingPage from "./job-pages/JobListingPage";
import JobDetailsPage from "./job-pages/JobDetailsPage";
import DashboardPage from "./job-pages/DashboardPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<JobListingPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;