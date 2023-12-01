const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
  fullname: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});


export default mongoose.model("User", UserSchema);