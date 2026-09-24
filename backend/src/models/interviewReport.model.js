import mongoose from "mongoose";

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true }
  },
  { _id: false }
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true }
  },
  { _id: false }
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"] }
  },
  { _id: false }
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: { type: Date, required: true },
    focus: { type: String, required: true },
    tasks: [{ type: String, required: true }]
  },
  { _id: false }
);

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: { type: String, required: true },
    resume: { type: String },
    selfDescription: { type: String },
    matchScore: { type: Number, min: 0, max: 100 },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema]
  },
  { timestamps: true }
);

const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);

export default InterviewReport;