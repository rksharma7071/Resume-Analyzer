import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Match score between the candidate and the job description."),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.string(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});

export const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
  if (!resume || !jobDescription) {
    throw new Error("Resume and job description are required");
  }

  const prompt = `
  Generate an interview preparation report for the candidate.

  Resume:
  ${resume}

  Self Description:
  ${selfDescription || "Not provided"}

  Job Description:
  ${jobDescription}

  Generate:
  1. Match score from 0 to 100.
  2. Technical interview questions.
  3. Behavioral interview questions.
  4. Skill gaps with severity.
  5. A preparation plan.
  `;

  let response;
  try {
    response = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: z.toJSONSchema(interviewReportSchema),
      },
    });
  } catch (error) {
    console.error("Gemini API error:", error?.status, error?.message);
    throw error;
  }

  const text = response.output_text;
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  let report;
  try {
    report = JSON.parse(text);
  } catch (err) {
    console.error("Gemini returned invalid JSON:", text.slice(0, 500));
    throw new Error("AI returned malformed JSON");
  }

  const result = interviewReportSchema.safeParse(report);
  if (!result.success) {
    console.error("Schema validation failed:", result.error.format());
    throw new Error("AI response did not match the expected schema");
  }

  return result.data;
};