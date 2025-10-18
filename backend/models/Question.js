import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  text: { type: String, required: true },
  options: [{ type: String }],
  correct: { type: String, required: true },
  timeLimit: { type: Number, default: 30 } // seconds
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);
