const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  // Day 2 - Person A fills this
}, { timestamps: true });
module.exports = mongoose.model("User", UserSchema);