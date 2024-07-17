<script lang="ts">
	import { page } from '$app/stores';
	import { briefing } from '$lib/agent/agent';
	import Spinner from '$lib/components/Spinner.svelte';

	import { parse } from 'best-effort-json-parser';

	$: currentProject = $page.data.currentProject;

	let rawOutput = '';
	let output: string;
	$: output = '';

	type Post = {
		url: string;
		title: string;
		content: string;
		score: number;
	};

	type Result = {
		searchTerm: string;
		posts: Post[];
	};

	let results: Result[];
	$: results = [];

	// for testing layout:
	// $: results = [
	// 	{
	// 		searchTerm: 'best app to connect with neighbors site:reddit.com',
	// 		posts: [
	// 			{
	// 				title: 'Best App for communicating with neighbors in LA? : r/AskLosAngeles - Reddit',
	// 				url: 'https://www.reddit.com/r/AskLosAngeles/comments/tu3k6p/best_app_for_communicating_with_neighbors_in_la/',
	// 				content:
	// 					'Nextdoor - straight up for NIMBYs, annoying af Citizen - for the same group as above but to also drive up your anxieties on crime Facebook - local groups do nothing but complain about homeless living in the neighborhood and people doing take overs, so basically same as the others.',
	// 				score: 0.97296
	// 			},
	// 			{
	// 				title: 'Does anyone here have experience using the Nextdoor app in the ... - Reddit',
	// 				url: 'https://www.reddit.com/r/washingtondc/comments/8d703r/does_anyone_here_have_experience_using_the/',
	// 				content:
	// 					'It is a great way to quickly tune into neighborhood issues and events, but it can also get quite catty. You can set how much personal info you want to share in the app. My neighborhood uses it and it is very active. I joined in the last year or so, and it seems like everyone is using it or has heard about posts on it.',
	// 				score: 0.98518
	// 			},
	// 			{
	// 				title: 'Are there any sites which connect neighbors with things to ... - Reddit',
	// 				url: 'https://www.reddit.com/r/simpleliving/comments/fgfg10/are_there_any_sites_which_connect_neighbors_with/',
	// 				content:
	// 					"All my neighbors just complain about the trash (like literal trash, often complaining neighbors aren't bagging it so some is flying into the street when the dump truck dumps it) and if they've lost a cat or dog. Apparently, there's someone stealing dogs out of yards and selling them to a drug dealer in another nearby neighborhood.",
	// 				score: 0.98232
	// 			},
	// 			{
	// 				title: 'Chat with people who live nearby - Reddit',
	// 				url: 'https://www.reddit.com/r/ChatWithNeighbors/',
	// 				content:
	// 					'Connect with people in your location! Create a post for your geographic area (your town, state or neighborhood). Use Reddit\'s built-in "live chat" feature and/or provide a link to a chat service such as Discord, Zoom or any other platform you like. Don\'t be a jerk. Keep it clean and family-friendly. Have fun!',
	// 				score: 0.97042
	// 			},
	// 			{
	// 				title: 'Want to connect with neighbors on other social platforms?',
	// 				url: 'https://www.reddit.com/r/neighbors_of_BHVG/comments/pzkj06/want_to_connect_with_neighbors_on_other_social/',
	// 				content:
	// 					'Facebook Neighbors of Baldwin Hills Village Gardens. Nextdoor: Baldwin Hills Village Gardens (enter your address for the right info to show in your feed) Reviews & Recommendations on Yelp: Share your service experience with the Baldwin Hills Village Gardens Homes Association, Inc. on Yelp (Increase transparency in the community; please note Yelp reviews are informal, unofficial, social media ...',
	// 				score: 0.94546
	// 			}
	// 		]
	// 	}
	// ];

	let loading = false;

	async function callAgent() {
		loading = true;

		const input = `App url is ${currentProject.appstore_url}`;

		try {
			const response = await fetch('/api/agent', {
				method: 'POST',
				body: JSON.stringify({ briefing, input }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) throw new Error('Reponse not ok!');
			if (!response.body) throw new Error('No body found!');

			const stream = response.body.pipeThrough(new TextDecoderStream());
			const reader = stream.getReader();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				rawOutput += value;

				const [text, partialJson] = rawOutput.split('```json');
				output = text;
				if (partialJson && partialJson.length > 10) {
					const cleanedJson = partialJson.replaceAll('```', '');
					results = parse(cleanedJson) as Result[];
				}
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="h-full w-full p-4">
	<div class="flex flex-col space-y-4">
		<h1 class="h1">Community Marketing</h1>
		<p>Let's find communities talking about the problems your app is solving.</p>

		<p>
			<button class="variant-filled-primary btn btn-md" on:click={callAgent}
				>Automatic search</button
			>
		</p>

		{#if loading}
			<Spinner text="Loading community conversations..." />
		{/if}
		<pre>{output}</pre>

		{#each results as result}
			<hr />
			<h4 class="text-lg"><span class="font-bold">Search term:</span> "{result.searchTerm}"</h4>
			{#if result?.posts?.length > 0}
				<dl class="list-dl text-sm">
					{#each result.posts as post}
						<div>
							<span class="badge bg-primary-500">💬</span>
							<span class="flex-auto">
								<dt>
									<a href={post.url} class="font-bold" target="_blank">
										{post.title}
									</a>
								</dt>
								<dd>{post.content}</dd>
							</span>
						</div>
					{/each}
				</dl>
			{/if}
		{/each}
	</div>
</div>
