import axios from "axios";

// Intelligently choose API root URL:
// 1. Process environment if defined
// 2. Localhost 5000 if running locally
// 3. Fallback to production URL
const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000/api";
  }
  return "https://job-portal-fullstack-pr5j.onrender.com/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ── Auth Endpoints ─────────────────────────────────
export const registerUser   = (data) => API.post("/auth/register", data);
export const loginUser      = (data) => API.post("/auth/login", data);
export const getProfile     = ()     => API.get("/auth/profile");
export const updateProfile  = (data) => API.put("/auth/profile", data);
export const toggleSaveJob  = (jobId)=> API.post("/auth/save-job", { jobId });
export const getSavedJobs   = ()     => API.get("/auth/saved-jobs");

// ── Job Endpoints ──────────────────────────────────
export const getJobs        = (params) => API.get("/jobs", { params });
export const getJobById     = (id)     => API.get(`/jobs/${id}`);
export const createJob      = (data)   => API.post("/jobs/create", data);
export const deleteJob      = (id)     => API.delete(`/jobs/${id}`);
export const applyToJob     = (data)   => API.post("/jobs/apply", data);
export const getApplications= ()       => API.get("/jobs/applications");

// ── Recruiter & ATS Endpoints ──────────────────────
export const getMyJobs               = () => API.get("/jobs/myjobs");
export const getJobApplicants        = (jobId) => API.get(`/jobs/applicants/${jobId}`);
export const updateApplicationStatus = (appId, data) => API.put(`/jobs/applications/${appId}`, data);
export const scanATS                 = (data) => API.post("/jobs/ats-scan", data);

export default API;