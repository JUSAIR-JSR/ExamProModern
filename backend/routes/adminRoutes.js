import express from "express";
import User from "../models/User.js";
import Exam from "../models/Exam.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// ✅ Admin can view all users
router.get("/users", protect, requireRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ Admin can delete a user
router.delete("/user/:id", protect, requireRole(["admin"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// ✅ Admin can view all exams
router.get("/exams", protect, requireRole(["admin"]), async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch exams" });
  }
});

// ✅ Admin can delete an exam
router.delete("/exam/:id", protect, requireRole(["admin"]), async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete exam" });
  }
});

// 🧑‍🏫 Admin can create teacher
router.post("/create-teacher", protect, requireRole(["admin"]), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const newTeacher = await User.create({
      name,
      email,
      password,
      role: "teacher",
    });

    res.status(201).json({
      message: "Teacher created successfully",
      teacher: { id: newTeacher._id, name: newTeacher.name, email: newTeacher.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create teacher", error: error.message });
  }
});

export default router;
