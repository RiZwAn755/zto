// api for admin login

import express from "express";
import Admin from "../DB/admin.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";
const router = express.Router();

router.post("/", verifyToken,  async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send("Please fill all the required fields");
    }

    const admin = await Admin.findOne({ name , email, password });

    if (!admin) {
        return res.status(401).send("Invalid credentials");
    }

    res.status(200).send("Login Successful");
});

export default router;