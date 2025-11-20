# 💬 Real-Time Chat App (MERN + Socket.IO)

A full-stack real-time chat application built with MongoDB, Express, React (Vite), Node.js, and Socket.IO. This app demonstrates real-time communication including messaging, typing indicators, file uploads, and online user status.

---

## 🚀 Features

- Real-time messaging with Socket.IO
- Typing indicators
- File and image sharing
- User authentication (username-based)
- Online / offline status
- MongoDB message storage
- Responsive UI (desktop & mobile)

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Socket.IO Client
- CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO

---

## 📁 Project Structure

week5-socketio-chat/
├── client/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Chat.jsx
│ │ │ └── Login.jsx
│ │ ├── SocketProvider.jsx
│ │ └── App.jsx
│ └── package.json
├── server/
│ ├── models/
│ ├── routes/
│ ├── db.js
│ └── index.js



---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/week5-socketio-chat.git
cd week5-socketio-chat

cd server
npm install

npm run dev
