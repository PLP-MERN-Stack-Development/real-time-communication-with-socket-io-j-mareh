// server/index.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");
const User = require("./models/User");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

connectDB();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const JWT_SECRET = process.env.JWT_SECRET;

// ---------------- REST API ----------------
app.post("/api/login", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  const userId =
    username.toLowerCase().replace(/[^a-z0-9]/g, "") + "-" + Date.now();
  const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: "24h" });

  await User.findOneAndUpdate(
    { userId },
    { username, online: true },
    { upsert: true, new: true }
  );

  res.json({ token, userId, username });
});

app.get("/api/messages", async (req, res) => {
  const { room = "global", limit = 20 } = req.query;
  const msgs = await Message.find({ room })
    .sort({ ts: -1 })
    .limit(Number(limit));
  res.json(msgs.reverse());
});

// ---------------- SOCKET.IO ----------------
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    socket.user = payload;
    next();
  } catch {
    next(new Error("Authentication error"));
  }
});

io.on("connection", async (socket) => {
  console.log("🔗 connected:", socket.user?.username);

  if (socket.user) {
    await User.findOneAndUpdate(
      { userId: socket.user.userId },
      { online: true },
      { upsert: true, new: true }
    );
    io.emit("presence:update", {
      userId: socket.user.userId,
      username: socket.user.username,
      online: true,
    });
  }

  socket.join("global");

  socket.on("typing", ({ room, isTyping }) => {
    socket.to(room).emit("typing", {
      userId: socket.user.userId,
      username: socket.user.username,
      isTyping,
    });
  });

  socket.on("message:create", async (payload, ack) => {
    const msg = new Message({
      room: payload.room || "global",
      from: socket.user.userId,
      fromName: socket.user.username,
      text: payload.text,
    });
    await msg.save();
    io.to(msg.room).emit("message:new", msg);
    ack?.({ status: "delivered", id: msg._id });
  });

  socket.on("message:upload", async (payload, ack) => {
    const msg = new Message({
      room: payload.room || "global",
      from: socket.user.userId,
      fromName: socket.user.username,
      type: "image",
      meta: { filename: payload.filename, dataUrl: payload.dataUrl },
    });
    await msg.save();
    io.to(msg.room).emit("message:new", msg);
    ack?.({ status: "uploaded", id: msg._id });
  });

  socket.on("disconnect", async () => {
    const user = socket.user;
    if (user) {
      await User.findOneAndUpdate({ userId: user.userId }, { online: false });
      io.emit("presence:update", {
        userId: user.userId,
        username: user.username,
        online: false,
      });
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
