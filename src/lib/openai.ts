import OpenAI from "openai";
import dotenv from "dotenv";
import type { AppStoreInfo } from "./scrapeAppstore";
import type { ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from "openai/resources/index.mjs";
import type { AnalysisResult } from "./analysis";

// load the environment variables from .env file
dotenv.config();


export async function analyzetWithLLM(
  prompt: string,
  info: AppStoreInfo,
): Promise<AnalysisResult | null> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("Analyzing with LLM...");
  const t0 = Date.now();


  const promptMessage : ChatCompletionSystemMessageParam = {
    role: "system",
    content: prompt,
  };

  const userMessage : ChatCompletionUserMessageParam = {
        role: "user",
        content: [
          {
            type: "text",
            text: `Appstore description: ${info.description}`,
          },
        ],
   }

   info.screenshot.forEach((screenshot) => {
      userMessage.content.push({
        type: "image_url",
        image_url: {
          url: screenshot,
        },
      });
   });


  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      promptMessage,
      userMessage,
    ],
  });
  const result = response.choices[0];
  const analysis= result.message.content;
  console.log("Analysis with LLM completed: ", analysis)

  if (!analysis) {
    console.error("Failed to analyze with LLM");
    console.log("LLM time: ", (Date.now() - t0)/1000, "s");
    return null;
  }

  console.log("LLM time: ", (Date.now() - t0)/1000, "s");
  return {analysis};
}
