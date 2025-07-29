import express from "express";
import cors from "cors";

import signupApi from "./api/signup.api.js";
import loginApi from "./api/login.api.js";
import adminSignup from "./api/adminSignup.api.js";
import adminLogin from "./api/adminLogin.api.js";
import examform from "./api/examform.api.js";
import studentsApi from "./api/students.api.js";
import registeredApi from "./api/registered.api.js";
import gemini from "./api/gemini.api.js";
import googleAuth from "./api/googleAuth.api.js";
import forgotPassword from "./api/forrgot.api.js";
import resetPassword from "./api/resetPassword.api.js";
import updateRegistration from "./api/updateRegistration.api.js";

import "./DB/config.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    'https://zto-fe.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://ztobackend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/stReg", signupApi);
app.use("/Login", loginApi);
app.use("/adminSignup", adminSignup);
app.use("/adminLogin" , adminLogin);
app.use("/regForm", examform);
app.use("/students", studentsApi);
app.use("/registered" , registeredApi);
app.use('/gemini' , gemini);
app.use("/auth/google", googleAuth);
app.use("/forgotPassword", forgotPassword);
app.use("/reset-password", resetPassword);
app.use("/registered/update", updateRegistration);

app.get("/", (req,resp) => {
    resp.send("hii");
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
    console.log("Google auth endpoint: http://localhost:3000/auth/google");
});
