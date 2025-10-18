import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js";

export default function(passport) {
passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return done(null, false, { message: "Incorrect email or password." });

  const ok = await user.comparePassword(password);
  if (!ok) return done(null, false, { message: "Incorrect email or password." });

  return done(null, user);
}));


  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
