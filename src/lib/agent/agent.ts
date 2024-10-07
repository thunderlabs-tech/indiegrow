// import dotenv from 'dotenv';
// dotenv.config();

import { AgentExecutor, type AgentExecutorInput, createToolCallingAgent } from 'langchain/agents';
import { ChatOpenAI } from '@langchain/openai';

import { ChatPromptTemplate } from '@langchain/core/prompts';

export const briefing = `You're a helpful marketing assistant to an app developer.
Your goal is to find posts on reddit.com that are relevant to the use cases of the app.
You will be given the app store url of the app.

Tasks:
- get the info about the app from the url you're given
- from the app info compile a list of 5 search terms that you can use to find relevant user questions about problems the app is solving, like: "How do I do X?", "What's the best app to do X?", "any advice on how to do X?" where X is some of the use cases of the app.
- report the list of search terms to the user before you continue
- use the tools to find relevant posts on reddit.com using the search terms. Only search for posts on site:reddit.com and no other sites.
- if the content of the post is sth generic like 'Reddit - Dive into anything Get app Get the Reddit app Log In Log in to Reddit Log In / Sign Up Advertise on Reddit Shop Collectible Avatars.." - ignore it and replace it with "..."
- for each post you found, calculate a relevance score ranging from 0 to 1, depending on in how well the app can solve the problem in the post. 0 means the app can't solve the problem at all, 1 means the app can solve the problem perfectly.
- keep the top 20 posts with the highest relevance scores.
- save the top posts to the database using the savePost tool.
- don't return any other output
 `;
// Comment on what you're doing so the user knows what's happening - only outline the steps you're taking not the specific details of the content you're processing.

export async function createAgentExecutor(
	tools: AgentExecutorInput['tools']
): Promise<AgentExecutor> {
	const llm = new ChatOpenAI({
		model: 'gpt-4o',
		temperature: 1
	});

	// Prompt template must have "input" and "agent_scratchpad input variables"
	const prompt = ChatPromptTemplate.fromMessages([
		['system', '{briefing}'],
		['placeholder', '{chat_history}'],
		['human', '{input}'],
		['placeholder', '{agent_scratchpad}']
	]);

	const agent = await createToolCallingAgent({
		llm,
		tools,
		prompt
	});

	const executor = new AgentExecutor({
		agent,
		tools
	});

	return executor;
}

export async function invokeStreamingAgent(
	executor: AgentExecutor,
	agentParams: any
): Promise<ReadableStream> {
	const logStream = await executor.streamLog(agentParams);
	const stream = new ReadableStream({
		async start(controller) {
			// 'Creative filtering" - the agent framework doesn't support streaming out of the box right now
			// 	based on: https://js.langchain.com/v0.1/docs/modules/agents/how_to/streaming/
			for await (const chunk of logStream) {
				if (chunk.ops?.length > 0 && chunk.ops[0].op === 'add') {
					const addOp = chunk.ops[0];
					if (
						addOp.path.startsWith('/logs/ChatOpenAI') &&
						typeof addOp.value === 'string' &&
						addOp.value.length
					) {
						const newVal = addOp.value;
						controller.enqueue(newVal);
					}
				}
			}
			controller.close();
		}
	});
	return stream;
}
