import express from "express";

import { login, register } from "../controllers/user.controller.js";
import dotenv from "dotenv"
import { authenticate } from "../middlewares/auth.middleware.js";
dotenv.config()


const userRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ;

userRouter.post("/signup", register);

userRouter.post("/signin",login );


userRouter.get("/verify", authenticate, (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});
userRouter.post('/signout', (req, res) => {
  res.clearCookie('session-id'); 
  return res.status(200).json({ message: "Signed out successfully" });
});


export default userRouter;
