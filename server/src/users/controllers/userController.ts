import bcrypt from 'bcrypt'
import User, { IUser } from '../models/User'

export const createUser = async (
  data: { username: string; password: string; id: string },
  callback: (response: boolean) => typeof response
) => {
  const { username, password, id } = data

  try {
    // Check if user already exists
    const existingUser: IUser | null = await User.findOne({ username })

    if (existingUser) {
      console.log('User already exists:', existingUser)
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
    console.log(`User connected: ${id}`)
    callback(true)
  } catch (error) {
    callback(false)
  }
}
