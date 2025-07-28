import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Student from '../DB/student.js';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', async (req, res) => {

    const {newPassword } = req.body;
    const token = req.params.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findOne({ email: decoded.email });

    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    student.password = newPassword;
    await student.save();

    res.status(200).json({ message: 'Password reset successfully' });
});

export default router;  