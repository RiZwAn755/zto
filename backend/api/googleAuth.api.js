import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import Student from "../DB/student.js";
import Admin from "../DB/admin.js";
import "../DB/config.js";

const router = express.Router();

// Test route to verify the endpoint is working
router.get("/", (req, res) => {
  res.json({ 
    message: "Google auth endpoint is working",
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set'
  });
});

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth login/signup endpoint
router.post("/", async (req, res) => {
  try {
    console.log('Google auth request received');
    console.log('Request body:', req.body);
    console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');
    
    const { token } = req.body;
    
    if (!token) {
      console.log('No token provided');
      return res.status(400).json({ error: "Google token is required" });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists (student or admin)
    let user = await Student.findOne({ email });
    let userType = "student";

    if (!user) {
      user = await Admin.findOne({ email });
      userType = "admin";
    }

    // If user doesn't exist, create a new student account
    if (!user) {
      user = new Student({
        name: name,
        email: email,
        password: googleId,
        googleId: googleId,
        profilePicture: picture,
        phone: "0000000000", 
        school: "Google Signup",
        classs: 10 
      });
      await user.save();
      userType = "student";
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { 
        email: user.email, 
        userId: user._id, 
        userType: userType,
        googleId: googleId 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "30m" } 
    );

    // Return token in JSON response for frontend localStorage
    res.status(200).json({
      message: "Google authentication successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || picture,
        userType: userType
      }
    });

  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ 
      error: "Google authentication failed", 
      details: error.message 
    });
  }
});

// Verify Google token endpoint (for frontend validation)
router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    res.status(200).json({ 
      valid: true, 
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    });

  } catch (error) {
    console.error("Token verification error:", error);
    res.status(400).json({ 
      valid: false, 
      error: "Invalid token" 
    });
  }
});

export default router;
