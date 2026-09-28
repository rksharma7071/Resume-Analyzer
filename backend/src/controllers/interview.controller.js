import { PDFParse } from "pdf-parse";
import { generateInterviewReport } from "../services/ai.service.js";
import InterviewReport from "../models/interviewReport.model.js";

export const generateInterviewController = async (req, res) => {
  try {
    const { selfDescription = "", jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required" });
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ message: "Job description must be at least 20 characters" });
    }

    const parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    const resume = result.text;

    if (!resume || resume.trim().length < 50) {
      return res.status(400).json({ message: "Unable to extract text from resume PDF" });
    }

    const report = await generateInterviewReport({ resume, selfDescription, jobDescription });

    const interviewReport = await InterviewReport.create({
      user: req.user._id,
      resume,
      selfDescription,
      jobDescription,
      ...report,
    });

    return res.status(201).json({ success: true, message: "Interview report generated successfully", interviewReport });
  } catch (error) {
    console.error("Interview report error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to generate interview report" });
  }
};