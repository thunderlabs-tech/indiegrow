import { multiSearch } from '$lib/multiSearch.js';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const { projectId, terms, sites } = await request.json();

	const supabase = locals.supabase;

	const results = await multiSearch(supabase, projectId, terms, sites, false);

	return json(results);
}
