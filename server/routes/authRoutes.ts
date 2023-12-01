import express from 'express';
const router = express.Router();
const { body } = require('express-validator');

import User from '../models/User';
const authController = require('../controllers/authController');

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value: any) => {
        return User.findOne({ email: value }).then((userDoc: any) => {
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
  ],
  authController.signup
);

router.post('/login', authController.login);



export default router;