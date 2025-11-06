import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  text: String,
  options: [String],
  correctAnswer: Number,
  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 },
  section: { type: String, default: "General" },
  image: { type: String }, // ✅ NEW: image URL
});

export default mongoose.model("Question", questionSchema);
