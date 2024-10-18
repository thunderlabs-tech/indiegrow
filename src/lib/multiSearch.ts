import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import type { SupabaseClient } from '@supabase/supabase-js';

export type SearchResult = {
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

export async function search(query: string, maxResults: number): Promise<SearchResult[]> {
	console.log('multiSearchTool - searching for', query);
	try {
		const search = new TavilySearchResults({ maxResults });
		const resultsJson = await search.invoke(query);
		return JSON.parse(resultsJson);
	} catch (error) {
		console.error('Error searching for', query, error.message);
		return [];
	}
}

export async function multiSearch(
	db: SupabaseClient,
	projectId: string,
	queries: string[],
	sitesToSearch: string[],
	resultsPerQuery: number = 10
): Promise<SearchResult[]> {
	let queriesBySite = queries
		.map((query) => {
			return sitesToSearch.map((site) => `site:${site} ${query}`);
		})
		.flat();

	const results = await Promise.all(
		queriesBySite.map(async (query) => {
			return await search(query, resultsPerQuery);
		})
	);

	const flattenedResults = results.flat() as SearchResult[];
	console.log('multiSearchTool - all results', flattenedResults.length);

	const uniqueResults = flattenedResults.filter(
		(result, index, self) => index === self.findIndex((t) => t.url === result.url)
	);

	const sortedResults = uniqueResults.sort((a, b) => b.score - a.score);

	const existing = await existingPosts(
		db,
		projectId,
		sortedResults.map((result) => result.url)
	);

	let newResults = sortedResults.filter((result) => {
		return !existing.includes(result.url);
	});

	return newResults;
}
