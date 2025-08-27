// api to submit exam form

import express from "express";
import Registrations from "../DB/examForm.js";
import "../DB/config.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";


const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
    try {
        const {
            fullname,
            address,
            school,
            class: studentClass,
            zone, 
            phone,
            email,
            parentName,
            parentPhone,
            dob
        } = req.body;

      
        if (
            !fullname || !address || !school || !studentClass ||
            !phone || !email || !parentName || !parentPhone || !dob
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newForm = new Registrations({
            fullname,
            address,
            school,
            class: studentClass,
            zone, 
            phone,
            email,
            parentName,
            parentPhone,
            dob,
            
        });

        await newForm.save();
        res.status(201).json({ message: "Form submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to submit form", details: error.message });
    }
});

export default router;