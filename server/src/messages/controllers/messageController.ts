import { Socket } from 'socket.io'
import Message from '../models/Message'
import Connection from '../../backend/models/Connection'
import User from '../../users/models/User'

export const handleMessage = (socket: Socket) => {
  socket.on('send_message', async (data: { message: string }) => {
    try {
      const { message } = data
      const timestamp = new Date()

      // Find the connection associated with the socket
      const connection = await Connection.findOne({ socketId: socket.id })

      if (connection) {
        // Find the user associated with the connection
        const user = await User.findOne({ id: connection.userId })

        if (user) {
          // Create a new message document
          const newMessage = new Message({
            content: message,
            username: user.username,
            timestamp,
          })

          // Save the message to the database
          await newMessage.save()

          // Emit the message to the sender
          socket.emit('receive_message', {
            _id: newMessage._id,
            username: user.username,
            content: message,
            timestamp: newMessage.timestamp.toISOString(),
            socketId: socket.id,
          })

          // Broadcast the message to other clients
          socket.broadcast.emit('receive_message', {
            _id: newMessage._id,
            username: user.username,
            content: message,
            timestamp: newMessage.timestamp.toISOString(),
            socketId: socket.id,
          })
        } else {
          console.error('User not found')
        }
      } else {
        console.error('Connection not found')
      }
    } catch (error) {
      console.error('Error handling message:', error)
    }
  })
}
