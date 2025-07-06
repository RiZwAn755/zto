// api to get registered students

import express from "express";
import examForm from "../DB/examForm.js";

const router = express.Router();

router.get("/", async (req, resp) => {
    try {
        const registered_students = await examForm.find();
        resp.send(registered_students);
    } catch (error) {
        resp.status(500).send("Unable to fetch");
    }
});

export default router;