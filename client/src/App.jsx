import React, { useState } from "react";
import SocketProvider from "./SocketProvider";
import Login from "./pages/login";
import Chat from "./pages/Chat";

export default function App() {
  const [auth, setAuth] = useState(null);

  return (
    <div className="app-container">
      {!auth ? (
        <Login onLogin={setAuth} />
      ) : (
        <SocketProvider token={auth.token}>
          <Chat me={auth} />
        </SocketProvider>
      )}
    </div>
  );
}



    