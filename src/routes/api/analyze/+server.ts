import { analyzetWithLLM } from '$lib/openai.js';
import type { AppStoreInfo } from '$lib/scrapeAppstore';

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const {prompt, appStoreInfo  } = await request.json() as { prompt: string, appStoreInfo: AppStoreInfo };

	const result = await analyzetWithLLM(prompt, appStoreInfo);

	return json(result);
}
