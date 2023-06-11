import bcrypt from 'bcrypt'
import User, { IUser } from '../models/User'
import { Socket } from 'socket.io'
import { checkIfUsernameExists } from '../logic/userSearchLogic'
import { handleConnectionAndMessages } from '../logic/connectionMessageLogic'
import Connection from '../../backend/models/Connection'

export const checkPassword = async (
  data: { username: string; password: string; purpose: string },
  callback: (response: {
    success: boolean
    reason?: string
  }) => typeof response,
  socket: Socket
) => {
  const { username, password, purpose } = data

  try {
    // Check if user exists
    const usernameExists: boolean = await checkIfUsernameExists(username)

    if (!usernameExists) {
      callback({ success: false, reason: 'User does not exist' })
      return
    }

    // Retrieve the user
    const existingUser: IUser | null = await User.findOne({ username })

    if (!existingUser) {
      callback({ success: false, reason: 'User does not exist' })
      return
    }

    if (purpose === 'login') {
      // Check if the user is already logged in
      const existingConnection = await Connection.findOne({
        userId: existingUser.id,
      })
      if (existingConnection) {
        callback({ success: false, reason: 'User is already connected' })
        return
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      )

      if (passwordMatch) {
        // Handle connection and messages for login purpose
        handleConnectionAndMessages(
          socket,
          existingUser.id,
          existingUser.username
        )

        callback({ success: true })
      } else {
        callback({ success: false, reason: 'Password does not match' })
      }
    } else if (purpose === 'delete') {
      // Check if the user is already connected
      const existingConnection = await Connection.findOne({
        userId: existingUser.id,
      })
      if (existingConnection) {
        callback({
          success: false,
          reason: 'User is currently connected and cannot be deleted',
        })
        return
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      )

      if (passwordMatch) {
        callback({ success: true })
      } else {
        callback({ success: false, reason: 'Password does not match' })
      }
    }
  } catch (error) {
    console.error('Error checking password:', error)
    callback({ success: false })
  }
}
