"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalStrategy = require("passport-local").Strategy;
const User_1 = __importDefault(require("../models/User"));
module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        User_1.default.findOne({ email: email.toLowerCase() }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { msg: `Email ${email} not found.` });
            }
            if (!user.password) {
                return done(null, false, {
                    msg: "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
                });
            }
            user.comparePassword(password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    return done(null, user);
                }
                return done(null, false, { msg: "Invalid email or password." });
            });
        });
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User_1.default.findById(id, (err, user) => done(err, user));
    });
};
