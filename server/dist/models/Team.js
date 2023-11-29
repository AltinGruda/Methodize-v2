"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
            user: {
                type: {
                    _id: mongoose.Schema.Types.ObjectId,
                    fullname: String,
                    email: String
                },
            },
            status: {
                type: String, // 'pending', 'accepted', 'rejected'
                default: 'pending',
            },
        }],
});
exports.default = mongoose.model("Team", TeamSchema);
