"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSignup = exports.getUser = exports.logout = exports.postLogin = void 0;
const passport_1 = __importDefault(require("passport"));
const User_1 = __importDefault(require("../models/User"));
const postLogin = (req, res, next) => {
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send('User doesnt exist!');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            res.send(user);
        });
    })(req, res, next);
};
exports.postLogin = postLogin;
const logout = (req, res) => {
    req.logout(() => {
        console.log('User has logged out.');
    });
    req.session.destroy((err) => {
        if (err)
            console.log("Error : Failed to destroy the session during logout.", err);
        req.user = undefined;
        res.send('User has logged out.');
    });
};
exports.logout = logout;
const getUser = (req, res) => {
    if (!req.user)
        res.send('User is not logged in!');
    res.send(req.user);
};
exports.getUser = getUser;
const postSignup = (req, res, next) => {
    const user = new User_1.default({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
    });
    User_1.default.findOne({ $or: [{ email: req.body.email }, { fullname: req.body.fullname }] }, (err, existingUser) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res.send('User already exists!');
        }
        try {
            user.save();
            // Assuming `req.logIn` is a function that logs in the user
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.send(user);
            });
        }
        catch (err) {
            return next(err);
        }
    });
};
exports.postSignup = postSignup;
