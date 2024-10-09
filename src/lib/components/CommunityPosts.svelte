<script lang="ts">
	import { page } from '$app/stores';
	import { communityPostsBriefing } from '$lib/agent/briefings';

	import { parse } from 'best-effort-json-parser';
	import Spinner from '$lib/components/Spinner.svelte';
	import CommunityPostsTable from '$lib/components/CommunityPostsTable.svelte';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import type { CommunityPost } from '$lib/types';

	$: currentProject = $page.data.currentProject;

	let searchTerms: string | undefined = undefined;
	let productInfo: string | undefined = undefined;

	let posts: CommunityPost[] = [];

	let rawOutput = '';
	let output: string;
	$: output = '';

	let loading = false;

	$: {
		console.log('currentProject', currentProject);
	}

	$: if (!productInfo && currentProject) {
		productInfo = `Name: ${currentProject.name} \n\nDescription:${currentProject.description}`;
	}

	async function callAgent() {
		loading = true;

		const input = `App url is ${currentProject.appstore_url}. The project id is ${currentProject.id}.`;
		output = '';

		try {
			const response = await fetch('/api/agent', {
				method: 'POST',
				body: JSON.stringify({ briefing: communityPostsBriefing, input }),
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

<p>
	<button class="variant-filled btn btn-md" on:click={callAgent}
		>Find
		{#if posts.length > 0}
			more
		{/if}
		relevant posts</button
	>
</p>
{#if posts.length > 0}
	<p>
		Found {posts.length} potentially relevant posts. The list is not exhaustive - but it's a good starting
		point. You can always try to find more posts by hitting the button again. New posts will be integrated
		into the list below, which is sorted by relevance.
	</p>
{/if}

<label for="productInfo" class="label"
	>Product info
	<textarea rows="10" class="textarea" id="productInfo" bind:value={productInfo}></textarea>
</label>

<label for="searchTerms" class="label"
	>Search terms
	<textarea class="textarea" id="searchTerms" bind:value={searchTerms}></textarea>
</label>

{#if loading}
	<Spinner text="Loading community conversations..." />
{/if}
<!-- <pre class="text-sm">{output}</pre> -->
<CodeBlock
	language={'AI output'}
	code={output}
	lineNumbers={false}
	buttonLabel={''}
	button={'text-left'}
></CodeBlock>
<CommunityPostsTable bind:posts />
