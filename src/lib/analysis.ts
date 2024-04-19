import OpenAI from 'openai';
import type {
	ChatCompletionSystemMessageParam,
	ChatCompletionUserMessageParam
} from 'openai/resources/index.mjs';

import type { AppStoreInfo } from './scrapeAppstore';
import type { Stream } from 'openai/streaming.mjs';

export type AnalysisResult = {
	analysis: string;
	error: string | undefined;
	time: number;
};

export const analysisPrompt = `Act as a product marketing expert knowledgable in App Store Optimization (ASO).
You will begiven the App Store info for an app as a JSON object delimeted by """ and screenshot images.

Your goal is to bring this app to the top of the AppStore. Use any means necessary.

1. Analyse the app-store presence and answer the following questions:
- What is the app about?
- What are the key features?
- What are the benefits?
- Who is the target group?

2. Define the Key ASO areas that can be improved; For example:
- Title / Name
- App Icon
- Reviews (number, sentiment)
- Screenshots
- Keywords
- Description

3. After that, provide suggestions or experiments to improve each of the key components of ASO independently. Make sure to make them actionable, ideally in bullet points and with estimation of how much it could improve the visibility and thus the traffic increase - even if it’s a wide range.

4. If you are unsure about a specific areas or topics explain why and what could be the steps to get the missing information

Return the result in the form of text with simple html markup. Make sure it's formatted in an easily readable form.
Don't use any other encoding for the result.
`;

export const refinementPrompt = `Act as a product marketing expert knowledgable in App Store Optimization (ASO).
You will begiven the App Store info for an app as a JSON object delimeted by """ and screenshot images.

Your goal is to refine the app-store content of the app to improve its visibility and thus the traffic increase.

1. Look at the app-store info and provide refined versions of the following parts:
- name
- category
- description
For the category only consider existing categories in the Apple App Store.
Don't use any markup in the refined versions - only text.

2. Provide explanations for each of the changes you made and how they could improve the visibility and thus the traffic increase.
Be as concise and concrete as possible.

3. Respond with a JSON object with your refinements and the explanations using the following schema:
{
	name: {
		refined: "Refined Name",
		explanation: "Explanation for the change"
	},
	category: {
		refined: "Refined Category",
		explanation: "Explanation for the change"
	}
	description: {
		refined: "Refined Description",
		explanation: "Explanation for the change"
	},
}

`;
export const refinedResponse = {
	name: {
		refined: 'Neighborhood Connect: Secure Local Chat',
		explanation:
			"The refined name 'Neighborhood Connect: Secure Local Chat' directly conveys the app's primary function of fostering communication among local neighbors, emphasizing both the social connection and security aspect. This change should attract users specifically searching for community-based communication tools."
	},
	description: {
		refined:
			'Neighborhood Connect is your private communication hub for local community interaction. Connect securely with neighbors in your apartment complex or building through private messages or group chats. Use it to exchange help, borrow items, share surplus food, and more, all without sharing personal contact details.\n\nFeatures include:\n- Private and group messaging without sharing personal numbers\n- Public channels for community discussions\n- Automatic message translation in German and English\n- Personal profiles visible to neighbors only\n- Comprehensive building directory for easy contact\n\nTo join, simply install and enter an invite code from an existing neighbor or start a new community with our assistance.\n\nOur mission: Strengthen urban community ties, reduce waste, and combat isolation. Learn more about how Neighborhood Connect can improve your local living experience at https://connectedliving.chat/mission',
		explanation:
			'The revised description is more concise and uses bullet points for clearer readability, emphasizing key features and benefits quickly. This avoids overwhelming the user with information and makes important features more noticeable, which might encourage downloads.'
	},
	category: {
		refined: 'Lifestyle',
		explanation:
			"Changing the category from 'Social Networking' to 'Lifestyle' can expand the app's reach. The 'Lifestyle' category can attract users interested in community living enhancements and local sustainability initiatives. This category might engage a different audience potentially interested in the app's community and sustainability goals."
	}
};

function appStoreInfoAsString(info: AppStoreInfo): string {
	return JSON.stringify({
		name: info.name,
		description: info.description,
		applicationCategory: info.applicationCategory,
		datePublished: info.datePublished,
		operatingSystem: info.operatingSystem
	});
}
export async function analyzetWithLLMStreaming(
	openai: OpenAI,
	prompt: string,
	info: AppStoreInfo
): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
	const t0 = Date.now();

	console.log(`Analyzing with LLM-Prompt: ${prompt} `);

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

export async function analyzetWithLLM(
	openai: OpenAI,
	prompt: string,
	info: AppStoreInfo
): Promise<AnalysisResult | null> {
	const t0 = Date.now();

	try {
		console.log(`Analyzing with LLM-Prompt: ${prompt} `);

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

		const response = await openai.chat.completions.create({
			model: 'gpt-4-turbo',
			response_format: {
				type: 'json_object'
			},
			max_tokens: 1024,
			messages
		});

		const result = response.choices[0];
		const analysis = result.message.content;

		const time = (Date.now() - t0) / 1000;
		if (!analysis) {
			const error = 'Failed to analyze with LLM - no analysis returned';
			console.error(error);
			return { error };
		}
		return { analysis, time, error: undefined };
	} catch (error) {
		console.error('Failed to analyze with LLM', error);
		console.error(error);
		return { error };
	} finally {
		const time = (Date.now() - t0) / 1000;
		console.log('LLM time: ', time, 's');
	}
}

export async function analyzetWithAssistant(
	openai: OpenAI,
	assistantId: string,
	info: AppStoreInfo
): Promise<AnalysisResult | null> {
	console.log(`Analyzing with LLM-Assistant: ${assistantId}...`);
	const t0 = Date.now();

	const thread = await openai.beta.threads.create();

	const message = await openai.beta.threads.messages.create(thread.id, {
		role: 'user',
		content: `Appstore info: """${appStoreInfoAsString(info)}"""`
	});

	let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
		assistant_id: assistantId
	});

	let analysis = '';
	if (run.status === 'completed') {
		const messages = await openai.beta.threads.messages.list(run.thread_id);

		const responseMessage = messages.data[0];
		analysis = responseMessage.content[0].text.value;
	} else {
		console.log(run.status);
	}

	const time = (Date.now() - t0) / 1000;
	console.log('LLM time: ', time, 's');

	return { analysis, time, error: undefined };
}
