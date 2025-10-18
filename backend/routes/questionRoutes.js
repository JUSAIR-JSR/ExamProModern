import express from "express";
import Question from "../models/Question.js";
import Exam from "../models/Exam.js";
import { ensureAuthenticated, ensureTeacher } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get questions for an exam (teachers can for their own exam; students only for published exam)
// Get randomized questions for an exam
router.get("/exam/:examId", ensureAuthenticated, async (req, res) => {
  const exam = await Exam.findById(req.params.examId);
  if (!exam) return res.status(404).json({ message: "Exam not found" });

  if (req.user.role === "teacher" && String(exam.owner) !== String(req.user._id))
    return res.status(403).json({ message: "Forbidden" });

  if (req.user.role === "student" && !exam.published)
    return res.status(403).json({ message: "Exam not available" });

  // Get all questions for that exam
  const qs = await Question.find({ examId: exam._id });

  // 🔀 Randomize using Fisher–Yates shuffle
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qs[i], qs[j]] = [qs[j], qs[i]];
  }

  res.json(qs);
});


// Create question (teacher only, must own exam)
router.post("/", ensureAuthenticated, ensureTeacher, async (req, res) => {
  const { examId, text, options, correct, timeLimit } = req.body;
  const exam = await Exam.findById(examId);
  if (!exam) return res.status(404).json({ message: "Exam not found" });
  if (String(exam.owner) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });
  const q = new Question({ examId, text, options: options || [], correct, timeLimit: Number(timeLimit) || 30 });
  await q.save();
  res.json(q);
});

// Update question (teacher only, must own exam)
router.put("/:id", ensureAuthenticated, ensureTeacher, async (req, res) => {
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ message: "Question not found" });
  const exam = await Exam.findById(q.examId);
  if (!exam) return res.status(404).json({ message: "Exam not found" });
  if (String(exam.owner) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });
  Object.assign(q, req.body);
  await q.save();
  res.json(q);
});

// Delete question (teacher only)
router.delete("/:id", ensureAuthenticated, ensureTeacher, async (req, res) => {
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ message: "Question not found" });
  const exam = await Exam.findById(q.examId);
  if (String(exam.owner) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });
  await q.deleteOne();
  res.json({ message: "Question deleted" });
});

export default router;
