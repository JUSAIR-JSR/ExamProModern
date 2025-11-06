

// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";
// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// console.log("✅ Cloudinary Config:", {
//   name: process.env.CLOUDINARY_CLOUD_NAME,
//   key: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
// });

// export default cloudinary;
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  });

  console.log("✅ Cloudinary initialized:", process.env.CLOUDINARY_CLOUD_NAME);
} catch (err) {
  console.error("❌ Cloudinary init error:", err);
}

export default cloudinary;
