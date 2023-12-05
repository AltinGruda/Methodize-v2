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
        // user: {
        //   type: {
        //     _id: mongoose.Schema.Types.ObjectId,
        //     name: String,
        //     email: String
        //   },
        // },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        // status: {
        //   type: String, // 'pending', 'accepted', 'rejected'
        //   default: 'pending',
        // },
    }],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    }],
})

export default mongoose.model("Team", TeamSchema);