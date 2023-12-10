const mongoose = require('mongoose');

const SprintSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: Date,
    isFinished: {
        type: Boolean,
        default: false, // Default value is false, indicating the sprint is not finished
    },
});

export default mongoose.model('Sprint', SprintSchema);
