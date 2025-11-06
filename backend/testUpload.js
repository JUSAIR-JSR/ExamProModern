import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("☁️ Testing Cloudinary upload...");
const testFile = "./config/test.png"; // place any small PNG image there

if (!fs.existsSync(testFile)) {
  console.error("❌ test.png not found in config folder");
  process.exit(1);
}

cloudinary.uploader.upload(testFile, { folder: "exam_app_questions" })
  .then((result) => {
    console.log("✅ Cloudinary upload success:", result.secure_url);
  })
  .catch((err) => {
    console.error("❌ Cloudinary upload failed:", err.message);
    console.error(err);
  });
