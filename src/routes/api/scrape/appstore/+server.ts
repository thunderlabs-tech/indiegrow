import { scrapeAppstore } from '$lib/scraping/appstore';

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { url } = await request.json();

	const result = await scrapeAppstore(url);

	return json(result);
}
