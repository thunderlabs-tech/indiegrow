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
	logoUrl: 'https://example.com/logo.png'
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
- logo url


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
	competitor: Competitor
): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
	console.log(`Analyzing competitor's website with: ${prompt} `);

	const websiteInfo = competitor.websiteInfo;

	const promptMessage: ChatCompletionSystemMessageParam = {
		role: 'system',
		content: prompt
	};

	const userMessage: ChatCompletionUserMessageParam = {
		role: 'user',
		content: [
			{
				type: 'text',
				text: `Website content: """${websiteInfo.html}"""`
			}
		]
	};

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
