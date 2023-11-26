"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose = require('mongoose');
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const MongoStore = require("connect-mongo")(express_session_1.default);
const database_1 = __importDefault(require("./config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });
// Passport config
require("./config/passport")(passport_1.default);
//Connect To Database
(0, database_1.default)();
//Body Parsing
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Setup Sessions - stored in MongoDB
app.use((0, express_session_1.default)({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
// Passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routes
app.use('/', authRoutes_1.default);
app.listen(5000, () => console.log('Listening at port 5000'));
