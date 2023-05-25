import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import mongoose, { Document } from 'mongoose';
import User from './User';
import bcrypt from 'bcrypt';

interface IUser extends Document {
  username: string;
  password: string;
  id: string;
}

const app = express();
app.use(cors(), express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});








// Connect to MongoDB
mongoose.connect("mongodb+srv://paugctrabajo:1234@userdb.itvke2t.mongodb.net/?retryWrites=true&w=majority");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Socket.io logic
io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('send_message', (data: { message: string }) => {
    socket.broadcast.emit('receive_message', data);
  });

  socket.on('create_user', async (data: { username: string, password: string, id: string }, callback: Function) => {
    const { username, password, id } = data;
  
    try {
      // Check if user already exists
      const existingUser: IUser | null = await User.findOne({ username });
  
      if (existingUser) {
        console.log('User already exists:', existingUser);
        return;
      }
  
      // Generate a salt to use for hashing
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
  
      // Hash the password using the generated salt
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user with the hashed password
      const user = new User({ username, password: hashedPassword, id });
      await user.save();
  
      console.log('User created:', user);
      callback({ success: true });
    } catch (error) {
      console.error('Error creating user:', error);
      callback({ success: false });
    }
  });

  socket.on('check_username', async (data: { username: string }, callback) => {
    const { username } = data;
  
    try {
      const existingUser: IUser | null = await User.findOne({ username });
  
      if (existingUser) {
        console.log('User already exists:', existingUser);
        callback({ exists: true });
      } else {
        callback({ exists: false });
      }
    } catch (error) {
      console.error('Error checking username:', error);
      callback({ error: 'Server error' });
    }
  });

  socket.on('check_password', async (data: { username: string, password: string }, callback: Function) => {
    const { username, password } = data;
  
    try {
      // Find the user by username
      const existingUser: IUser | null = await User.findOne({ username });
      if (!existingUser) {
        console.log('User not found');
        callback({ exists: false });
        return;
      }
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
  
      if (passwordMatch) {
        console.log('Password matches');
        callback({ match: true });
      } else {
        console.log('Password does not match');
        callback({ match: false });
      }
    } catch (error) {
      console.error('Error checking password:', error);
      callback({ match: false });
    }
  });
  
  
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});


