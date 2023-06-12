import { Socket } from 'socket.io'
import Message from '../models/Message'
import Connection from '../../backend/models/Connection'

export const handleMessage = (socket: Socket) => {
  socket.on('send_message', async (data: { message: string }) => {
    try {
      const { message } = data

      const timestamp = new Date()

      const connection = await Connection.findOne({ socketId: socket.id })

      if (connection) {
        const newMessage = new Message({
          content: message,
          username: connection.username,
          timestamp,
        })

        await newMessage.save()

        const messageObject = {
          _id: newMessage._id,
          username: connection.username,
          content: message,
          timestamp: newMessage.timestamp.toISOString(),
          socketId: socket.id,
        }

        socket.emit('receive_message', messageObject)

        socket.broadcast.emit('receive_message', messageObject)
      } else {
        console.error('Connection not found')
      }
    } catch (error) {
      console.error('Error handling message:', error)
    }
  })
}
