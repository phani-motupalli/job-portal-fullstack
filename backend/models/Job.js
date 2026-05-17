const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema({
  // Day 2 - Person B fills this
}, { timestamps: true });
module.exports = mongoose.model("Job", JobSchema);