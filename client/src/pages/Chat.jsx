import React, { useState, useEffect } from "react";
import { useSocket } from "../SocketProvider";

export default function Chat({ me }) {
  const { socket, connected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState("");

  useEffect(() => {
    if (!socket) return;

    // Load last 30 messages
    fetch("http://localhost:4000/api/messages?room=global&limit=30")
      .then((r) => r.json())
      .then((data) => setMessages(data.reverse()));

    // Socket listeners
    socket.on("message:new", (m) => setMessages((prev) => [...prev, m]));
    socket.on("typing", (t) =>
      setTyping(t.isTyping ? `${t.username} is typing...` : "")
    );

    return () => {
      socket.off("message:new");
      socket.off("typing");
    };
  }, [socket]);

  const send = () => {
    if (!text.trim()) return;
    socket.emit("message:create", { room: "global", text });
    setText("");
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("message:upload", {
        room: "global",
        filename: file.name,
        dataUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="chat">
      <h2>
        Welcome, {me.username} {connected ? "🟢" : "🔴"}
      </h2>

      <div className="messages">
        {messages.map((m) => (
          <div key={m._id} className="message">
            <b>{m.fromName}</b>:{" "}
            {m.type === "image" ? (
              <img src={m.meta.dataUrl} alt="upload" width="150" />
            ) : (
              m.text
            )}
          </div>
        ))}
      </div>

      <div className="typing">{typing}</div>

      <div className="input-area">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            socket.emit("typing", {
              room: "global",
              isTyping: !!e.target.value,
            });
          }}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type message..."
        />

        <input type="file" onChange={handleFile} />

        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
