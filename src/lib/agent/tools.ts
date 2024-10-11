import extractor from 'unfluff';

import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { load } from 'cheerio';

import { DynamicStructuredTool } from '@langchain/core/tools';
import { multiSearch } from '$lib/multiSearch';

export function initTools(db: any, testmode: boolean = false) {
	const multiSearchTool = tool(
		async (input: { projectId: string; queries: string[] }): Promise<string> => {
			const results = await multiSearch(
				db,
				input.projectId,
				input.queries,
				['reddit.com', 'quora.com'],
				testmode
			);
			return JSON.stringify(results);
		},
		{
			name: 'multiQuerySearch',
			description: 'Search for multiple queries and return aggregated results',
			schema: z.object({
				projectId: z.string().describe('The id of the project'),
				queries: z.array(z.string()).describe('The queries to search for')
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

			if (testmode) {
				console.log('test mode - skipping insert');
			} else {
				const { error } = await db.from('community_posts').insert(insert);
				if (error) {
					const errorMessage = `Error saving community post: ${error.message}`;
					console.error(errorMessage);
					return errorMessage;
				}
			}
			return 'Community post saved';
		}
	});

	return { multiSearchTool, getAppInfoTool, saveCommunityPost };
}
