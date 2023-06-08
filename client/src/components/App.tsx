import socket from './socket.tsx';
import { useEffect, useState } from 'react';
import AuthForm from './AuthForm.tsx';
import './App.css';

interface MessageData {
  _id: string;
  username: string;
  content: string;
  timestamp: string;
  socketId: string;
  position: string;
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<MessageData[]>([]);

  const sendMessage = () => {
    socket.emit('send_message', { message });
    setMessage(''); // Clear the message input field after sending
  };

  useEffect(() => {
    socket.on('receive_message', (data: MessageData) => {
      if (data.socketId === socket.id) {
        setChatLog((prevChatLog) => [...prevChatLog, { ...data, position: 'right' }]);
      } else {
        setChatLog((prevChatLog) => [...prevChatLog, { ...data, position: 'left' }]);
      }
    });
  
    return () => {
      socket.off('receive_message');
    };
  }, []);
  

  const initialLoadHandler = (messages: MessageData[], username: string) => {
    const updatedChatLog = messages.map((message) => {
      return {
        ...message,
        position: message.username === username ? 'right' : 'left',
      };
    });

    setChatLog(updatedChatLog);
  };

  useEffect(() => {
    socket.on('initialLoad', initialLoadHandler);

    return () => {
      socket.off('initialLoad', initialLoadHandler);
    };
  }, []);

  return (
    <div className="App">
      {!authenticated ? (
        <AuthForm setAuthenticated={setAuthenticated} />
      ) : (
        <div>
          <div className="chat-log">
            {chatLog.map((messageData) => (
              <div
                key={messageData._id}
                className={`message-container ${messageData.position}`}
              >
                <div className="message">
                  <strong>{messageData.username}:</strong> {messageData.content} [
                  <span className="timestamp">{messageData.timestamp}</span>]
                </div>
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


