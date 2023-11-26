"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new User_1.default({
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
        });
        const existingUser = yield User_1.default.findOne({ $or: [{ email: req.body.email }, { fullname: req.body.fullname }] });
        if (existingUser) {
            return res.send('User already exists!');
        }
        user.save();
        // Assuming `req.logIn` is a function that logs in the user
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            res.send(user);
        });
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
});
exports.postSignup = postSignup;
