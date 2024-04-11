import {extractAppStoreContent} from '$lib/appstore';
import { analyzetWithLLM } from '$lib/openai.js';

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const {prompt, content, screenshotUrl } = await request.json();

	const result = await analyzetWithLLM(prompt, content, screenshotUrl);

	return json(result);
}
