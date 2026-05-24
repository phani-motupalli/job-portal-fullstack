const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ 
  origin: [
    "http://localhost:3000",
    "https://job-portal-fullstack-ochre.vercel.app"
  ] 
}));
app.use(express.json());

const authRoutes = require("./auth/authRoutes");
const jobRoutes  = require("./jobs/jobRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Job Portal API is running" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port 5000`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
  });