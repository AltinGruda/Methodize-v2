"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        }],
});
exports.default = mongoose.model('Project', ProjectSchema);
;
