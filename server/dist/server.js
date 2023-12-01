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
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
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
app.use((error, req, res) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});
app.listen(5000, () => console.log('Listening at port 5000'));
