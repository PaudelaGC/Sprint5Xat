import express from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'
import { handleMessage } from './messages/controllers/sendMessageController'
import { createUser } from './users/controllers/createUserController'
import { checkUsername } from './users/controllers/checkUsernameController'
import { checkPassword } from './users/controllers/checkPasswordController'
import { removeConnection } from './backend/controllers/connectionController'
import { emitConnectionMessage } from './messages/controllers/connectionMessageController'
import connectDB from './backend/db/mongoose-connection'
import { deleteAccount } from './users/controllers/deleteUserController'
import { updateChatlog } from './messages/controllers/updateAllMessagesController'
import { getConnectedUsers } from './backend/controllers/getConnectedUsersController'

const app = express()

app.use(cors(), express.json())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

const handleDisconnect = async (socket: Socket) => {
  const socketId = socket.id
  try {
    await emitConnectionMessage(socket, 'left')

    await removeConnection(socketId)

    emitConnectionMessage(socket)
    getConnectedUsers(socket)
  } catch (error) {
    console.error('Error disconnecting socket:', error)
  }
}

connectDB()

io.on('connection', (socket: Socket) => {
  getConnectedUsers(socket)

  handleMessage(socket)

  updateChatlog(socket)

  socket.on('create_user', (data, callback) => {
    createUser(data, callback, socket)
  })

  socket.on('check_username', (data: { username: string }, callback) => {
    checkUsername(data, callback)
  })

  socket.on(
    'check_password',
    (
      data: { username: string; password: string; purpose: string },
      callback
    ) => {
      checkPassword(data, callback, socket)
    }
  )

  socket.on('delete_account', (data, callback) => {
    deleteAccount(data.username, socket)
      .then((success) => {
        callback({ success })
      })
      .catch((error) => {
        console.error('Error deleting account:', error)
        callback({ success: false })
      })
  })

  socket.on('disconnect', () => {
    handleDisconnect(socket)
  })
})

server.listen(3001, () => {
  console.log('Server listening on port 3001')
})
