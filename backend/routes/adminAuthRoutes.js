import express from "express";
import { googleAdminLogin } from "../controllers/adminGoogleController.js";

const router = express.Router();

// final URL = /api/admin/google-login
router.post("/google-login", googleAdminLogin);

export default router;
