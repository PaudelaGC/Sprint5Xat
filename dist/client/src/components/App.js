"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const socket_io_client_1 = require("socket.io-client");
const react_1 = require("react");
const AuthForm_1 = __importDefault(require("./AuthForm"));
const socket = (0, socket_io_client_1.io)('http://localhost:3001');
function App() {
    const [authenticated, setAuthenticated] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)('');
    const [messageReceived, setMessageReceived] = (0, react_1.useState)('');
    const sendMessage = () => {
        socket.emit('send_message', { message });
    };
    (0, react_1.useEffect)(() => {
        socket.on('receive_message', (data) => {
            setMessageReceived(data.message);
        });
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", { className: "App", children: !authenticated ? ((0, jsx_runtime_1.jsx)(AuthForm_1.default, { setAuthenticated: setAuthenticated })) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("input", { placeholder: "Message...", onChange: (event) => {
                        setMessage(event.target.value);
                    } }), (0, jsx_runtime_1.jsx)("button", { onClick: sendMessage, children: " Send message" }), (0, jsx_runtime_1.jsx)("h1", { children: "Message:" }), messageReceived] })) }));
}
exports.default = App;
//# sourceMappingURL=App.js.map