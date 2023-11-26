"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose.Schema({
    fullname: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
});
// Password hash middleware.
UserSchema.pre('save', function save(next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt_1.default.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        if (!user.password) {
            return next(err);
        }
        bcrypt_1.default.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
// Helper method for validating user's password.
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt_1.default.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};
exports.default = mongoose.model("User", UserSchema);
