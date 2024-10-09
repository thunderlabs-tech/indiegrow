import { initTools } from './tools';
import { createClient, type User } from '@supabase/supabase-js';
import { type Database, type Tables } from '../supabase';

import dotenv from 'dotenv';
import { createAgent, invokeStreamingAgent } from './agent';
import { communityPostsBriefing } from './briefings';
dotenv.config();

if (!process.env.TEST_SUPABASE_URL || !process.env.TEST_SUPABASE_ANON_KEY) {
	throw new Error('TEST_SUPABASE_URL and TEST_SUPABASE_ANON_KEY must be set');
}

const supabaseAnon = createClient<Database>(
	process.env.TEST_SUPABASE_URL,
	process.env.TEST_SUPABASE_ANON_KEY
);

if (!process.env.TEST_SUPABASE_SERVICE_KEY) {
	throw new Error('TEST_SUPABASE_SERVICE_KEY must be set');
}
const supabaseService = createClient<Database>(
	process.env.TEST_SUPABASE_URL,
	process.env.TEST_SUPABASE_SERVICE_KEY
);

const tools = initTools(supabaseAnon, true);
const toolsArray = [tools.multiSearchTool, tools.getAppInfoTool, tools.saveCommunityPost];

const graphAgent = createAgent(toolsArray, communityPostsBriefing);

async function aggregateStream(stream: ReadableStream): Promise<string> {
	const reader = stream.getReader();
	let output = '';
	while (true) {
		const { done, value } = await reader.read();

		if (value) {
			output += value;
		}
		if (done) break;
	}
	return output;
}

describe('Agents', () => {
	let project: Tables<'projects'> | undefined = undefined;
	let user: User | null = null;

	beforeAll(async () => {
		const { data: signInData, error: signInError } = await supabaseAnon.auth.signInAnonymously();
		if (signInError) throw new Error('Error signing in ' + signInError.message);
		user = signInData.user;
		if (!user) throw new Error('User not found');

		const { error, data } = await supabaseAnon
			.from('projects')
			.insert({
				name: 'Spent Time Tracker',
				appstore_url: 'https://apps.apple.com/us/app/spent-time-tracker/id6475881358',
				user_id: user.id,
				relevant: null,
				appstore_info: JSON.parse(
					'{"@context":"http://schema.org","@type":"SoftwareApplication","name":"Spent Time Tracker","description":"Track time effortlessly. Invoice confidently.\\n\\nSpent is the time tracker designed for busy professionals who need precise time management without the hassle of clicking through a complex UI.\\n\\nAutomatic Time Tracking: No more upfront setup. Just mention a @client, /project, or #task when you start working, and Spent automatically tracks your time until you switch tasks.\\n\\nEffortless Invoicing: Generate detailed timesheets ready for invoicing with a single click. Export as CSV, neatly organized by client, project, or task.\\n\\nKey Features:\\n\\nAutomatic task organization: Spent categorizes your activity for you using ID strings\\nSeamless Linear integration: Track time directly from your Linear tasks\\nKeyboard accessibility: Navigate Spent without lifting your hands\\nCSV export: Easily export your timesheets for invoicing\\niPhone app: coming soon\\n\\nPerfect for:\\n\\nDevelopers\\nDesigners\\nFreelancers\\nConsultants\\nAnyone who needs precise time tracking\\n\\nTerms of use: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/\\nPrivacy policy: https://spent.wmadden.dev/support-items/privacy-policy","screenshot":[],"image":"https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/32/41/6f/32416f52-a4eb-2f08-bde0-8260b05939bb/AppIcon-0-0-85-220-0-4-0-2x.png/1200x630bb.png","applicationCategory":"Productivity","datePublished":"Oct 4, 2024","operatingSystem":"13.0","author":{"@type":"Person","name":"William Madden","url":"https://apps.apple.com/us/developer/william-madden/id1725343434"},"offers":{"@type":"Offer","price":0,"priceCurrency":"USD","category":"free"}}'
				),
				pma: '{"brandName":"Spent","oneLinePitch":"Track time effortlessly. Invoice confidently.","productType":"Productivity app","targetAudience":"Busy professionals, developers, designers, freelancers, consultants","keyFeatures":["Automatic task organization","Seamless Linear integration","Keyboard accessibility"],"keyBenefits":["Precise time management","Effortless invoicing","User-friendly experience"],"positioning":"Spent offers a streamlined and automated solution for busy professionals in need of accurate time tracking and invoicing."}'
			})
			.select('*')
			.single();
		if (error) throw new Error('Error creating project ' + error.message);
		project = data;
	});

	afterAll(async () => {
		if (project) {
			const { error } = await supabaseAnon.from('projects').delete().eq('id', project.id);
			if (error) throw new Error('Error deleting project ' + error.message);
		}
		if (user) {
			supabaseService.auth.admin.deleteUser(user.id);
		}
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('agent', () => {
		it('calls tools and returns a stream', async () => {
			if (!project) throw new Error('Project not found');

			const saveSpy = jest.spyOn(tools.saveCommunityPost, 'func');
			const stream = await invokeStreamingAgent(
				graphAgent,
				`App url is ${project.appstore_url}. The project id is ${project.id}.`
			);
			const output = await aggregateStream(stream);
			expect(saveSpy).toHaveBeenCalledTimes(1);
			console.log(output);
		});
	});
});
