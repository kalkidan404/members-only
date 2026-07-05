const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const userModel = require("../models/userModel");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userModel.findUserByEmail(username);

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Wrong password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;