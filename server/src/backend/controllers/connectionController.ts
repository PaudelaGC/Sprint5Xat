import Connection from '../models/Connection'

export const createConnection = (
  socketId: string,
  userId: string,
  username: string
) => {
  const connection = new Connection({
    socketId,
    userId,
    username,
    connectionDatetime: new Date(),
  })

  return connection.save()
}

export const removeConnection = (socketId: string) => {
  return Connection.deleteOne({ socketId })
}
