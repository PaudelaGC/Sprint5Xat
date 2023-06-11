import User from '../models/User'
import Message from '../../messages/models/Message'
import { Socket } from 'socket.io'

export const deleteAccount = async (
  username: string,
  socket: Socket
): Promise<boolean> => {
  try {
    // Delete the user account
    const deletedUser = await User.findOneAndDelete({ username })

    if (!deletedUser) {
      return false
    }

    // Delete the user's messages
    await Message.deleteMany({ username })

    // Update the current chatlog state for all connected users
    const messages = await Message.find({})
    const systemMessage = {
      content: `${username}'s account has been deleted. Chatlog has been updated`,
      system: true,
    }
    // Broadcast the request to update chatlog to all connected users
    socket.broadcast.emit('request_update_after_delete', messages)

    // Add a delay of 0.5 seconds before broadcasting the connection message
    setTimeout(() => {
      socket.broadcast.emit('connection_message', systemMessage)
    }, 1000)

    return true
  } catch (error) {
    console.error('Error deleting account:', error)
    return false
  }
}
