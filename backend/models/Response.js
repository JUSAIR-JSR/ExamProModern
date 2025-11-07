// backend/models/Response.js
import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // answers: array of { questionId, selected }
  answers: { type: Array, required: true },

  // overall
  score: { type: Number, required: true },
  correctCount: { type: Number, default: 0 },
  wrongCount: { type: Number, default: 0 },
  unattempted: { type: Number, default: 0 },

  // Tier-wise and section-wise breakdown
  tierScores: { type: Object, default: {} },     // e.g. { I: { score: 40, totalMarks: 50 }, II: {...} }
  sectionScores: { type: Object, default: {} },  // e.g. { Quant: { score:10, totalMarks:12, correct:5, wrong:1, unattempted:0 } }

  // total time used by student (optional)
  timeTakenSeconds: { type: Number, default: null },

  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Response", responseSchema);
