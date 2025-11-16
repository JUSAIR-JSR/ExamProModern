import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const adminGoogleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // 1. Verify Google JWT token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // 2. Only allow selected admins
    const allowedAdmins = process.env.ADMIN_GOOGLE_EMAILS
      .split(",")
      .map((e) => e.trim());

    if (!allowedAdmins.includes(email)) {
      return res.status(403).json({ message: "Unauthorized admin email" });
    }

    // 3. Find admin in DB
    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Admin account does not exist in system",
      });
    }

    // 4. Generate token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Google Admin login successful",
      token,
      role: "admin",
      email,
      name: payload.name,
    });

  } catch (error) {
    console.log("GOOGLE LOGIN ERROR", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};
