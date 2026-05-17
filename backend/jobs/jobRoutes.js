const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Get jobs - Person B Day 2" });
});

router.post("/create", (req, res) => {
  res.json({ message: "Create job - Person B Day 2" });
});

router.get("/applications", (req, res) => {
  res.json({ message: "Get applications - Person B Day 3" });
});

router.get("/:id", (req, res) => {
  res.json({ message: "Get job by ID - Person B Day 3" });
});

router.post("/apply", (req, res) => {
  res.json({ message: "Apply to job - Person B Day 3" });
});

module.exports = router;