import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import BlacklistToken from "../models/blacklist.model.js";

const unauthorized = (res, message) => res.status(401).json({ success: false, message });

export const authUser = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return unauthorized(res, "Authentication token is required.");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return unauthorized(res, "Invalid or expired authentication token.");
  }

  if (await BlacklistToken.exists({ token })) {
    return unauthorized(res, "Token has been revoked. Please log in again.");
  }

  const user = await User.findById(decoded._id);
  if (!user) return unauthorized(res, "User account no longer exists.");

  req.user = user;
  next();
};