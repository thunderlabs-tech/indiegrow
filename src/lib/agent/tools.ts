import extractor from 'unfluff';

import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { load } from 'cheerio';

import { DynamicStructuredTool } from '@langchain/core/tools';

type SearchResult = {
	url: string;
	title: string;
	content: string;
	score: number;
};
export function initTools(db: any) {
	async function existingPosts(urls: string[]): Promise<string[]> {
		const { data, error } = await db.from('community_posts').select('url').in('url', urls);
		if (error) {
			console.error('Error getting existing posts', error);
			throw new Error('Error getting existing posts');
		}

		const existingUrls = data.map((post) => post.url);
		return existingUrls;
	}

	const multiSearchTool = tool(
		async (input: { queries: string[] }): Promise<string> => {
			console.log('multiSearchTool - input', input);

			const results = await Promise.all(
				input.queries.map(async (query) => {
					const search = new TavilySearchResults({
						maxResults: 10
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

			const existing = await existingPosts(sortedResults.map((result) => result.url));

			const newUrls = sortedResults.filter((result) => {
				return !existing.includes(result.url);
			});

			console.log('multiSearchTool - new results', newUrls.length);

			return JSON.stringify(newUrls);
		},
		{
			name: 'multiQuerySearch',
			description: 'Search for multiple queries and return aggregated results',
			schema: z.object({
				queries: z.array(z.string())
			})
		}
	);

	const getAppInfoTool = tool(
		async (input: { url: string }): Promise<string> => {
			const response = await fetch(input.url);
			const html = await response.text();
			const $ = load(html);
			const metaDataJson = $(`[name=schema:software-application]`).html();

			if (metaDataJson) {
				const info = JSON.parse(metaDataJson.toString()) as {
					name: string;
					description: string;
				};
				return `App Name: ${info.name}\nApp Description: ${info.description}`;
			} else {
				const unfluffData = await extractor(html);
				return `App Name: ${unfluffData.title}\nApp Description: ${unfluffData.description}`;
			}
		},
		{
			name: 'getAppInfo',
			description: 'Get app info from a webpage url or appstore url',
			schema: z.object({
				url: z.string()
			})
		}
	);
	const saveCommunityPost = new DynamicStructuredTool({
		name: 'savePost',
		description: 'Save a post to the database.',
		schema: z.object({
			projectId: z.string().describe('The id of the project'),
			url: z.string().describe('The url of the post'),
			title: z.string().describe('The title of the post'),
			content: z.string().describe('The content of the post'),
			score: z.number().describe('The score of the post as returned by the search engine.'),
			relevance: z.number().describe('The relevance of the post calculated by the LLM.')
			// publishedAt: z.string().describe('The publication date of the post if known, otherwise null')
		}),

		func: async (input: {
			projectId: string;
			url: string;
			title: string;
			content: string;
			score: number;
			relevance: number;
			// publishedAt: string;
		}): Promise<string> => {
			console.log('tools - saving community post', input);

			const insert = {
				project_id: input.projectId,
				url: input.url,
				title: input.title,
				content: input.content,
				score: input.score,
				relevance: input.relevance
				// published_at: input.publishedAt
			};
			const { error } = await db.from('community_posts').insert(insert);
			if (error) {
				console.error('Error saving community post', error);
				throw new Error('Error saving community post');
			}
			return 'Community post saved';
		}
	});

	return [multiSearchTool, getAppInfoTool, saveCommunityPost];
}
