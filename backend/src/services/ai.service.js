import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100).describe("Match score between the candidate and the job description."),
  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("Technical question that can be asked in the interview."),
      intention: z.string().describe("What the interviewer wants to evaluate."),
      answer: z.string().describe("How the candidate should answer and what points they should cover.")
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("Behavioral question that can be asked in the interview."),
      intention: z.string().describe("What the interviewer wants to evaluate."),
      answer: z.string().describe("How the candidate should answer and what points they should cover.")
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string().describe("Skill that the candidate is lacking."),
      severity: z.enum(["low", "medium", "high"]).describe("Severity of the skill gap.")
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.string().describe("Date for the preparation task, e.g. 2026-09-25."),
      focus: z.string().describe("Main focus for this day."),
      tasks: z.array(z.string()).describe("Tasks the candidate should complete.")
    })
  )
});

export const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
  const prompt = `
Generate an interview preparation report for the candidate.
Analyze the candidate's resume, self-description, and the job description.

Resume:${resume}

Self Description:${selfDescription}

Job Description:${jobDescription}

Generate:
1. Match score from 0 to 100.
2. Technical interview questions.
3. Behavioral interview questions.
4. Skill gaps with severity.
5. A preparation plan.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(interviewReportSchema)
    }
  });

  const report = JSON.parse(response.text);

  return report;
};