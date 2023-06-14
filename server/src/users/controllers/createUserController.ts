import bcrypt from 'bcrypt'
import User from '../models/User'
import { Socket } from 'socket.io'
import { checkIfUsernameExists } from './findUserController'
import { handleConnectionAndMessages } from './handleConnectionAndMessages'

export const createUser = async (
  data: { username: string; password: string; id: string },
  callback: (response: { success: boolean }) => typeof response,
  socket: Socket
) => {
  const { username, password, id } = data

  try {
    const usernameExists: boolean = await checkIfUsernameExists(username)

    if (usernameExists) {
      callback({ success: false })
      return
    }

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)

    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({ username, password: hashedPassword, id })
    await user.save()

    handleConnectionAndMessages(socket, id, username)

    callback({ success: true })
  } catch (error) {
    console.error('Error creating user:', error)
    callback({ success: false })
  }
}
