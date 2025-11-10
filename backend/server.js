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

connectDB();

// ✅ Define allowed origins
const allowedOrigins = [
  "https://exampromodern-student.onrender.com",
  "https://exampromodern-teacher.onrender.com",
  "https://exampromodern-admin.onrender.com",
  "https://exampromodern-backend-pj8p.onrender.com",
  "http://localhost:5173", // student dev
  "http://localhost:5174", // admin dev
  "http://localhost:5175", // teacher dev
  "http://localhost:5000",
];

// ✅ Apply CORS with full preflight support
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    // ✅ This ensures browsers receive CORS headers before any route
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/responses", responseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
