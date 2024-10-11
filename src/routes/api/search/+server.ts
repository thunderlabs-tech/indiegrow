import { saveCommunityPostsSearchResults } from '$lib/dbclient';
import { multiSearch } from '$lib/multiSearch.js';
import { updatePostRelevance } from '$lib/postRelevance';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const {
		projectId,
		projectInfo,
		terms,
		sites,
		resultsPerQuery,
		relevantCriteria,
		irrelevantCriteria
	} = await request.json();

	const supabase = locals.supabase;

	const results = await multiSearch(supabase, projectId, terms, sites, resultsPerQuery);

	const posts = await saveCommunityPostsSearchResults(supabase, projectId, results);
	for (const post of posts) {
		await updatePostRelevance(supabase, post, projectInfo, relevantCriteria, irrelevantCriteria);
	}

	return json(posts);
}
