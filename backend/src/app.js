import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import interviewRouter from "./routes/interviewReport.route.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/interviewReport", interviewRouter);

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }));
app.use(errorHandler);

export default app;