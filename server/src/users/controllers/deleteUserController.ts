import User from '../models/User'
import Message from '../../messages/models/Message'
import { Socket } from 'socket.io'

export const deleteAccount = async (
  username: string,
  socket: Socket
): Promise<boolean> => {
  try {
    const deletedUser = await User.findOneAndDelete({ username })

    if (!deletedUser) {
      return false
    }

    await Message.deleteMany({ username })

    const messages = await Message.find({})
    const systemMessage = {
      content: `${username}'s account has been deleted. Chatlog has been updated`,
      system: true,
    }

    socket.broadcast.emit('request_update_after_delete', messages)

    setTimeout(() => {
      socket.broadcast.emit('connection_message', systemMessage)
    }, 1000)

    return true
  } catch (error) {
    console.error('Error deleting account:', error)
    return false
  }
}
