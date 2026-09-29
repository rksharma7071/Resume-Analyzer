import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  { question: String, intention: String, answer: String },
  { _id: false }
);

const interviewReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    jobDescription: { type: String, required: true },
    resume: String,
    selfDescription: String,
    matchScore: { type: Number, min: 0, max: 100 },
    technicalQuestions: [questionSchema],
    behavioralQuestions: [questionSchema],
    skillGaps: [
      {
        _id: false,
        skill: String,
        severity: { type: String, enum: ["low", "medium", "high"] },
      },
    ],
    preparationPlan: [
      {
        _id: false,
        day: Number,
        focus: String,
        tasks: [String],
      },
    ],
  },
  { timestamps: true }
);

const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);

export default InterviewReport;