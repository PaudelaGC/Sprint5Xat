import "./App.css";
import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";
import AuthForm from './AuthForm';

const socket = io("http://localhost:3001");

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState('');

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message)
    });
  }, []);

  return (
    <div className="App">
      {!authenticated ? (
        <AuthForm setAuthenticated={setAuthenticated} />
      ) : (
        <div>
          <input
            placeholder="Message..."
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
          <button onClick={sendMessage}> Send message</button>
          <h1>Message:</h1>
          {messageReceived}
        </div>
      )}
    </div>
  );
}

export default App;
