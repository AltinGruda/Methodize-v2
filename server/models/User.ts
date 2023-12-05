const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  }]
});


export default mongoose.model("User", UserSchema);