import { Socket } from 'socket.io'
import { createConnection } from '../../backend/controllers/connectionController'
import initialLoadController from '../../messages/controllers/messageLoadingController'
import { emitConnectionMessage } from '../../messages/controllers/connectionMessageController'

export const handleConnectionAndMessages = (
  socket: Socket,
  userId: string,
  username: string
) => {
  createConnection(socket.id, userId, username)
  emitConnectionMessage(socket, 'joined')
  initialLoadController(socket)
}
