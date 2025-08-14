// api to get all students

import express from "express";
import Student from "../DB/student.js";
import {Redis} from "ioredis";
// import { verifyToken } from "../middlewares/jwt.middleware.js";
const router = express.Router();

const redis = new Redis({

      host: 'redis-16352.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
  port: 16352,
  password: 'M2L1nPscU6PMBOlXgNMnJp43AQgcvyvN',    
})


router.get("/" ,  async (req , res) => {
    try {

        let students = await redis.get("students");
        if(students){
            console.log("response from Redis");
            return res.send(JSON.parse(students));
        }

        students = await Student.find();
        await redis.set("students", JSON.stringify(students) ,"EX", 60);
        res.send(students);

    } catch (error) {
        res.status(500).send("Failed to fetch students");
    }
});

export default router;