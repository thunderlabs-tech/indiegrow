import OpenAI from 'openai';

export function openAiBrowserClient(url: string): OpenAI {
	return new OpenAI({
		baseURL: `${url}/llm/v1`, // use our proxy
		apiKey: 'dummy!', // overwritten by the proxy
		dangerouslyAllowBrowser: true
	});
}
