const mongoose = require("mongoose");
const ApplicationSchema = new mongoose.Schema({
  // Day 2 - Person B fills this
}, { timestamps: true });
module.exports = mongoose.model("Application", ApplicationSchema);