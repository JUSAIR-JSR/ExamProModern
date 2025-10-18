import express from "express";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password, role: role || "student" });
    await user.save();

    // Auto login
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Error logging in" });
      const userObj = user.toObject ? user.toObject() : user;
      delete userObj.password;
      res.json({ user: userObj });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", (req, res, next) => {
  console.log("I am here");
  
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });
    
    req.login(user, (err) => {
      if (err) return next(err);
      const { password, ...u } = user.toObject();
      return res.json({ user: u });
    });
  })(req, res, next);
});



// Logout
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

export default router;
