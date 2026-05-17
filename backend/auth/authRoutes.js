const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  res.json({ message: "Register route - Day 2" });
});

router.post("/login", (req, res) => {
  res.json({ message: "Login route - Day 2" });
});

router.get("/profile", (req, res) => {
  res.json({ message: "Profile route - Day 3" });
});

module.exports = router;