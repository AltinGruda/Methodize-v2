"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose = require('mongoose');
const database_1 = __importDefault(require("./config/database"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});
//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });
//Connect To Database
(0, database_1.default)();
//Body Parsing
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
//Cors
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/team', teamRoutes_1.default);
app.use('/project', projectRoutes_1.default);
app.use('/room', roomRoutes_1.default);
app.use((error, req, res) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});
// socket.io
let onlineUsers = [];
const addNewUser = (name, socketId) => {
    !onlineUsers.some((onlineName) => onlineName === name) &&
        onlineUsers.push({ name, socketId });
};
const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const getUser = (username) => {
    return onlineUsers.find((user) => user.name === username);
};
io.on('connection', (socket) => {
    socket.on('newUser', (user) => {
        addNewUser(user.name, socket.id);
        console.log(onlineUsers);
    });
    socket.on("sendNotification", ({ senderName, receiverName }) => {
        const receiver = getUser(receiverName);
        console.log(receiver);
        // Check if receiver is defined before accessing properties
        if (receiver && receiver.socketId) {
            io.to(`${receiver.socketId}`).emit("getNotification", {
                senderName,
            });
            console.log("Receiving: ", receiver, receiver.socketId, senderName);
        }
        else {
            console.error(`Receiver ${receiverName} not found or missing socketId`);
        }
    });
    socket.on("disconnect", () => {
        removeUser(socket.id);
        console.log("Disconnected", socket.id);
    });
});
server.listen(5000, () => console.log('Listening at port 5000'));
