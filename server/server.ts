import express, { NextFunction, Request, Response } from 'express';
const mongoose = require('mongoose');
import connectDB from "./config/database";
import teamRoutes from './routes/teamRoutes';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { getTaskComments } from './controllers/projectController';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });


//Connect To Database
connectDB();

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Cors
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.use('/auth', authRoutes)
app.use('/team', teamRoutes)
app.use('/project', projectRoutes);

app.use((error: Error, req:Request, res: Response) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


// socket.io
let onlineUsers: any[] = [];

const addNewUser = (name: any, socketId: any) => {
  !onlineUsers.some((onlineName) => onlineName === name) &&
    onlineUsers.push({ name, socketId });
};

const removeUser = (socketId: any) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username: any) => {
  return onlineUsers.find((user) => user.name === username);
};

io.on('connection', (socket) => {
  socket.on('newUser', (user) => {
    addNewUser(user.name, socket.id);
    console.log(onlineUsers)
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
    } else {
      console.error(`Receiver ${receiverName} not found or missing socketId`);
    }
  })
  

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("Disconnected", socket.id);
  });
})


server.listen(5000, () => console.log('Listening at port 5000'));