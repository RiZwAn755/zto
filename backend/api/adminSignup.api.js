// api for admin signup
import express from "express";
import Admin from "../DB/admin.js";
import "../DB/config.js";
const router = express.Router();

router.post("/",  async (req, res) => {
    try {
        const { name, referrer, email, password } = req.body;

        if (!name || !referrer || !email || !password) {
            return res.status(400).send("All fields (name, referrer, email, password) are required");
        }

        const newAdmin = new Admin({ name, referrer, email, password });
        await newAdmin.save();
        res.status(201).send({ message: `Congratulations ${referrer}, now ${name} is an Admin` });
    } catch (error) {
        console.error(error); // Log the real error for debugging
        res.status(500).send({ error: "Failed to create admin", details: error.message });
    }
});

export default router;
