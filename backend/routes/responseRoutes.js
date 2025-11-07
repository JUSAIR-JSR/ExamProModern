import express from "express";
import { submitExam, getMyResponses } from "../controllers/responseController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ✅ Protect both routes
router.post("/submit", protect, submitExam);
router.get("/my", protect, getMyResponses);

export default router;
