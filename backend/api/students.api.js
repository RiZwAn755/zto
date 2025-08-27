// api to get all students


import Student from "../DB/student.js";
import redis from "../DB/redis.js";
import Router from "express";

const router = new Router();



router.get("/" ,  async (req , res) => {
    try {
         const students = await Student.find();
        await redis.set("students", JSON.stringify(students) );
        res.json(students);

    } catch (error) {
        res.status(500).send("Failed to fetch students");
    }
});

export default router;