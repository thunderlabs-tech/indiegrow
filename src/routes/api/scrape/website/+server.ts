import { scrapeWebsite } from '$lib/scraping.js';

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { url } = await request.json();

	const result = await scrapeWebsite(url);

	return json(result);
}
