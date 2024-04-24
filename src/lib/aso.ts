import type OpenAI from 'openai';
import type { Stream } from 'openai/streaming.mjs';
import type { AppStoreInfo } from './types';
import type {
	ChatCompletionSystemMessageParam,
	ChatCompletionUserMessageParam
} from 'openai/resources/index.mjs';
import { appStoreInfoAsString } from './analysis';

export const refinementPrompt = `Act as a product marketing expert knowledgable in App Store Optimization (ASO).
You will begiven the App Store info for an app as a JSON object delimeted by """ and screenshot images.

Your goal is to refine the app-store content of the app to improve its visibility and thus the traffic increase.

1. Look at the app-store info and provide refined versions of the following parts as suggestions:
- name
- category
- description
- screenshots

For the name: consider a name that is concise, descriptive, and includes relevant keywords.
Try to keep the current name and only add descriptive parts to it.

For the category only consider existing categories in the Apple App Store.

For screenshots analyze if the screenshots cover all important features and if the text is always readable.

2. Provide explanations for each of the changes you made and how they could improve the visibility and thus the traffic increase.
Be as concise and concrete as possible.

3. Respond with a JSON object with your refinements and the explanations using the following schema:
{
	name: {
		suggestion: "Refined Name",
		explanation: "Explanation for the change"
	},
	category: {
		suggestion: "Refined Category",
		explanation: "Explanation for the change"
	}
	description: {
		suggestion: "Refined Description",
		explanation: "Explanation for the change"
	},
	screenshots: {
		suggestion: "Refined Description",
		explanation: "Explanation for the change"
	},
}
Don't use any markdown markup in the response - only text.
Always be very concise.
`;

export async function refineWithLLMStreaming(
	openai: OpenAI,
	prompt: string,
	info: AppStoreInfo
): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
	console.log(`Refining with LLM-Prompt: ${prompt} `);

	const promptMessage: ChatCompletionSystemMessageParam = {
		role: 'system',
		content: prompt
	};

	const userMessage: ChatCompletionUserMessageParam = {
		role: 'user',
		content: [
			{
				type: 'text',
				text: `Appstore info: """${appStoreInfoAsString(info)}"""`
			}
		]
	};

	info.screenshot.forEach((screenshot) => {
		userMessage.content.push({
			type: 'image_url',
			image_url: {
				url: screenshot
			}
		});
	});

	const messages = [promptMessage, userMessage];
	console.log('sending messages: ', messages);

	const stream = await openai.chat.completions.create({
		model: 'gpt-4-turbo',
		response_format: {
			type: 'json_object'
		},
		max_tokens: 1024,
		stream: true,
		messages
	});
	return stream;
}
