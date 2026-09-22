import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklist.model.js";

export const authUser = async (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token not provided." });
  }

  const isTokenBlackListed = await BlacklistToken.findOne({ token });

  if (isTokenBlackListed) {
    return res.status(401).json({ message: "Session has expired or been revoked. Please log in again." })
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};