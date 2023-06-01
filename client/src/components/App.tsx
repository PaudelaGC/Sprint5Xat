import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import AuthForm from './AuthForm.tsx'

const socket = io('http://localhost:3001')

interface MessageData {
  _id: string
  username: string
  content: string
  timestamp: string
}

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState<MessageData[]>([])
  

  const sendMessage = () => {
    const username = 'default'
    socket.emit('send_message', { username, message })
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChatLog((prevChatLog) => [...prevChatLog, data])
    });
  }, []);

  return (
    <div className="App">
      {!authenticated ? (
        <AuthForm setAuthenticated={setAuthenticated} />
      ) : (
        <div>
          <div className="chat-log">
            {chatLog.map((messageData) => (
              <div key={messageData._id}>
                <strong>{messageData.username}:</strong> {messageData.content} [<span className="timestamp">{messageData.timestamp}</span>]
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

export default App
