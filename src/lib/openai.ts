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


  const textInfo = {
    name: info.name,
    description: info.description,
    applicationCategory: info.applicationCategory,
    datePublished: info.datePublished,
    operatingSystem: info.operatingSystem,
  }
  const userMessage : ChatCompletionUserMessageParam = {
        role: "user",
        content: [
          {
            type: "text",
            text: `Appstore info: """${JSON.stringify(textInfo)}"""`,
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

  const time = (Date.now() - t0)/1000
  console.log("LLM time: ", time, "s");
  if (!analysis) {
    console.error("Failed to analyze with LLM");
    return null;
  }

  return {analysis, time};
}
