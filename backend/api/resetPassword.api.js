import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../DB/student.js';
import Admin from '../DB/admin.js';
import "../DB/config.js";

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        // Verify the JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const { email } = decoded;

        // Find user (student or admin)
        let user = await Student.findOne({ email });
        let userType = 'student';

        if (!user) {
            user = await Admin.findOne({ email });
            userType = 'admin';
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password
        user.password = password;
        await user.save();

        res.status(200).json({ 
            message: 'Password reset successfully',
            userType: userType
        });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ 
            message: 'Failed to reset password',
            error: error.message 
        });
    }
});

export default router;  