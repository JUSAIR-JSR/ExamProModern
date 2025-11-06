// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/exam_system");
//     console.log("✅ MongoDB Connected");
//   } catch (error) {
//     console.error("❌ Database Connection Error:", error);
//   }
// };

// export default connectDB;


import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
