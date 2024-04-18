import { PUBLIC_LLM_PROXY_PORT } from '$env/static/public';
import OpenAI from 'openai';

export function openAiBrowserClient(origin: string): OpenAI {
	const url = new URL(origin);
	const port = PUBLIC_LLM_PROXY_PORT;
	const baseURL = `${url.protocol}//${url.hostname}:${port}/llm/v1`;
	return new OpenAI({
		baseURL, // use our proxy
		apiKey: 'dummy!', // overwritten by the proxy
		dangerouslyAllowBrowser: true
	});
}
