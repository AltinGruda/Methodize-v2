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
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String, // 'pending', 'accepted', 'rejected'
          default: 'pending',
        },
      }],
})

export default mongoose.model("Team", TeamSchema);