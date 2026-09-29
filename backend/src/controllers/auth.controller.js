import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklist.model.js";
import { User } from "../models/user.model.js";
import {
  cookieOptions,
  clearCookieOptions,
} from "../config/cookieOptions.js";

const sendResponse = (res, status, message, data = {}) => {
  return res.status(status).json({
    success: true,
    message,
    ...data,
  });
};

const sendError = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

const getPublicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
});

const generateToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

const sendAuthResponse = (res, status, message, user) => {
  res.cookie("token", generateToken(user._id), cookieOptions);

  return sendResponse(res, status, message, {
    user: getPublicUser(user),
  });
};

export const register = async (req, res) => {
  const name = req.body?.name?.trim();
  const email = req.body?.email?.trim().toLowerCase();
  const password = req.body?.password;

  if (!name || !email || !password) {
    return sendError(res, 400, "Name, email and password are required.");
  }

  if (name.length > 100) {
    return sendError(res, 400, "Name must not exceed 100 characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return sendError(res, 400, "Please provide a valid email address.");
  }

  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    return sendError(res, 400, "Password must contain between 8 and 128 characters.");
  }

  if (await User.exists({ email })) {
    return sendError(res, 409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return sendAuthResponse(res, 201, "User registered successfully.", user);
};

export const login = async (req, res) => {
  const email = req.body?.email?.trim().toLowerCase();
  const password = req.body?.password;

  if (!email || typeof password !== "string" || !password) {
    return sendError(res, 400, "Please provide a valid email and password.");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return sendError(res, 401, "Invalid email or password.");
  }

  return sendAuthResponse(res, 200, "User logged in successfully.", user);
};

export const logout = async (req, res) => {
  const token = req.cookies?.token;

  res.clearCookie("token", clearCookieOptions);

  if (token) {
    const decoded = jwt.decode(token);

    if (decoded?.exp) {
      await BlacklistToken.updateOne(
        { token },
        { $setOnInsert: { expiresAt: new Date(decoded.exp * 1000) } },
        { upsert: true }
      );
    }
  }

  return sendResponse(res, 200, "Logged out successfully.");
};

export const getMe = (req, res) => {
  return sendResponse(res, 200, "User details fetched successfully.", {
    user: getPublicUser(req.user),
  });
};