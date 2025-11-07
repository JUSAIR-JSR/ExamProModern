import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Link to teacher
});

export default mongoose.model("Exam", examSchema);
