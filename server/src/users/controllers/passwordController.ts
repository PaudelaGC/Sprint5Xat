import User, { IUser } from '../models/User'
import bcrypt from 'bcrypt'
import { Socket } from 'socket.io'
import { createConnection } from '../../backend/controllers/connectionController'
import initialLoadController from '../../messages/controllers/messageLoadingController'

export const checkPassword = async (
  data: { username: string; password: string },
  callback: (response: { success: boolean }) => typeof response,
  socket: Socket
) => {
  const { username, password } = data

  try {
    const existingUser: IUser | null = await User.findOne({ username })
    if (!existingUser) {
      callback({ success: false })
      return
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password)

    if (passwordMatch) {
      // Store the connection in the "connections" collection
      createConnection(socket.id, existingUser.id)
      initialLoadController(socket)
      callback({ success: true })
    } else {
      callback({ success: false })
    }
  } catch (error) {
    console.error('Error checking password:', error)
    callback({ success: false })
  }
}
