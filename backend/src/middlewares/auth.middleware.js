
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import BlacklistToken from "../models/blacklist.model.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication token is required." });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not configured.");
      return res.status(500).json({ success: false, message: "Internal server error." });
    }

    const decoded = jwt.verify(token, secret);

    const blacklistedToken = await BlacklistToken.exists({ token });

    if (blacklistedToken) {
      return res.status(401).json({ success: false, message: "Token has been revoked. Please log in again." });
    }

    const userId = decoded._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid authentication token." });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User account no longer exists." });
    }

    req.user = user;

    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError") {
      return res.status(401).json({ success: false, message: "Invalid or expired authentication token." });
    }

    console.error("Authentication middleware error:", error.message);

    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};