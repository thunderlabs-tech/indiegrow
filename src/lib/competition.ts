import type OpenAI from 'openai';
import type { Competitor, ProductMarketingAnalysis, WebsiteInfo } from './types';
import type { Stream } from 'openai/streaming.mjs';
import type {
	ChatCompletionSystemMessageParam,
	ChatCompletionUserMessageParam
} from 'openai/resources/index.mjs';

export const exampleProductMarketingAnalysis: ProductMarketingAnalysis = {
	brandName: 'Apple',
	oneLinePitch: 'Computers for everyone',
	productType: 'Hardware, Software',
	targetAudience: 'Everyone',
	keyFeatures: ['Portable computing', 'integrated operating system'],
	keyBenefits: ['Safe', 'easy to use', 'high quality'],
	positioning: "Apple's products are known for their high quality and ease of use."
};

export const websiteAnalysisPrompt = `Act as a product marketing manager doing competitive analysis.
You will be provided with the content of a website of a competitor and you will need to analyze it.

Focus on the following aspects during your analysis:
- brand name
- one line pitch
- product type
- target audience
- key features
- key benefits
- positioning


For the brand name only use the name of the brand, don't include any tld or other information.

Be as brief as possible in the analysis. Use substantive rather than verbs.

For key features and key benefits look at the top 3 only and return arrays of strings.

Encode each of the analysis aspects into the response as a field in a JSON object.
Return only the JSON object as the result.

Here is an example of the JSON object structure:
${JSON.stringify(exampleProductMarketingAnalysis)} `;

export async function analyzeCompetitorWebsite(
	openai: OpenAI,
	prompt: string,
	websiteInfo: WebsiteInfo
): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
	console.log(`Analyzing competitor's website with: ${prompt} `);

	let text: string | undefined = undefined;
	if (websiteInfo?.text && websiteInfo.text.length > 0) {
		text = websiteInfo.text;
	} else {
		text = websiteInfo?.ogObject?.ogDescription;
	}

	if (!text) {
		throw new Error('No text found on the website');
	}

	const promptMessage: ChatCompletionSystemMessageParam = {
		role: 'system',
		content: prompt
	};

	const userMessage: ChatCompletionUserMessageParam = {
		role: 'user',
		content: [
			{
				type: 'text',
				text: `Website content: """${text}"""`
			}
		]
	};

	const messages = [promptMessage, userMessage];

	const stream = await openai.chat.completions.create({
		model: 'gpt-4-turbo',
		// model: 'gpt-3.5-turbo-16k',
		response_format: {
			type: 'json_object'
		},
		max_tokens: 1024,
		stream: true,
		messages
	});
	return stream;
}
