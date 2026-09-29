import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.middleware.js";
import {
  deleteInterviewReport,
  generateInterview,
  getAllInterviewQuery,
  getInterviewReportById,
  updateInterviewReport,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.use(authUser);

interviewRouter.post("/", upload.single("resume"), generateInterview);
interviewRouter.get("/", getAllInterviewQuery);
interviewRouter.get("/:interviewId", getInterviewReportById);
interviewRouter.patch("/:interviewId", updateInterviewReport);
interviewRouter.delete("/:interviewId", deleteInterviewReport);

export default interviewRouter;