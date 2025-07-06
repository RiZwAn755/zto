// api for student signup, not registered students

import express from "express";
import Student from "../DB/student.js";
import "../DB/config.js";
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        console.log(req.body);

        const { name, lastName, phone, email, password , classs , school } = req.body;
        const newStudent = new Student({ name, lastName, phone, email, password,classs , school });
        await newStudent.save();
        res.status(201).json({ message: "Student created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to create student" });
    }
});

export default router;