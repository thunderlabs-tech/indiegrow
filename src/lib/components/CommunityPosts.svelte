<script lang="ts">
	import { page } from '$app/stores';
	import { searchParametersBriefing } from '$lib/agent/briefings';

	import { parse } from 'best-effort-json-parser';
	import Spinner from '$lib/components/Spinner.svelte';
	import CommunityPostsTable from '$lib/components/CommunityPostsTable.svelte';
	import type { CommunityPost } from '$lib/types';
	import SearchTerms from './SearchTerms.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	$: currentProject = $page.data.currentProject;

	let projectInfo: string | undefined = undefined;
	let searchTerms: string[] | undefined = undefined;
	let relevantCriteria: string | undefined = undefined;
	let irrelevantCriteria: string | undefined = undefined;

	let sitesToSearch: string = 'reddit.com, quora.com';

	let posts: CommunityPost[] = [];

	let output: string;
	$: output = '';

	let loading = false;
	let resultsPerQuery = 5;

	$: {
		console.log('currentProject', currentProject);
	}

	$: if (!projectInfo && currentProject) {
		projectInfo = `Name: ${currentProject.name} \n\nDescription:${currentProject.description}`;
	}

	async function compileSearchParams() {
		loading = true;

		const input = `Project info: ${projectInfo}\n\n`;
		searchTerms = undefined;

		try {
			const response = await fetch('/api/agent', {
				method: 'POST',
				body: JSON.stringify({ briefing: searchParametersBriefing, input }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) throw new Error('Reponse not ok!');
			if (!response.body) throw new Error('No body found!');

			const stream = response.body.pipeThrough(new TextDecoderStream());
			const reader = stream.getReader();

			let partialJson = '';
			let result:
				| {
						searchTerms: string[];
						relevantCriteria: string;
						irrelevantCriteria: string;
				  }
				| undefined = undefined;
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				partialJson += value;
				result = parse(partialJson);

				if (result?.searchTerms) {
					searchTerms = result.searchTerms;
				}
				if (result?.relevantCriteria) {
					relevantCriteria = result.relevantCriteria;
				}
				if (result?.irrelevantCriteria) {
					irrelevantCriteria = result.irrelevantCriteria;
				}
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			loading = false;
		}
	}

	async function findPosts() {
		loading = true;
		try {
			const sites = sitesToSearch.split(',').map((site) => site.trim());
			const response = await fetch('/api/search', {
				method: 'POST',
				body: JSON.stringify({
					projectId: currentProject.id,
					terms: searchTerms,
					sites: sites,
					projectInfo,
					resultsPerQuery
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) throw new Error('Reponse not ok!');
			if (!response.body) throw new Error('No body found!');
			const results = await response.json();
			console.log('results', results);
		} catch (error) {
			console.error('Error:', error);
		} finally {
			loading = false;
		}
	}

	async function runAll() {
		await compileSearchParams();
		await findPosts();
	}

	let showCustom = false;
</script>

<p>
	<button class="variant-filled btn btn-md" on:click={runAll}
		>Find
		{#if posts.length > 0}
			more
		{/if}
		relevant posts</button
	>
</p>
{#if searchTerms && searchTerms.length > 0}
	<SlideToggle name="showCustom" bind:checked={showCustom} label="Customize search">
		Customize search
	</SlideToggle>
	{#if showCustom}
		<div class="card space-y-4 p-4">
			<h3 class="h3">Search parameters</h3>
			<label for="productInfo" class="label"
				>Product info
				<textarea
					rows={Math.max(projectInfo ? projectInfo.split('\n').length : 0, 3)}
					class="textarea"
					id="productInfo"
					bind:value={projectInfo}
				></textarea>
			</label>

			<p>
				<button class="variant-filled btn btn-sm" on:click={compileSearchParams}>
					Compile search terms from description
				</button>
			</p>

			<label for="searchTerms" class="label"
				>Search terms
				<SearchTerms bind:searchTerms />
			</label>
			<label for="relevantCriteria" class="label"
				>Relevant criteria
				<textarea
					rows={Math.max(relevantCriteria ? relevantCriteria.split('\n').length : 0, 3)}
					class="textarea"
					id="relevantCriteria"
					bind:value={relevantCriteria}
				></textarea>
			</label>
			<label for="irrelevantCriteria" class="label"
				>Irrelevant criteria
				<textarea
					rows={Math.max(irrelevantCriteria ? irrelevantCriteria.split('\n').length : 0, 3)}
					class="textarea"
					id="irrelevantCriteria"
					bind:value={irrelevantCriteria}
				></textarea>
			</label>

			<label for="sites" class="label"
				>Sites to search
				<input type="text" class="input" id="sites" bind:value={sitesToSearch} />
			</label>
			<p>
				<button class="variant-filled btn btn-sm" on:click={findPosts}>Run custom search</button>
			</p>
		</div>
	{/if}
{/if}
{#if loading}
	<Spinner />
{/if}
<CommunityPostsTable bind:posts />
