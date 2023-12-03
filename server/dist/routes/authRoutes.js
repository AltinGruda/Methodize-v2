"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { body } = require('express-validator');
const User_1 = __importDefault(require("../models/User"));
const authController = require('../controllers/authController');
router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value) => {
        return User_1.default.findOne({ email: value }).then((userDoc) => {
            if (userDoc) {
                return Promise.reject('E-Mail address already exists!');
            }
        });
    })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('name')
        .trim()
        .not()
        .isEmpty()
], authController.signup);
router.post('/login', authController.login);
router.get('/users', authController.allUsers);
router.get('/user/:id', authController.getUserById);
exports.default = router;
