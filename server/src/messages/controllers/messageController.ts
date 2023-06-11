import { Socket } from 'socket.io'
import Message from '../models/Message'
import Connection from '../../backend/models/Connection'

export const handleMessage = (socket: Socket) => {
  socket.on('send_message', async (data: { message: string }) => {
    try {
      const { message } = data

      // Get the current timestamp
      const timestamp = new Date()

      // Find the connection associated with the socket
      const connection = await Connection.findOne({ socketId: socket.id })

      if (connection) {
        // Create a new message document
        const newMessage = new Message({
          content: message,
          username: connection.username, // Use the username from the connection
          timestamp,
        })

        // Save the message to the database
        await newMessage.save()

        // Prepare the message object to be sent
        const messageObject = {
          _id: newMessage._id,
          username: connection.username,
          content: message,
          timestamp: newMessage.timestamp.toISOString(),
          socketId: socket.id,
        }

        // Emit the message to the sender
        socket.emit('receive_message', messageObject)

        // Broadcast the message to other clients
        socket.broadcast.emit('receive_message', messageObject)
      } else {
        console.error('Connection not found')
      }
    } catch (error) {
      console.error('Error handling message:', error)
    }
  })
}
