import { Socket } from 'socket.io'
import Message from '../models/Message'

export const handleMessage = (socket: Socket) => {
  socket.on(
    'send_message',
    async (data: { message: string; username: string }) => {
      try {
        const { message, username } = data
        const timestamp = new Date()

        // Create a new message document
        const newMessage = new Message({
          content: message,
          username,
          timestamp,
        })

        // Save the message to the database
        await newMessage.save()

        // Emit the message to the sender
        socket.emit('receive_message', {
          _id: newMessage._id,
          username,
          content: message,
        })

        // Broadcast the message to other clients
        socket.broadcast.emit('receive_message', {
          _id: newMessage._id,
          username,
          content: message,
        })
      } catch (error) {
        console.error('Error handling message:', error)
      }
    }
  )
}
