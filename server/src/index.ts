import express from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'
import mongoose from 'mongoose'
import { handleMessage } from './messages/controllers/messageController'
import { createUser } from './users/controllers/userController'
import { checkUsername } from './users/controllers/usernameController'
import { checkPassword } from './users/controllers/passwordController'
import { removeConnection } from './backend/controllers/connectionController'

const app = express()
app.use(cors(), express.json())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://paugctrabajo:1234@userdb.itvke2t.mongodb.net/?retryWrites=true&w=majority'
)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

// Socket.io logic
io.on('connection', (socket: Socket) => {
  handleMessage(socket)

  socket.on('create_user', (data, callback) => {
    createUser(data, callback, socket)
  })

  socket.on('check_username', (data: { username: string }, callback) => {
    checkUsername(data, callback)
  })

  socket.on(
    'check_password',
    (data: { username: string; password: string }, callback) => {
      checkPassword(data, callback, socket)
    }
  )

  // Handle disconnect event
  socket.on('disconnect', () => {
    const socketId = socket.id

    // Remove the connection from the database
    removeConnection(socketId)
      .then(() => {
        console.log(`Disconnected: ${socketId}`)
      })
      .catch((error) => {
        console.error('Error disconnecting socket:', error)
      })
  })
})

server.listen(3001, () => {
  console.log('Server listening on port 3001')
})
