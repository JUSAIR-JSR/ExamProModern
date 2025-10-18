import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // teacher
  totalTime: { type: Number, default: 0 }, // seconds, 0 = per-question time
  published: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Exam", examSchema);
