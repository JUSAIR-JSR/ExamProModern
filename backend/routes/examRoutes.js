import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import {
  getExams,
  addExam,
  deleteExam,
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/examController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// 🧠 Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `exam_app_questions/${req.body.examId}`,
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: file.originalname.split(".")[0] + "-" + Date.now(),
  }),
});

const upload = multer({ storage });

/* -------------------------------
   🔐 ROUTES WITH ROLE PROTECTION
--------------------------------*/

// ✅ Anyone logged in (teacher/student/admin) can view all exams
router.get("/", protect, getExams);

// ✅ Only teachers can create exams
router.post("/", protect, requireRole(["teacher"]), addExam);

// ✅ Only teachers or admin can delete an exam
router.delete("/:id", protect, requireRole(["teacher", "admin"]), deleteExam);

// ✅ Any authenticated user (teacher/student/admin) can view questions of an exam
router.get("/:id/questions", protect, getQuestions);

// ✅ Only teachers can add or edit questions
router.post("/questions", protect, requireRole(["teacher"]), upload.single("image"), addQuestion);
router.put("/questions/:id", protect, requireRole(["teacher"]), upload.single("image"), updateQuestion);

// ✅ Only teachers or admin can delete a question
router.delete("/questions/:id", protect, requireRole(["teacher", "admin"]), deleteQuestion);

export default router;
