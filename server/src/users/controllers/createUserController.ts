import bcrypt from 'bcrypt'
import User from '../models/User'
import { Socket } from 'socket.io'
import { checkIfUsernameExists } from '../logic/userSearchLogic'
import { handleConnectionAndMessages } from '../logic/connectionMessageLogic'

export const createUser = async (
  data: { username: string; password: string; id: string },
  callback: (response: { success: boolean }) => typeof response,
  socket: Socket
) => {
  const { username, password, id } = data

  try {
    // Check if user already exists
    const usernameExists: boolean = await checkIfUsernameExists(username)

    if (usernameExists) {
      callback({ success: false })
      return
    }

    // Generate a salt to use for hashing
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create a new user with the hashed password
    const user = new User({ username, password: hashedPassword, id })
    await user.save()

    // Handle connection and messages
    handleConnectionAndMessages(socket, id, username)

    callback({ success: true })
  } catch (error) {
    console.error('Error creating user:', error)
    callback({ success: false })
  }
}
