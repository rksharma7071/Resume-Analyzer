import express from "express"
import { authUser } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.middleware.js";
import { generateInterviewController } from "../controllers/interview.controller.js";


const interviewRouter = express.Router();

interviewRouter.post('/', authUser, upload.single("resume"), generateInterviewController);

export default interviewRouter;