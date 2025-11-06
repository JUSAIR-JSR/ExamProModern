import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  answers: [{ questionId: String, selected: Number }],
  score: Number,
});

export default mongoose.model("Response", responseSchema);
