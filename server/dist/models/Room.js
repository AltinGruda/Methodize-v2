"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    api_created: {
        type: Boolean,
        required: true,
    },
    privacy: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
    },
    config: {
        max_participants: { type: Number, required: true },
        nbf: { type: Number, required: true },
        exp: { type: Number, required: true },
        start_video_off: { type: Boolean, required: true },
        enable_recording: { type: String, enum: ['cloud', 'local', 'none'], required: true }
    }
});
exports.default = (0, mongoose_1.model)("Room", roomSchema);
