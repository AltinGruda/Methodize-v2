import express from 'express';
const mongoose = require('mongoose');
import passport from 'passport';
import session from 'express-session';
const MongoStore = require("connect-mongo")(session);
import connectDB from "./config/database";
import authRoutes from './routes/authRoutes';
import teamRoutes from './routes/teamRoutes';
import cors from 'cors';
const app = express();

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Cors
app.use(cors());

// Setup Sessions - stored in MongoDB
app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', authRoutes);
app.use('/team', teamRoutes)

app.listen(5000, () => console.log('Listening at port 5000'));