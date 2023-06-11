import Connection from '../models/Connection'

// Function to create a new connection in the database
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

// Function to remove a connection from the database
export const removeConnection = (socketId: string) => {
  return Connection.deleteOne({ socketId })
}
