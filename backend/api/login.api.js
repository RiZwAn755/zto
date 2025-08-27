import express from "express";
import Student from "../DB/student.js";
import Admin from "../DB/admin.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const student = await Student.findOne({ email, password });
    const admin = await Admin.findOne({ email, password });

    if (!student && !admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });

    // ✅ Set token in secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ⚠️only works over HTTPS
      sameSite: "Strict", // or 'Lax' depending on your frontend/backend setup
      maxAge: 5 * 60 * 1000 // 5 minutes
    });

    return res.status(200).json({
      message: "Login successful",
      role: student ? "student" : "admin"
      //  don't send token in JSON anymore!
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

export default router;
