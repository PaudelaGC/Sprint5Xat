import { Schema, model, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

interface IMessage extends Document {
  content: string
  username: string
  timestamp: Date
  messageId: string
}

const messageSchema = new Schema<IMessage>(
  {
    content: { type: String, required: true },
    username: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    messageId: { type: String, default: uuidv4 },
  },
  { collection: 'messages' }
)

const Message = model<IMessage>('Message', messageSchema)

export default Message
