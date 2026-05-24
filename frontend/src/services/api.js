import axios from "axios";

const API = axios.create({ baseURL: "https://job-portal-fullstack-pr5j.onrender.com/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser    = (data) => API.post("/auth/login", data);
export const getProfile   = ()     => API.get("/auth/profile");

export const getJobs         = ()     => API.get("/jobs");
export const getJobById      = (id)   => API.get(`/jobs/${id}`);
export const createJob       = (data) => API.post("/jobs/create", data);
export const applyToJob      = (data) => API.post("/jobs/apply", data);
export const getApplications = ()     => API.get("/jobs/applications");