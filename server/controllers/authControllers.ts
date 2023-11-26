import passport from "passport";
import User from "../models/User";
import { NextFunction, Request, Response } from "express";

export const postLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
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

export const logout = (req: Request, res: Response) => {
  req.logout(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = undefined;
    res.send('User has logged out.')
  });
};

export const getUser = (req: Request, res: Response) => {
  if(!req.user) res.send('User is not logged in!');
  res.send(req.user);
}

export const postSignup = (req: Request, res: Response, next: NextFunction) => {
    const user = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
    });

    User.findOne(
        { $or: [{ email: req.body.email }, { fullname: req.body.fullname }] },
        (err: any, existingUser: any) => {
            if (err) {
            return next(err);
            }
            if (existingUser) {
            return res.send('User already exists!');
            }

            try {
                user.save();

                // Assuming `req.logIn` is a function that logs in the user
                req.logIn(user, (err: any) => {
                    if (err) {
                        return next(err);
                    }
                    res.send(user);
                });
            
            } catch (err) {
                return next(err);
            }
        }
    );
};