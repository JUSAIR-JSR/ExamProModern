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

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `exam_app_questions/${req.body.examId}`,
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: file.originalname.split(".")[0] + "-" + Date.now(),
  }),
});

const upload = multer({ storage });

router.get("/", getExams);
router.post("/", addExam);
router.delete("/:id", deleteExam);
router.get("/:id/questions", getQuestions);
router.post("/questions", upload.single("image"), addQuestion);
router.put("/questions/:id", upload.single("image"), updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;
