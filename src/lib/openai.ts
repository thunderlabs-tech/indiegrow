import OpenAI from "openai";
import dotenv from "dotenv";
import type { AppStoreInfo } from "./scrapeAppstore";
import type { ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from "openai/resources/index.mjs";
import type { AnalysisResult } from "./analysis";

// load the environment variables from .env file
dotenv.config();


function appStoreInfoAsString(info: AppStoreInfo):string{
  return JSON.stringify({
    name: info.name,
    description: info.description,
    applicationCategory: info.applicationCategory,
    datePublished: info.datePublished,
    operatingSystem: info.operatingSystem,
  })
}

export async function analyzetWithLLM(
  prompt: string,
  info: AppStoreInfo,
): Promise<Partial<AnalysisResult> | null> {
  const t0 = Date.now();

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log(`Analyzing with LLM-Prompt: ${prompt} `);


    const promptMessage : ChatCompletionSystemMessageParam = {
      role: "system",
      content: prompt,
    };

    const userMessage : ChatCompletionUserMessageParam = {
          role: "user",
          content: [
            {
              type: "text",
              text: `Appstore info: """${appStoreInfoAsString(info)}"""`,
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

    const messages = [
        promptMessage,
        userMessage,
    ];
    console.log("sending messages: ", messages);

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",

      max_tokens: 1024,
      messages,
    });
    const result = response.choices[0];
    const analysis= result.message.content;

    const time = (Date.now() - t0)/1000
    if (!analysis) {
      const error = "Failed to analyze with LLM - no analysis returned"
      console.error(error);
      return {error};
    }
    return {analysis, time, error: undefined};

  } catch (error) {
      console.error("Failed to analyze with LLM", error);
      console.error(error);
      return {error};
  } finally {
    const time = (Date.now() - t0)/1000
    console.log("LLM time: ", time, "s");
  }
}


export async function analyzetWithAssistant(
  assistantId: string,
  info: AppStoreInfo,
): Promise<AnalysisResult | null>
{
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log(`Analyzing with LLM-Assistant: ${assistantId}...`);
  const t0 = Date.now();

  const thread = await openai.beta.threads.create();

const message = await openai.beta.threads.messages.create(
  thread.id,
  {
    role: "user",
    content: `Appstore info: """${appStoreInfoAsString(info)}"""`,
  }
);

let run = await openai.beta.threads.runs.createAndPoll(
  thread.id,
  {
    assistant_id: assistantId,
  }
);

let analysis ="";
if (run.status === 'completed') {
  const messages = await openai.beta.threads.messages.list(
    run.thread_id
  );

  const responseMessage = messages.data[0];
  analysis = responseMessage.content[0].text.value;
} else {
  console.log(run.status);
}

  const time = (Date.now() - t0)/1000
  console.log("LLM time: ", time, "s");

  return {analysis, time, error: undefined};
}
