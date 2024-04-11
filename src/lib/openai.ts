import OpenAI from "openai";
import dotenv from "dotenv";

// load the environment variables from .env file
dotenv.config();

export const analysisPrompt = `
Act as a product marketing expert.
You will begiven the contents of an App Store page for an app and an image with the screenshots.
Analyze the app-store presense and answer the following questions:
- What is the app about?
- What are the key features?
- What are the benefits?
- Who is the target group?
`;


export type AnalysisResult = {
  analysis: string;
}

export async function analyzetWithLLM(
  prompt: string,
  content: string,
  screenshotUrl: string
): Promise<AnalysisResult | null> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("Analyzing with LLM...");

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: prompt,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Appstore description: ${content}`,
          },
          {
            type: "image_url",
            image_url: {
              url: screenshotUrl,
            },
          },
        ],
      },
    ],
  });
  const result = response.choices[0];
  const analysis= result.message.content;
  console.log("Analysis with LLM completed: ", analysis)

  if (!analysis) {
    console.error("Failed to analyze with LLM");
    return null;
  }

  return {analysis};
}
