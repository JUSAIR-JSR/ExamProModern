import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  googleId: { type: String },  
  role: { type: String, default: "admin" }
});

export default mongoose.model("Admin", adminSchema);
