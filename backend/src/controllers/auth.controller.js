import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklist.model.js";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email and password." })
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Account already exists with this email id." })
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, email, password: hashPassword
    })

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.cookie("token", token);

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.log("Register Error: ", error);
    return res.status(400).json({ message: error.message || "Server Error" })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide your email and password." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "No account found with this email address." })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password. Please try again. " })
  }

  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  res.cookie("token", token);

  return res.status(200).json({
    message: "User logged in successfully.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    }
  })
}

export const logout = async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    await BlacklistToken.create({ token });
  }

  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully." })
}

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.status(200).json({
    message: "User detail fetch successfully.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    }
  })
}