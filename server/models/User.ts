import { NextFunction } from "express";
const mongoose = require('mongoose')
import bcrypt from "bcrypt";


const UserSchema = new mongoose.Schema({
  fullname: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

// Password hash middleware.

UserSchema.pre('save', function save(this: any, next: NextFunction) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err: any, salt: any) => {
    if (err) {
      return next(err);
    }
    if(!user.password) {
      return next(err);
    }
    bcrypt.hash(user.password as string | Buffer, salt, (err: any, hash: any) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword: any,
  cb: any
) {
  bcrypt.compare(candidatePassword, this.password, (err: any, isMatch: any) => {
    cb(err, isMatch);
  });
};

export default mongoose.model("User", UserSchema);