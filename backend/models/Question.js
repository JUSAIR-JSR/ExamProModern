// backend/models/Question.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  text: { type: String, required: true },
  image: { type: String },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },

  // SSC-style numeric fields (ensure Number)
  marks: { type: Number, default: 2, required: true },
  negativeMarks: { type: Number, default: 0.5, required: true },

  // New fields for tier and section
  // tier: "I" | "II" (or numeric 1/2) — keep as String for flexibility
  tier: { type: String, enum: ["I", "II"], default: "I" },

  // section: e.g., "Quant", "Reasoning", "English", "GK"
  section: { type: String, default: "General" },
},
{
  timestamps: true,
});

export default mongoose.model("Question", questionSchema);
