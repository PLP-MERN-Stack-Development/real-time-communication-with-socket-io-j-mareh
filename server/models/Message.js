// server/models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room: { type: String, default: "global" },
  from: { type: String, required: true },
  fromName: { type: String, required: true },
  text: { type: String },
  type: { type: String, default: "text" },
  meta: { type: Object },
  ts: { type: Date, default: Date.now },
  reactions: { type: Object, default: {} },
});

module.exports = mongoose.model("Message", messageSchema);
