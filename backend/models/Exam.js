import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: Number, // in minutes
});

export default mongoose.model("Exam", examSchema);
