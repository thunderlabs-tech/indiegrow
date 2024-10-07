<script lang="ts">
	import { page } from '$app/stores';
	import { briefing } from '$lib/agent/agent';
	import Spinner from '$lib/components/Spinner.svelte';

	import { parse } from 'best-effort-json-parser';
	import CommunityPostsTable from '$lib/components/CommunityPostsTable.svelte';

	$: currentProject = $page.data.currentProject;

	let rawOutput = '';
	let output: string;
	$: output = '';

	let loading = false;

	async function callAgent() {
		loading = true;

		const input = `App url is ${currentProject.appstore_url}. The project id is ${currentProject.id}.`;

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
					results = parse(cleanedJson);
				}
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto max-w-5xl space-y-8 p-4 md:p-12">
	<div class="flex flex-col space-y-4">
		<h1 class="h1">Community pulse</h1>
		<p>Let's find communities talking about the problems your app is solving.</p>

		<p>
			<button class="variant-filled btn btn-md" on:click={callAgent}
				>Find relevant conversations</button
			>
		</p>

		{#if loading}
			<Spinner text="Loading community conversations..." />
		{/if}
		<pre class="text-sm">{output}</pre>
		<CommunityPostsTable />
	</div>
</div>
