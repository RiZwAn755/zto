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
        subject: 'Zonal Talent Olympiad - Password Reset Request',
        text: 'Click the link to reset your password',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - Zonal Talent Olympiad</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                .footer { background: #f0f0f0; padding: 20px; text-align: center; border-radius: 10px; margin-top: 20px; }
                .contact-info { background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
                .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎓 Zonal Talent Olympiad</h1>
                    <p>Empowering Students Through Excellence</p>
                </div>
                
                <div class="content">
                    <h2>Password Reset Request</h2>
                    
                    <p>Dear Student,</p>
                    
                    <p>We received a request to reset your password for your Zonal Talent Olympiad account. If you made this request, please click the button below to create a new password:</p>
                    
                    <div style="text-align: center;">
                        <a href="https://zto-fe.vercel.app/resetPassword?token=${token}" class="button">Reset My Password</a>
                    </div>
                    
                    <div class="warning">
                        <strong>⚠️ Important:</strong>
                        <ul>
                            <li>This link will expire in 1 hour for security reasons</li>
                            <li>If you didn't request this password reset, please ignore this email</li>
                            <li>Never share this link with anyone</li>
                        </ul>
                    </div>
                    
                    <div class="contact-info">
                        <h3>📞 Need Help?</h3>
                        <p>Our support team is here to assist you with:</p>
                        <ul>
                            <li>📝 Exam registrations and scheduling</li>
                            <li>📚 Study materials and resources</li>
                            <li>🏆 Competition details and results</li>
                            <li>💻 Technical support and account issues</li>
                            <li>❓ Any other queries or concerns</li>
                        </ul>
                        
                        <p><strong>Contact us:</strong></p>
                        <p>📧 Email: teamworkzto1@gmail.com</p>
                        <p>📱 WhatsApp: +91-6386137862</p>
                        <p>🌐 Website: <a href="https://zto-fe.vercel.app">zto-fe.vercel.app</a></p>
                    </div>
                    
                    <p>Best regards,<br>
                    <strong>Zonal Talent Olympiad Team</strong><br>
                    Empowering Students, Building Futures</p>
                </div>
                
                <div class="footer">
                    <p>© 2024 Zonal Talent Olympiad. All rights reserved.</p>
                    <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
                </div>
            </div>
        </body>
        </html>
        `,
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