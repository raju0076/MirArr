import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../models/User.model.js";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "Password hashing failed" });
      }

      const newUser = await User.create({
        email,
        password: hashedPassword,
      });

      res.status(201).json({ 
        message: "User created successfully", 
        user: newUser 
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" } 
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, 
      sameSite: "strict"
    });

    res.status(200).json({ message: "Signin successful", token });
  } catch (error) {
    res.status(500).json({ message: "Signin failed", error: error.message });
  }
};
