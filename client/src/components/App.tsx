import socket from './socket.tsx'
import { useEffect, useRef, useState } from 'react'
import AuthForm from './AuthForm.tsx'
import './App.css'

interface MessageData {
  _id: string
  username: string
  content: string
  timestamp: string
  socketId: string
  position: string
  system?: boolean
}

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState<MessageData[]>([])
  const chatLogRef = useRef<HTMLDivElement>(null)
  const [userList, setUserList] = useState<string[]>([])

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('send_message', { message })
      setMessage('') 
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  useEffect(() => {
    
    socket.on('receive_message', (data: MessageData) => {
      if (data.socketId === socket.id) {
        setChatLog((prevChatLog) => [...prevChatLog, { ...data, position: 'right' }])
      } else {
        setChatLog((prevChatLog) => [...prevChatLog, { ...data, position: 'left' }])
      }
    })

    return () => {
      socket.off('receive_message')
    }
  }, [])

  const initialLoadHandler = (messages: MessageData[], username: string) => {
    
    const updatedChatLog = messages.map((message) => {
      return {
        ...message,
        position: message.username === username ? 'right' : 'left'
      }
    })

    setChatLog(updatedChatLog)
  }

  useEffect(() => {
    
    socket.on('initialLoad', initialLoadHandler)

    return () => {
      socket.off('initialLoad', initialLoadHandler)
    }
  }, [])

  useEffect(() => {
    
    socket.on('connection_message', (data: MessageData) => {
      setChatLog((prevChatLog) => [...prevChatLog, { ...data, position: 'center' }])
    })
  
    
    socket.on('request_update_after_delete', (messages: MessageData[]) => {
      socket.emit('update_chatlog_request', socket.id, messages)
      socket.on('update_chatlog', initialLoadHandler)
    })
  
    
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
    }
  
    return () => {
      socket.off('connection_message')
      socket.off('update_chatlog')
    }
  }, [chatLog])

  useEffect(() => {
    
    socket.on('user_list', (users: string[]) => {
      setUserList(users)
    })
  
    return () => {
      socket.off('user_list')
    }
  }, [])

  return (
    <div className="App">
      {!authenticated ? (
        
        <AuthForm setAuthenticated={setAuthenticated} />
      ) : (
        <div className="container">
          <div className="chat-container">
            <div className="chat-log" ref={chatLogRef}>
              {chatLog.map((messageData) => (
                <div
                  key={messageData._id}
                  className={`message-container ${messageData.position}`}
                >
                  <div className={`message ${messageData.system ? 'system' : ''}`}>
                    {/* Render message content */}
                    {messageData.username && <strong>{messageData.username}:</strong>}{' '}
                    {messageData.content !== undefined && (
                      <div className="system-message">{messageData.content}</div>
                    )}
                    {messageData.timestamp && (
                      <span className="timestamp">[{messageData.timestamp}]</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="input-area">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
          <div className="user-list">
            <h2>Connected Users</h2>
            <ul>
              {/* Render user list */}
              {userList.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

