import User, { IUser } from '../models/User'

export const checkIfUsernameExists = async (
  username: string
): Promise<boolean> => {
  try {
    const existingUser: IUser | null = await User.findOne({ username })
    return !!existingUser
  } catch (error) {
    console.error('Error checking username:', error)
    return false
  }
}
