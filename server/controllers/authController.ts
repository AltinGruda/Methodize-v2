import { NextFunction, Request, Response } from "express";

import { validationResult, Result } from "express-validator";
// const bcrypt = require('bcryptjs');
import bcrypt from 'bcryptjs'
const jwt = require('jsonwebtoken');
import User from "../models/User";


exports.signup = (req: Request, res: Response, next: NextFunction) => {
  const errors: Result = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPw: string) => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name
      });
      return user.save();
    })
    .then((result: any) => {
      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch((err: Error) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser: any;
  User.findOne({ email: email })
    .then((user: any) => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      async function comparePassword(password: string, user: any) {
        try {
            const match = await bcrypt.compare(password, user.password);
            return match;
          } catch (error) {
            console.error(error);
          }
      }
      return comparePassword(password, user);
    //   return bcrypt.compare(password, user.password);
    })
    .then((isEqual: boolean) => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'somesupersecretsecret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString(), user: loadedUser });
    })
    .catch((err: Error) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};