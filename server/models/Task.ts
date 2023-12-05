const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    assigneeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    due_date: Date,
    completed: Boolean,
    completed_at: Date,
    comments:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    status: String,
});

export default mongoose.model('Task', TaskSchema);;
