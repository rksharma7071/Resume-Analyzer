import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

console.log("API Key exists:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// const interaction = await ai.interactions.create({
//   model: "gemini-3.6-flash",
//   input: "Explain how AI works in a few words",
// });
// console.log(interaction.output_text);



const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100).describe("..."),
  technicalQuestions: z.array(z.object({
    question: z.string().describe("..."),
    intention: z.string().describe("..."),
    answer: z.string().describe("...")
  })).describe("..."),
  behavioralQuestions: z.array(z.object({
    question: z.string().describe("..."),
    intention: z.string().describe("..."),
    answer: z.string().describe("...")
  })).describe("..."),
  skillGaps: z.array(z.object({
    skill: z.string().describe("..."),
    severity: z.enum(["low", "medium", "high"]).describe("...")
  })).describe("..."),
  preparationPlan: z.array(z.object({
    day: z.string().describe("Day label, e.g. 'Day 1'"),
    focus: z.string().describe("..."),
    tasks: z.array(z.string()).describe("...")
  })).describe("...")
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateInterviewReport = async ({
  resume,
  selfDescription,
  jobDescription
}) => {
  const prompt = `
Generate an interview report for a candidate.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const models = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash"
  ];

  for (const model of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(
          `Trying ${model} - attempt ${attempt}`
        );

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(
              interviewReportSchema
            )
          }
        });

        return JSON.parse(response.text);

      } catch (error) {
        const status = error?.status || error?.code;

        console.log(
          `${model} failed on attempt ${attempt}:`,
          error.message
        );

        // Retry only temporary server errors
        if (status === 503 || error.message?.includes("503")) {
          const delay = 1000 * Math.pow(2, attempt - 1);

          console.log(`Retrying in ${delay}ms...`);

          await sleep(delay);
          continue;
        }

        // Don't retry authentication,
        // invalid request, etc.
        throw error;
      }
    }

    console.log(`Switching from ${model} to next model...`);
  }

  throw new Error(
    "All Gemini models are currently unavailable. Please try again later."
  );
};