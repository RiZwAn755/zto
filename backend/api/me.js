// apis/me.js

import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser());

router.get("/", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      email: decoded.email,
      role: decoded.role // only if you include it in your token
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

export default router;
