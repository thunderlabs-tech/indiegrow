import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import type { SupabaseClient } from '@supabase/supabase-js';

type SearchResult = {
	url: string;
	title: string;
	content: string;
	score: number;
};

async function existingPosts(
	db: SupabaseClient,
	projectId: string,
	urls: string[]
): Promise<string[]> {
	const { data, error } = await db
		.from('community_posts')
		.select('url')
		.in('url', urls)
		.eq('project_id', projectId);
	if (error) {
		console.error('Error getting existing posts', error);
		throw new Error('Error getting existing posts');
	}

	const existingUrls = data.map((post) => post.url);
	return existingUrls;
}

export async function multiSearch(
	db: SupabaseClient,
	projectId: string,
	queries: string[],
	sitesToSearch: string[],
	testmode: boolean = false
): Promise<SearchResult[]> {
	console.log('multiSearchTool - queries:', queries, 'sites:', sitesToSearch);
	let searchQueries = queries
		.map((query) => {
			return sitesToSearch.map((site) => `site:${site} ${query}`);
		})
		.flat();

	if (testmode) {
		searchQueries = searchQueries.slice(0, 1);
	}

	const results = await Promise.all(
		searchQueries.map(async (query) => {
			console.log('multiSearchTool - searching for', query);
			const search = new TavilySearchResults({
				maxResults: testmode ? 1 : 10
			});

			return await search.invoke(query);
		})
	);

	const flattenedResults = results
		.map((result) => {
			return JSON.parse(result);
		})
		.flat() as SearchResult[];
	console.log('multiSearchTool - all results', flattenedResults.length);

	const sortedResults = flattenedResults.sort((a, b) => b.score - a.score);

	const existing = await existingPosts(
		db,
		projectId,
		sortedResults.map((result) => result.url)
	);

	let newResults = sortedResults.filter((result) => {
		return !existing.includes(result.url);
	});

	console.log('multiSearchTool - new results', newResults.length);

	return newResults;
}
