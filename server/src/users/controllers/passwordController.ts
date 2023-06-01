import User, { IUser } from '../models/User'
import bcrypt from 'bcrypt'

export const checkPassword = async (
  data: { username: string; password: string },
  callback: (response: boolean) => typeof response
) => {
  const { username, password } = data

  try {
    const existingUser: IUser | null = await User.findOne({ username })
    if (!existingUser) {
      console.log('User not found')
      callback(false)
      return
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password)

    if (passwordMatch) {
      console.log('Password matches')
      callback(true)
    } else {
      console.log('Password does not match')
      callback(false)
    }
  } catch (error) {
    console.error('Error checking password:', error)
    callback(false)
  }
}
