// api for student signup, not registered students

import express from "express";
import Student from "../DB/student.js";
import "../DB/config.js";
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        console.log(req.body);

        const { name, lastName, phone, email, password , classs , school } = req.body;
        // Check if email already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(409).json({ error: "Email already exists" });
        }
        const newStudent = new Student({ name, lastName, phone, email, password,classs , school });
        await newStudent.save();
        res.status(201).json({ message: "Student created successfully" });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ errors });
        }
        res.status(500).json({ error: "Failed to create student" });
    }
});

export default router;