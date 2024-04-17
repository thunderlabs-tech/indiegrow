import type { AnalysisRequest, AnalysisResult } from '$lib/analysis.js';
import { analyzetWithAssistant, analyzetWithLLM } from '$lib/openai.js';

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { prompt, assistantId, appStoreInfo } = (await request.json()) as AnalysisRequest;

	let result: AnalysisResult | null = null;
	if (prompt) {
		result = await analyzetWithLLM(prompt, appStoreInfo);
	} else if (assistantId) {
		result = await analyzetWithAssistant(assistantId, appStoreInfo);
	} else {
		throw new Error('No prompt or assistantId provided');
	}

	return json(result);
}
