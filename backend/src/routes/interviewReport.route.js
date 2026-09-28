import express from "express"
import { authUser } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.middleware.js";
import { generateInterview, getAllInterviewQuery, getInterviewReportById } from "../controllers/interview.controller.js";


const interviewRouter = express.Router();

interviewRouter.post('/', authUser, upload.single("resume"), generateInterview);
interviewRouter.get('/:interviewId', authUser, getInterviewReportById);
interviewRouter.get('/', authUser, getAllInterviewQuery);

export default interviewRouter;