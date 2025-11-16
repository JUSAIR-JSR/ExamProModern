import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";  // ✅ use your existing User model
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAdminLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "No credential token provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // ✔ Allowed admins list
    const allowed = process.env.ADMIN_GOOGLE_EMAILS.split(",").map((e) => e.trim());

    if (!allowed.includes(email)) {
      return res.status(403).json({ message: "Not authorized admin" });
    }

    // ✔ Find admin in User collection
    let admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(401).json({
        message: "Admin account not found. Add admin manually in database.",
      });
    }

    // ✔ Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: "admin",
      email,
      name: admin.name,
      message: "Admin login successful",
    });
  } catch (err) {
    console.error("Google Admin Login Error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
};
