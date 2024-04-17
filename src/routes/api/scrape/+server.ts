import {scrapeAppstore } from '$lib/scrapeAppstore.js';

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { url } = await request.json();

	const result = await scrapeAppstore(url);

	return json(result);
}
