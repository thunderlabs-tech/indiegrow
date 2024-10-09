import { createAgent, invokeStreamingAgent } from '$lib/agent/agent';
import { initTools } from '$lib/agent/tools.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const params = await request.json();

	const { briefing, input } = params;

	const tools = initTools(locals.supabase);
	const toolsArray = [tools.multiSearchTool, tools.getAppInfoTool, tools.saveCommunityPost];

	const agent = createAgent(toolsArray, briefing);
	const stream = await invokeStreamingAgent(agent, input);

	return new Response(stream, { headers: { 'Content-Type': 'text/html' } });
}
