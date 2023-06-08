import { Socket } from 'socket.io'
import Message from '../models/Message'
import Connection from '../../backend/models/Connection'
import User from '../../users/models/User'

const initialLoadController = async (socket: Socket) => {
  try {
    const messages = await Message.find({})

    const connection = await Connection.findOne({ socketId: socket.id })

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

export default initialLoadController
