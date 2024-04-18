import { PUBLIC_OPENAI_API_KEY } from '$env/static/public';
import OpenAI from 'openai';

export function openAiBrowserClient(url: string): OpenAI {
	return new OpenAI({
		// baseURL: `${url}/llm/v1`, // use our proxy
		// apiKey: 'dummy!', // overwritten by the proxy
		apiKey: PUBLIC_OPENAI_API_KEY,
		dangerouslyAllowBrowser: true
	});
}
