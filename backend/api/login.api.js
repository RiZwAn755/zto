// api for student  login

import express from "express";
import Student from "../DB/student.js";
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const student = await Student.findOne({ email, password });
        if (!student) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error(error); // This will show up in Vercel logs
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

export default router;