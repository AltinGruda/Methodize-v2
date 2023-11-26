const LocalStrategy = require("passport-local").Strategy;
import User from "../models/User";

module.exports = function (passport: any) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email: any, password: any, done: any) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() })
        if(!user){
          return done(null, false, { msg: `Email ${email} not found.` });
        }
        if (!user.password) {
          return done(null, false, {
            msg:
              "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
          });
        }
        user.comparePassword(password, (err: any, isMatch: any) => {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { msg: "Invalid email or password." });
        });

      } catch (error) {
        console.log(error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
  });

  passport.deserializeUser( async (id: any, done: any) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.log(error);
      done(error, null);
    }
  });
};