import OpenAI from "openai";
import dotenv from "dotenv";
import { readFileSync } from "fs";

// load the environment variables from .env file
dotenv.config();

export const prompt = `
Act as a product marketing expert.
You will begiven the contents of an App Store page for an app and an image with the screenshots.
Analyze the app-store presense and answer the following questions:
- What is the app about?
- What are the key features?
- What are the benefits?
- Who is the target group?
`;

export async function analyzetWithLLM(
  prompt: string,
  content: string,
  screenshotPath: string
): Promise<string | null> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // encode the image at screenshotPath as base64
  const imgData = readFileSync(screenshotPath).toString("base64");

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
              url: `data:image/jpeg;base64,${imgData}`,
            },
          },
        ],
      },
    ],
  });
  const result = response.choices[0];
  return result.message.content;
}
