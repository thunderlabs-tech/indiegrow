import { type AgentExecutorInput } from 'langchain/agents';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import type { AIMessageChunk } from '@langchain/core/messages';

export function createGraphAgent(tools: AgentExecutorInput['tools'], briefing: string) {
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

export async function invokeStreamingGraphAgent(
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
