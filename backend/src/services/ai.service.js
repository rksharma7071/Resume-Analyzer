import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import { httpError } from "../utils/httpError.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

const questionSchema = z.object({
  question: z.string(),
  intention: z.string().describe("Why the interviewer asks this question."),
  answer: z.string().describe("A strong sample answer for this candidate."),
});

const reportSchema = z.object({
  title: z.string().describe("The job title the report is for."),
  matchScore: z.number().min(0).max(100).describe("How well the candidate matches the job, from 0 to 100."),
  technicalQuestions: z.array(questionSchema),
  behavioralQuestions: z.array(questionSchema),
  skillGaps: z.array(z.object({ skill: z.string(), severity: z.enum(["low", "medium", "high"]) })),
  preparationPlan: z.array(
    z.object({
      day: z.number().int().min(1).describe("Day number, starting at 1."),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});

export const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
  const prompt = `Generate an interview preparation report for this candidate.

Resume:
${resume}

Self description:
${selfDescription || "Not provided"}

Job description:
${jobDescription}

Include a match score (0-100), technical and behavioral interview questions with the
interviewer's intention and a sample answer, skill gaps with severity, and a day-by-day
preparation plan.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(reportSchema),
    },
  });

  let data;
  try {
    data = JSON.parse(response.text);
  } catch {
    throw httpError(502, "The AI returned an invalid response. Please try again.");
  }

  const result = reportSchema.safeParse(data);
  if (!result.success) {
    console.error("AI response failed validation:", result.error.issues);
    throw httpError(502, "The AI returned an incomplete report. Please try again.");
  }

  return result.data;
};