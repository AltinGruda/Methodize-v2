"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    fullname: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
});
exports.default = mongoose.model("User", UserSchema);
