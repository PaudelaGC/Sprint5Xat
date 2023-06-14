import { Socket } from 'socket.io'
import { createConnection } from '../../backend/controllers/connectionController'
import initialLoadController from '../../messages/controllers/retrieveAllMessagesController'
import { emitConnectionMessage } from '../../messages/controllers/connectionMessageController'
import { getConnectedUsers } from '../../backend/controllers/getConnectedUsersController'

export const handleConnectionAndMessages = (
  socket: Socket,
  userId: string,
  username: string
) => {
  createConnection(socket.id, userId, username)
  emitConnectionMessage(socket, 'joined')
  initialLoadController(socket)
  getConnectedUsers(socket)
}
