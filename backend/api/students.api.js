// api to get all students


import Student from "../DB/student.js";
import redis from "../DB/redis.js";
import Router from "express";

const router = new Router();

// import { verifyToken } from "../middlewares/jwt.middleware.js";


router.get("/" ,  async (req , res) => {
    try {

        const students = await redis.get("students");
        if(students){
            console.log("response from Redis");
            return res.send(JSON.parse(students));
        }

         students = await Student.find();
        await redis.set("students", JSON.stringify(students) );
        res.send(students);

    } catch (error) {
        res.status(500).send("Failed to fetch students");
    }
});

export default router;