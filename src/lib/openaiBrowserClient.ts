import { PUBLIC_LLM_PROXY_URL, PUBLIC_OPENAI_API_KEY } from '$env/static/public';
import OpenAI from 'openai';

export function openAiBrowserClient(): OpenAI {
	const baseURL = PUBLIC_LLM_PROXY_URL;
	return new OpenAI({
		// baseURL, // use our proxy
		// apiKey: 'dummy!', // overwritten by the proxy
		apiKey: PUBLIC_OPENAI_API_KEY,
		dangerouslyAllowBrowser: true
	});
}
