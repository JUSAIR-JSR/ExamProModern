import Admin from "../models/Admin.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const adminGoogleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId, name } = payload;

    // Allow only emails listed in env
    const allowed = process.env.ADMIN_GOOGLE_EMAILS.split(",");
    if (!allowed.includes(email)) {
      return res.status(403).json({ message: "This email is not allowed for admin login" });
    }

    // ------------------------------
    // 1️⃣ Ensure admin exists in Admin table
    // ------------------------------
    let admin = await Admin.findOne({ email });

    if (!admin) {
      admin = await Admin.create({
        name,
        email,
        googleId,
        role: "admin"
      });
    }

    // ------------------------------
    // 2️⃣ Ensure same admin exists in User table (IMPORTANT)
    // ------------------------------
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "GOOGLE_LOGIN",
        role: "admin",  // important
      });
    }

    // ------------------------------
    // 3️⃣ JWT Token (use User's ID)
    // ------------------------------
    const token = jwt.sign(
      { id: user._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Google login successful",
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "admin",
      }
    });

  } catch (err) {
    console.error("Google Login Error:", err);
    return res.status(500).json({ message: "Google login failed" });
  }
};
