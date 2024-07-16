<script lang="ts">
	import { marked } from 'marked';
	import { page } from '$app/stores';
	import { briefing } from '$lib/agent/agent';
	import Spinner from '$lib/components/Spinner.svelte';

	$: currentProject = $page.data.currentProject;

	let output: string = '';

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
				console.log(value);
				output += value;
			}

			// const linesGenerator = streamToLines(stream);

			// for await (const line of linesGenerator) {
			// const pair = JSON.parse(line) as { masked: string; unmasked: string };
			// messages[messages.length - 1].maskedContent += pair.masked + '\n';
			// messages[messages.length - 1].content += pair.unmasked + '\n';
			// }
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
			<button class="variant-filled-secondary btn btn-md" on:click={callAgent}
				>Automatic search</button
			>
		</p>

		{#if loading}
			<Spinner text="Loading communities..." />
		{/if}
		{@html marked.parse(output)}
	</div>
</div>
