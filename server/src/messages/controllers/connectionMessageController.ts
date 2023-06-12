import { Socket } from 'socket.io'
import Connection from '../../backend/models/Connection'

export const emitConnectionMessage = async (
  socket: Socket,
  action?: string
) => {
  const connection = await Connection.findOne({ socketId: socket.id })
  const connection2 = await Connection.findOne({ socketId: socket.id })
  if (action !== 'left') {
    const connections = await Connection.find()
    const userList = connections.map((conn) => conn.username)
    const userList2 = connections.map((conn) => conn.username)
    socket.broadcast.emit('second_user_list', userList2)
    socket.emit('user_list', userList)
    socket.broadcast.emit('user_list', userList)
  }
  if (action) {
    if (connection) {
      const systemMessage = {
        content: `${connection.username} ${action} the chat`,
        system: true,
      }
      socket.broadcast.emit('connection_message', systemMessage)
    } else if (connection2) {
      const systemMessage = {
        content: `${connection2.username} ${action} the chat`,
        system: true,
      }
      socket.broadcast.emit('connection_message', systemMessage)
    }
  }
}
