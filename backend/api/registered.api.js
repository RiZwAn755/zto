// api to get registered students

import express from "express";
import examForm from "../DB/examForm.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";
 import redis from "../DB/redis.js";

const router = express.Router();

router.get("/", verifyToken,  async (req, resp) => {
    try {
        
        let registered_students = await redis.get("registered_students");

        if(registered_students){

            return resp.send(
                JSON.parse(registered_students)                
            )
        }

        registered_students = await examForm.find();
        await redis.set("registered_students", JSON.stringify(registered_students) , "EX" ,60 );
        resp.send(

          registered_students
    );

    } catch (error) {
        resp.status(500).send("Unable to fetch");
    }
});

export default router;