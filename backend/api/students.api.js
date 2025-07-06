// api to get all students

import express from "express";
import Student from "../DB/student.js";
const router = express.Router();


router.get("/" , async (req , res) => {
    try {
        const students = await Student.find();
        console.log(students);
        res.send(students);
    } catch (error) {
        res.status(500).send("Failed to fetch students");
    }
});

export default router;