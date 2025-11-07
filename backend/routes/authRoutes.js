import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

/* ==============================
   🔹 Common Login Route
================================*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "5h" }
  );

  res.json({
    token,
    role: user.role,
    name: user.name,
    email: user.email,
  });
});


/* ==============================
   🧑‍🎓 Student Registration
================================*/
router.post("/register/student", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

const newUser = await User.create({
  name,
  email,
  password, // plain password
  role: "student",
});


    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Student registration successful",
      token,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Student registration failed",
      error: error.message,
    });
  }
});

/* ==============================
   🧑‍🏫 Teacher/Admin Seeding (Manual)
================================*/
router.post("/register/teacher", async (req, res) => {
  try {
    const { name, email, password } = req.body;
const newUser = await User.create({
  name,
  email,
  password, // plain password
  role: "teacher",
});

    res.status(201).json({ message: "Teacher created", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to register teacher" });
  }
});

export default router;
