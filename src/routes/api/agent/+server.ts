import { createAgentExecutor, invokeStreamingAgent } from '$lib/agent/agent';
import { initTools } from '$lib/agent/tools.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const params = await request.json();

	const tools = initTools(locals.supabase);

	const agent = await createAgentExecutor(tools);
	const stream = await invokeStreamingAgent(agent, params);
	return new Response(stream, { headers: { 'Content-Type': 'text/html' } });
}
