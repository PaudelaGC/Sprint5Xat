import { Socket } from 'socket.io'
import Connection from '../models/Connection'
export const getConnectedUsers = async (socket: Socket) => {
  const connections = await Connection.find()
  const connectedUsers = connections.map((conn) => conn.username)
  socket.emit('connected_users', connectedUsers)
  socket.broadcast.emit('connected_users', connectedUsers)
}
