import mongoose, { Document, Schema } from 'mongoose'

export interface IConnection extends Document {
  socketId: string
  userId: string
  username: string
  connectionDatetime: Date
}

const connectionSchema = new Schema<IConnection>(
  {
    socketId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    connectionDatetime: { type: Date, required: true },
  },
  { collection: 'connections' }
)

export default mongoose.model<IConnection>('Connection', connectionSchema)
