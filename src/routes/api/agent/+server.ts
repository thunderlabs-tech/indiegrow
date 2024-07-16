import { createAgentExecutor, invokeStreamingAgent } from '$lib/agent/agent';
import { tools } from '$lib/agent/tools';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const params = await request.json();
	console.log('params', params);

	const agent = await createAgentExecutor(tools);
	const stream = await invokeStreamingAgent(agent, params);
	return new Response(stream, { headers: { 'Content-Type': 'text/html' } });
}
