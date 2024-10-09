import { type AgentExecutorInput } from 'langchain/agents';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import type { AIMessageChunk } from '@langchain/core/messages';

export function createAgent(tools: AgentExecutorInput['tools'], briefing: string) {
	const llm = new ChatOpenAI({
		model: 'gpt-4o',
		temperature: 1
	});

	const agent = createReactAgent({
		llm,
		tools,
		messageModifier: briefing
	});
	return agent;
}

// based on: https://langchain-ai.github.io/langgraphjs/how-tos/stream-tokens/#streaming-final-responses
export async function invokeStreamingAgent(
	agent: any,

	input: string
): Promise<ReadableStream> {
	const inputs = { messages: [{ role: 'user', content: input }] };
	const eventStream = await agent.streamEvents(inputs, {
		version: 'v2'
	});

	const outputStream = new ReadableStream({
		async start(controller) {
			for await (const { event, data } of eventStream) {
				if (event === 'on_chat_model_stream') {
					const msg = data.chunk as AIMessageChunk;
					if (!msg.tool_call_chunks?.length) {
						controller.enqueue(msg.content);
					}
				}
			}
			controller.close();
		}
	});
	return outputStream;
}
