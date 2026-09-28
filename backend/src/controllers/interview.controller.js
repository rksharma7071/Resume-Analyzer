import mongoose from "mongoose";
import { PDFParse } from "pdf-parse";
import InterviewReport from "../models/interviewReport.model.js";
import { generateInterviewReport } from "../services/ai.service.js";

export const generateInterview = async (req, res) => {
  try {
    const { selfDescription = "", jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required.",
      });
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Job description must be at least 20 characters.",
      });
    }

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to generate an interview report.",
      });
    }

    // Extract resume text from PDF
    const parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    const resume = result.text?.trim();

    if (!resume || resume.length < 50) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract sufficient text from the resume PDF.",
      });
    }

    // Generate report using AI
    const report = await generateInterviewReport({
      resume,
      selfDescription,
      jobDescription,
    });

    if (!report || typeof report !== "object") {
      return res.status(502).json({
        success: false,
        message: "Failed to generate a valid interview report.",
      });
    }

    // Save report
    const interviewReport = await InterviewReport.create({
      ...report,
      resume,
      selfDescription,
      jobDescription: jobDescription.trim(),
      user: req.user._id,
      title: report.title || "Interview Preparation Report",
    });

    return res.status(201).json({
      success: true,
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Generate interview error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate interview report.",
    });
  }
};

export const getInterviewReportById = async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview report ID.",
      });
    }

    const interviewReport = await InterviewReport.findOne({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview report fetched successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Get interview report error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview report.",
    });
  }
};

export const getAllInterviewQuery = async (req, res) => {
  try {
    const interviewReports = await InterviewReport.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .select(
        "-jobDescription -resume -selfDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
      )
      .lean();

    return res.status(200).json({
      success: true,
      message: "Interview reports fetched successfully.",
      total: interviewReports.length,
      interviewReports,
    });
  } catch (error) {
    console.error("Get all interview reports error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview reports.",
    });
  }
};

export const updateInterviewReport = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview report ID.",
      });
    }

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid report title is required.",
      });
    }

    const interviewReport = await InterviewReport.findOneAndUpdate(
      {
        _id: interviewId,
        user: req.user._id,
      },
      {
        $set: { title: title.trim() },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview report updated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Update interview report error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update interview report.",
    });
  }
};

export const deleteInterviewReport = async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview report ID.",
      });
    }

    const interviewReport = await InterviewReport.findOneAndDelete({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview report deleted successfully.",
    });
  } catch (error) {
    console.error("Delete interview report error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete interview report.",
    });
  }
};