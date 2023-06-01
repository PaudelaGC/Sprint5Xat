import mongoose, { Schema, Document } from 'mongoose'

interface IUser extends Document {
  username: string
  password: string
  id: string
}

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: String, required: true },
  },
  { collection: 'users' }
)

export default mongoose.model<IUser>('User', userSchema)
export { IUser }
