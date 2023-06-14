import { Socket } from 'socket.io'
import Connection from '../../backend/models/Connection'
import User from '../../users/models/User'

export const updateChatlog = (socket: Socket) => {
  socket.on(
    'update_chatlog_request',
    async (socketId: string, messages: string[]) => {
      try {
        const connection = await Connection.findOne({ socketId: socketId })

        if (connection) {
          const user = await User.findOne({ id: connection.userId })

          const username = user?.username || ''

          socket.emit('initialLoad', messages, username)
        }
      } catch (error) {
        console.error('Error retrieving messages:', error)

        socket.emit('initialLoadError', error)
      }
    }
  )
}
