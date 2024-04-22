<script lang="ts">
	import {
		refinementPrompt,
		refineWithLLMStreaming,
		type ImprovementSuggestions
	} from '$lib/analysis';
	import { fade } from 'svelte/transition';
	import { openAiBrowserClient } from '$lib/openaiBrowserClient';
	import { OpenAiHandler, StreamMode } from 'openai-partial-stream';
	import AnalysisHelpers from '$lib/components/AnalysisHelpers.svelte';

	import { project } from '$lib/project';

	let loadingRefinements = false;
	let prompt = refinementPrompt;
	let showRefinementPrompt = false;
	let showAnalaysisHelpers = false;

	async function refine() {
		loadingRefinements = true;
		try {
			if (!$project.appStoreInfo) {
				console.error('No app store info');
				return;
			}

			const openai = openAiBrowserClient();
			const stream = await refineWithLLMStreaming(openai, prompt, $project.appStoreInfo);

			const openAiHandler = new OpenAiHandler(StreamMode.StreamObjectKeyValue);
			const entityStream = openAiHandler.process(stream);

			for await (const item of entityStream) {
				console.log(item);
				if (item) {
					$project.suggestions = item.data as ImprovementSuggestions;
				}
			}
		} catch (error) {
			console.error('Error running analysis:', error);
		} finally {
			loadingRefinements = false;
		}
	}
</script>

<button on:click={refine} class="variant-filled-secondary btn mb-4 mt-4 flex"
	>Make improvement suggestions</button
>
<SlideToggle name="refinementPrompt" bind:checked={showRefinementPrompt} size="sm">
	Show prompt
</SlideToggle>

{#if showRefinementPrompt}
	<textarea class="textarea" rows="20" bind:value={prompt} placeholder="Enter your prompt" />
{/if}

{#if loadingRefinements}
	<span class="flex">
		<ProgressRadial
			value={undefined}
			stroke={100}
			meter="stroke-primary-500"
			track="stroke-primary-500/30"
			strokeLinecap="butt"
			width="w-5"
		/>
		<span class="ml-2 flex-1 text-sm text-primary-500">Loading suggestions...</span>
	</span>
{/if}
<h2 class="h2 mb-2 mt-4">App Store Content</h2>

<div class="appstore-content" transition:fade={{ duration: 1000 }}>
	<h3>Name:</h3>
	<div class="card p-2">
		Current:
		<pre class="current">{$project.appStoreInfo?.name}</pre>
		{#if $project.suggestions?.name?.suggestion}
			Suggestion:
			<pre class="suggestion" transition:fade>{$project.suggestions.name.suggestion}</pre>
		{/if}
		{#if $project.suggestions?.name?.explanation}
			Explanation:
			<p class="explanation" transition:fade>{$project.suggestions.name.explanation}</p>
		{/if}
	</div>
	<h3>Category:</h3>
	<div class="card p-2">
		Current:
		<pre class="current">{$project.appStoreInfo?.applicationCategory}</pre>
		{#if $project.suggestions?.category?.suggestion}
			Suggestion:
			<pre class="suggestion" transition:fade>{$project.suggestions.category.suggestion}</pre>
		{/if}
		{#if $project.suggestions?.category?.explanation}
			Explanation:
			<p class="explanation" transition:fade>
				{$project.suggestions.category.explanation}
			</p>
		{/if}
	</div>
	<h3>Description:</h3>
	<div class="card p-2">
		Current:
		<pre class="current">{$project.appStoreInfo?.description}</pre>
		{#if $project.suggestions?.description?.suggestion}
			Suggestion:
			<pre class="suggestion" transition:fade>{$project.suggestions.description.suggestion}</pre>
		{/if}
		{#if $project.suggestions?.description?.explanation}
			Explanation:
			<p class="explanation" transition:fade>
				{$project.suggestions.description.explanation}
			</p>
		{/if}
	</div>
	<h3>Screenshots:</h3>

	Current:
	<div class="card p-2">
		<Screenshots screenshotUrls={$project.appStoreInfo?.screenshot} />
	</div>
	{#if $project.suggestions?.screenshots?.suggestion}
		Suggestion:
		<pre class="suggestion" transition:fade>{$project.suggestions.screenshots.suggestion}</pre>
	{/if}
	{#if $project.suggestions?.screenshots?.explanation}
		Explanation:
		<p class="explanation" transition:fade>
			{$project.suggestions.screenshots.explanation}
		</p>
	{/if}
</div>

<div class="card mt-4 p-2">
	<SlideToggle name="helpers" bind:checked={showAnalaysisHelpers} size="sm">
		Show analysis helpers
	</SlideToggle>

	{#if showAnalaysisHelpers}
		<AnalysisHelpers />
	{/if}
</div>
