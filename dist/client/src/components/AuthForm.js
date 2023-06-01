"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const socket_io_client_1 = require("socket.io-client");
const uuid_1 = require("uuid");
const socket = (0, socket_io_client_1.io)('http://localhost:3001');
const AuthForm = ({ setAuthenticated }) => {
    const [username, setUsername] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [isSignIn, setIsSignIn] = (0, react_1.useState)(true); // New state to track if it's Sign In or Log In
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        const id = (0, uuid_1.v4)(); // Generate a unique ID using uuidv4()
        try {
            if (isSignIn) {
                // Check if the username already exists
                socket.emit('check_username', { username }, (response) => {
                    if (response.exists) {
                        alert('Username already exists');
                        return;
                    }
                });
                // Create a new user using socket.io
                socket.emit('create_user', { username, password, id }, (response) => {
                    if (response.success) {
                        console.log('Signed in as:', username); // Log the username
                        setAuthenticated(true);
                    }
                    else {
                        console.error('Error creating user:', response.error);
                        // Handle the error
                    }
                });
            }
            else {
                // Log In functionality
                // Check if the username exists
                socket.emit('check_username', { username }, (response) => {
                    if (!response.exists) {
                        alert('Username does not exist');
                        return;
                    }
                });
                // Check if password matches
                socket.emit('check_password', { username, password }, (passwordResponse) => {
                    if (passwordResponse.match) {
                        console.log('Logged as:', username); // Log the username
                        setAuthenticated(true);
                    }
                    else {
                        alert('Password is not valid');
                        return;
                    }
                });
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    };
    const toggleSignIn = () => {
        setIsSignIn(!isSignIn);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { children: isSignIn ? 'Sign In' : 'Log In' }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleFormSubmit, children: [(0, jsx_runtime_1.jsxs)("label", { children: ["Username:", (0, jsx_runtime_1.jsx)("input", { type: "text", value: username, onChange: handleUsernameChange })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("label", { children: ["Password:", (0, jsx_runtime_1.jsx)("input", { type: "password", value: password, onChange: handlePasswordChange })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("button", { type: "submit", children: isSignIn ? 'Sign In' : 'Log In' })] }), (0, jsx_runtime_1.jsx)("button", { onClick: toggleSignIn, children: isSignIn ? 'Log In with existing account' : 'Create new account' })] }));
};
exports.default = AuthForm;
//# sourceMappingURL=AuthForm.js.map