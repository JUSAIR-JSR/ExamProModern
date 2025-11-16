import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const adminGoogleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "No credential received" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const googleId = payload.sub;
    const name = payload.name;

    // Allowed admin emails
    const allowed = process.env.ADMIN_GOOGLE_EMAILS.split(",");

    if (!allowed.includes(email)) {
      return res.status(403).json({
        message: "This Google email is not authorized for admin access.",
      });
    }

    // Find or create admin
    let admin = await Admin.findOne({ email });

    if (!admin) {
      admin = await Admin.create({
        name,
        email,
        googleId,
        role: "admin",
      });
    } else {
      admin.googleId = googleId;
      admin.name = name;
      await admin.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Google login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({ message: "Google login failed" });
  }
};
