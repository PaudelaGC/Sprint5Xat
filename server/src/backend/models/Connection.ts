import mongoose, { Document, Schema } from 'mongoose'

export interface IConnection extends Document {
  socketId: string
  userId: string
  connectionDatetime: Date
}

const connectionSchema = new Schema({
  socketId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  connectionDatetime: {
    type: Date,
    required: true,
  },
})

export default mongoose.model<IConnection>('Connection', connectionSchema)
