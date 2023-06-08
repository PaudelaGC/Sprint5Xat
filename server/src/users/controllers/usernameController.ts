import User, { IUser } from '../models/User'

export const checkUsername = async (
  data: { username: string },
  callback: (response: boolean) => typeof response
) => {
  const { username } = data

  try {
    const existingUser: IUser | null = await User.findOne({ username })

    if (existingUser) {
      callback(true)
    } else {
      callback(false)
    }
  } catch (error) {
    console.error('Error checking username:', error)
    callback(false) // Assuming server error means username doesn't exist
  }
}
