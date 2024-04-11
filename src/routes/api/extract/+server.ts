import {extractAppStoreContent} from '$lib/appstore';

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { url } = await request.json();

	const result = await extractAppStoreContent(url);

	return json(result);
}
