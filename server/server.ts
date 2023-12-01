import express, { NextFunction, Request, Response } from 'express';
const mongoose = require('mongoose');
import connectDB from "./config/database";
import teamRoutes from './routes/teamRoutes';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
const app = express();

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

app.use((error: Error, req:Request, res: Response) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


app.listen(5000, () => console.log('Listening at port 5000'));