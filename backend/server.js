import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import examRoutes from "./routes/examRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Connect to MongoDB
connectDB();

// ✅ Secure and specific CORS setup
app.use(
  cors({
    origin: [
      "https://exampromodern-admin.onrender.com",
      "https://exampromodern-teacher.onrender.com",
      "https://exampromodern-student.onrender.com",
      "http://localhost:5173", // for local testing
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/responses", responseRoutes);

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
