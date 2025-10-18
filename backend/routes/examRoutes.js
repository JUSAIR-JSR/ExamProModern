import express from "express";
import Exam from "../models/Exam.js";
import Question from "../models/Question.js";
import { ensureAuthenticated, ensureTeacher } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create exam (teacher only)
router.post("/", ensureAuthenticated, ensureTeacher, async (req, res) => {
  const { title, description, totalTime, published } = req.body;
  const exam = new Exam({ title, description, totalTime: Number(totalTime) || 0, published: !!published, owner: req.user._id });
  await exam.save();
  res.json(exam);
});

// Get all exams for current teacher OR all published exams for students if not teacher
router.get("/", ensureAuthenticated, async (req, res) => {
  if (req.user.role === "teacher") {
    const exams = await Exam.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return res.json(exams);
  } else {
    // student: only published exams
    const exams = await Exam.find({ published: true }).sort({ createdAt: -1 });
    return res.json(exams);
  }
});

// Get single exam (teachers can access their own exam; students can access published exam)
router.get("/:id", ensureAuthenticated, async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) return res.status(404).json({ message: "Exam not found" });
  if (req.user.role === "teacher" && String(exam.owner) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });
  if (req.user.role === "student" && !exam.published) return res.status(403).json({ message: "Exam not available" });
  res.json(exam);
});

// Update exam (teacher only, must own)
router.put("/:id", ensureAuthenticated, ensureTeacher, async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) return res.status(404).json({ message: "Exam not found" });
  if (String(exam.owner) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });
  Object.assign(exam, req.body);
  await exam.save();
  res.json(exam);
});

// Delete exam + questions (teacher only)
router.delete("/:id", ensureAuthenticated, ensureTeacher, async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) return res.status(404).json({ message: "Exam not found" });
  if (String(exam.owner) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });
  await Question.deleteMany({ examId: exam._id });
  await exam.deleteOne();
  res.json({ message: "Exam and its questions deleted" });
});

export default router;
