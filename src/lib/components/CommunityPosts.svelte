<script lang="ts">
	import { page } from '$app/stores';
	import { searchTermsBriefing } from '$lib/agent/briefings';

	import { parse } from 'best-effort-json-parser';
	import Spinner from '$lib/components/Spinner.svelte';
	import CommunityPostsTable from '$lib/components/CommunityPostsTable.svelte';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import type { CommunityPost } from '$lib/types';
	import SearchTerms from './SearchTerms.svelte';

	$: currentProject = $page.data.currentProject;

	let projectInfo: string | undefined = undefined;
	let searchTerms: string[] | undefined = undefined;

	searchTerms = ['test', 'test2'];

	let posts: CommunityPost[] = [];

	let output: string;
	$: output = '';

	let loading = false;

	$: {
		console.log('currentProject', currentProject);
	}

	$: if (!projectInfo && currentProject) {
		projectInfo = `Name: ${currentProject.name} \n\nDescription:${currentProject.description}`;
	}

	async function compileSearchTerms() {
		loading = true;

		const input = `Project info: ${projectInfo}\n\n`;
		searchTerms = undefined;

		try {
			const response = await fetch('/api/agent', {
				method: 'POST',
				body: JSON.stringify({ briefing: searchTermsBriefing, input }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) throw new Error('Reponse not ok!');
			if (!response.body) throw new Error('No body found!');

			const stream = response.body.pipeThrough(new TextDecoderStream());
			const reader = stream.getReader();

			let partialJson = '';
			let result: { searchTerms: string[] } | undefined = undefined;
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				partialJson += value;
				result = parse(partialJson);

				if (result?.searchTerms) {
					searchTerms = result.searchTerms;
				}
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			loading = false;
		}
	}

	async function findPosts() {
		await compileSearchTerms();
	}
</script>

<p>
	<button class="variant-filled btn btn-md" on:click={findPosts}
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
	<textarea rows="10" class="textarea" id="productInfo" bind:value={projectInfo}></textarea>
</label>

<label for="searchTerms" class="label"
	>Search terms
	<SearchTerms bind:searchTerms />
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
