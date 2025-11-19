import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!username) return;

    setLoading(true);

    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();
    setLoading(false);
    onLogin(data);
  }

  return (
    <div className="login">
      <h2>Enter Username</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Join Chat"}
        </button>
      </form>
    </div>
  );
}

