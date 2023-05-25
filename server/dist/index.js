"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)(), express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
// Connect to MongoDB
mongoose_1.default.connect("mongodb+srv://paugctrabajo:1234@userdb.itvke2t.mongodb.net/?retryWrites=true&w=majority");
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
// Socket.io logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data);
    });
    socket.on('create_user', async (data, callback) => {
        const { username, password, id } = data;
        try {
            // Check if user already exists
            const existingUser = await User_1.default.findOne({ username });
            if (existingUser) {
                console.log('User already exists:', existingUser);
                return;
            }
            // Generate a salt to use for hashing
            const saltRounds = 10;
            const salt = await bcrypt_1.default.genSalt(saltRounds);
            // Hash the password using the generated salt
            const hashedPassword = await bcrypt_1.default.hash(password, salt);
            // Create a new user with the hashed password
            const user = new User_1.default({ username, password: hashedPassword, id });
            await user.save();
            console.log('User created:', user);
            callback({ success: true });
        }
        catch (error) {
            console.error('Error creating user:', error);
            callback({ success: false });
        }
    });
    socket.on('check_username', async (data, callback) => {
        const { username } = data;
        try {
            const existingUser = await User_1.default.findOne({ username });
            if (existingUser) {
                console.log('User already exists:', existingUser);
                callback({ exists: true });
            }
            else {
                callback({ exists: false });
            }
        }
        catch (error) {
            console.error('Error checking username:', error);
            callback({ error: 'Server error' });
        }
    });
    socket.on('check_password', async (data, callback) => {
        const { username, password } = data;
        try {
            // Find the user by username
            const existingUser = await User_1.default.findOne({ username });
            if (!existingUser) {
                console.log('User not found');
                callback({ exists: false });
                return;
            }
            // Compare the provided password with the stored hashed password
            const passwordMatch = await bcrypt_1.default.compare(password, existingUser.password);
            if (passwordMatch) {
                console.log('Password matches');
                callback({ match: true });
            }
            else {
                console.log('Password does not match');
                callback({ match: false });
            }
        }
        catch (error) {
            console.error('Error checking password:', error);
            callback({ match: false });
        }
    });
});
server.listen(3001, () => {
    console.log('Server listening on port 3001');
});
//# sourceMappingURL=index.js.map