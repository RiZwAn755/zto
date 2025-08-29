import express from "express";
import cookieParser from "cookie-parser";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = express.Router();
router.use(cookieParser());

router.get("/", verifyToken, (req, res) => {

 res.status(200).json({
    email: req.user.email,
    role: req.user.role
  });

});

export default router;
