import type { CommunityPost } from './types';
import { PromptTemplate } from '@langchain/core/prompts';
import { SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import type { SupabaseClient } from '@supabase/supabase-js';

const promptTemplate = PromptTemplate.fromTemplate(
	`You are a helpful assistant that can help me decide on the relevance of a post on a community site to the project at hand.
The relevance score should be based on the criteria below and be between 0 and 1 for 0 for irrelevant to 1 for very relevant..
Also provide a very brief explanation for the score: it should have very bullet points and be very concise, like: 'searching for X, mentions feature Y'

Here is some information about the project: {projectInfo}.

Here is some information about the post:
Url: {postUrl}.
Title: {postTitle}.
Content: {postContent}.

Criteria for relevant criteria: {relevantCriteria}.
Criteria that mark the post as irrelevant: {irrelevantCriteria}.

Respond with a JSON object with the following fields:
- relevanceScore: the score between 0 and 1.
- explanation: a very brief explanation for the score starting with a capital letter.
`
);

export async function updatePostRelevance(
	supabase: SupabaseClient,
	post: CommunityPost,
	projectInfo: string,
	relevantCriteria: string,
	irrelevantCriteria: string
) {
	const prompt = await promptTemplate.format({
		projectInfo,
		postUrl: post.url,
		postTitle: post.title,
		postContent: post.content,
		relevantCriteria,
		irrelevantCriteria
	});
	const messages = [new SystemMessage(prompt)];

	const model = new ChatOpenAI({ model: 'gpt-4o-mini' });
	const response = await model.invoke(messages, { response_format: { type: 'json_object' } });
	const parser = new JsonOutputParser();
	const result = await parser.invoke(response);

	const { error } = await supabase
		.from('community_posts')
		.update({ relevance_score: result.relevanceScore, relevance_explanation: result.explanation })
		.eq('id', post.id);
	if (error) {
		console.error('Error updating post relevance', error);
		throw error;
	}
}

export async function updatePostsRelevances(
	supabase: SupabaseClient,
	posts: CommunityPost[],
	projectInfo: string,
	relevantCriteria: string,
	irrelevantCriteria: string
) {
	const batchSize = 10;
	for (let i = 0; i < posts.length; i += batchSize) {
		const batch = posts.slice(i, i + batchSize);
		await Promise.all(
			batch.map((post) =>
				updatePostRelevance(supabase, post, projectInfo, relevantCriteria, irrelevantCriteria)
			)
		);
	}
}
