import express from "express";
import { adminGoogleLogin } from "../controllers/adminGoogleController.js";

const router = express.Router();

router.post("/google-login", adminGoogleLogin);

export default router;
