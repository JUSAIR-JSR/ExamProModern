import express from "express";
import { submitExam } from "../controllers/responseController.js";

const router = express.Router();

router.post("/submit", submitExam);

export default router;
