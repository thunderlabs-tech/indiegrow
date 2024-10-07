import extractor from 'unfluff';

import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { load } from 'cheerio';

import { DynamicStructuredTool } from '@langchain/core/tools';
// import { SupabaseClient } from '@supabase/supabase-js';

export function initTools(db: any) {
	const searchTool = new TavilySearchResults({ maxResults: 10 });

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
		name: 'saveCommunityPost',
		description: 'Save a community post to the database.',
		schema: z.object({
			projectId: z.string().describe('The id of the project'),
			url: z.string().describe('The url of the post'),
			title: z.string().describe('The title of the post'),
			content: z.string().describe('The content of the post'),
			score: z.number().describe('The score of the post')
		}),

		func: async (input: {
			projectId: string;
			url: string;
			title: string;
			content: string;
			score: number;
		}): Promise<string> => {
			console.log('tools - saving community post', input);

			const insert = {
				project_id: input.projectId,
				url: input.url,
				title: input.title,
				content: input.content,
				score: Math.round(input.score)
			};
			const { error } = await db.from('community_posts').insert(insert);
			if (error) {
				console.error('Error saving community post', error);
				throw new Error('Error saving community post');
			}
			return 'Community post saved';
		}
	});

	return [searchTool, getAppInfoTool, saveCommunityPost];
}
