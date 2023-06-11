import { Socket } from 'socket.io'
import Connection from '../../backend/models/Connection'

export const emitConnectionMessage = async (
  socket: Socket,
  action?: string
) => {
  // Find the connection associated with the socket
  const connection = await Connection.findOne({ socketId: socket.id })
  // This is a failsafe in case the above does not connect properly
  const connection2 = await Connection.findOne({ socketId: socket.id })
  // This allows to access the function when joining the chat, and also when leaving the chat,
  // but in this last case we iterate twice so we can use this code before and after the
  // connection is removed from the database
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
