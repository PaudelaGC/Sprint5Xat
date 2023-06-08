import bcrypt from 'bcrypt'
import User, { IUser } from '../models/User'
import { Socket } from 'socket.io'
import { createConnection } from '../../backend/controllers/connectionController'
import initialLoadController from '../../messages/controllers/messageLoadingController'

export const createUser = async (
  data: { username: string; password: string; id: string },
  callback: (response: { success: boolean }) => typeof response,
  socket: Socket
) => {
  const { username, password, id } = data

  try {
    // Check if user already exists
    const existingUser: IUser | null = await User.findOne({ username })

    if (existingUser) {
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

    // Store the connection in the "connections" collection
    createConnection(socket.id, user.id)

    console.log(`User connected: ${username}`)
    initialLoadController(socket)
    callback({ success: true })
  } catch (error) {
    console.error('Error creating user:', error)
    callback({ success: false })
  }
}
