import { Socket } from 'socket.io'
import Connection from '../../backend/models/Connection'
import User from '../../users/models/User'

export const updateChatlog = (socket: Socket) => {
  socket.on(
    'update_chatlog_request',
    async (socketId: string, messages: string[]) => {
      try {
        // Find the connection associated with the socket
        const connection = await Connection.findOne({ socketId: socketId })

        if (connection) {
          // If a connection is found, retrieve the corresponding user
          const user = await User.findOne({ id: connection.userId })

          // Get the username if the user exists, or an empty string if not
          const username = user?.username || ''

          // Emit the 'initialLoad' event to the socket with the messages and username
          socket.emit('initialLoad', messages, username)
        }
      } catch (error) {
        console.error('Error retrieving messages:', error)

        // Emit the 'initialLoadError' event to the socket with the error message
        socket.emit('initialLoadError', error)
      }
    }
  )
}

export default updateChatlog
