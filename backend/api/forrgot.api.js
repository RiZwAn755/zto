import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Student from '../DB/student.js';

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {

    const { email } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Verify transporter configuration
    try {
        await transporter.verify();
        console.log('Email transporter verified successfully');
    } catch (error) {
        console.error('Email transporter verification failed:', error);
        return res.status(500).json({ message: 'Email service configuration error' });
    }

    const foundStudent = await Student.findOne({ email });
    if (!foundStudent) {
        return res.status(404).json({ message: 'No Student found with this email' });
    }

    const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: '1h' });

    const receiver = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: 'Click the link to reset your password',
        html: `<p>Click the link to reset your password</p>
        <a href="https://zto-fe.vercel.app/ForgotPassword?token=${token}">Reset Password</a>`,
    }

    try {
        const info = await transporter.sendMail(receiver);
        console.log('Email sent successfully:', info.messageId);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Email sending failed:', error);
        res.status(500).json({ 
            message: 'Failed to send reset link',
            error: error.message 
        });
    }

});

export default router;