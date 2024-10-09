import { createGraphAgent, invokeStreamingGraphAgent } from '$lib/agent/graph-agent';
import { initTools } from '$lib/agent/tools.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const params = await request.json();

	const { briefing, input } = params;

	const tools = initTools(locals.supabase);
	const toolsArray = [tools.multiSearchTool, tools.getAppInfoTool, tools.saveCommunityPost];

	const agent = await createGraphAgent(toolsArray, briefing);
	const stream = await invokeStreamingGraphAgent(agent, input);

	return new Response(stream, { headers: { 'Content-Type': 'text/html' } });
}
