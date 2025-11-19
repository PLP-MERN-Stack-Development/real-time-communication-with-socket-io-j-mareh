// server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  online: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
