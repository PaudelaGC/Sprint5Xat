import express from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'
import { handleMessage } from './messages/controllers/messageController'
import { createUser } from './users/controllers/createUserController'
import { checkUsername } from './users/controllers/checkUsernameController'
import { checkPassword } from './users/controllers/checkPasswordController'
import { removeConnection } from './backend/controllers/connectionController'
import { emitConnectionMessage } from './messages/controllers/connectionMessageController'
import connectDB from './backend/db/mongoose-connection'
import { deleteAccount } from './users/controllers/deleteAccountController'
import updateChatlog from './messages/controllers/chatlogUpdateController'

const app = express()
// Initialize an empty array to store active socket connections
app.use(cors(), express.json())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// Function to handle socket disconnect event
const handleDisconnect = async (socket: Socket) => {
  const socketId = socket.id
  try {
    // Emit 'username left the chat' connection message
    await emitConnectionMessage(socket, 'left')
    // Remove the connection
    await removeConnection(socketId)
    // Remove user from connected user's list
    emitConnectionMessage(socket)
  } catch (error) {
    console.error('Error disconnecting socket:', error)
  }
}

// Connect to MongoDB
connectDB()

// Socket.io logic
io.on('connection', (socket: Socket) => {
  // Handle incoming messages
  handleMessage(socket)
  //Update chat log when an account is deleted
  updateChatlog(socket)

  // Handle 'create_user' event
  socket.on('create_user', (data, callback) => {
    // Call createUser controller function
    createUser(data, callback, socket)
  })

  // Handle 'check_username' event
  socket.on('check_username', (data: { username: string }, callback) => {
    // Call checkUsername controller function
    checkUsername(data, callback)
  })

  // Handle 'check_password' event
  socket.on(
    'check_password',
    (
      data: { username: string; password: string; purpose: string },
      callback
    ) => {
      // Call checkPassword controller function
      checkPassword(data, callback, socket)
    }
  )

  // Handle 'delete_account' event
  socket.on('delete_account', (data, callback) => {
    // Call deleteAccount controller function
    deleteAccount(data.username, socket)
      .then((success) => {
        callback({ success })
      })
      .catch((error) => {
        console.error('Error deleting account:', error)
        callback({ success: false })
      })
  })

  // Handle disconnect event
  socket.on('disconnect', () => {
    // Call handleDisconnect function to handle disconnect logic
    handleDisconnect(socket)
  })
})

server.listen(3001, () => {
  console.log('Server listening on port 3001')
})
