<script lang="ts">
	import Screenshots from '$lib/components/Screenshots.svelte';
	import { ProgressRadial, SlideToggle } from '@skeletonlabs/skeleton';
	import { exampleAppStoreInfo, type AppStoreInfo, exampleUrl } from '$lib/scrapeAppstore';
	import { refinedResponse, refinementPrompt, refineWithLLMStreaming } from '$lib/analysis';
	import { fade } from 'svelte/transition';
	import { openAiBrowserClient } from '$lib/openaiBrowserClient';
	import { OpenAiHandler, StreamMode } from 'openai-partial-stream';
	import AnalysisHelpers from '$lib/components/AnalysisHelpers.svelte';

	import { project } from '$lib/store';
	console.log($project.url);

	const appStoreInfo = $project.appStoreInfo;

	let prompt = refinementPrompt;

	let suggestions = refinedResponse;
	suggestions = undefined;

	let loadingContent = false;
	let showRefinementPrompt = false;
	let showAnalaysisHelpers = false;

	async function scrape() {
		try {
			loadingContent = true;

			const response = await fetch('/api/scrape', {
				method: 'POST',
				body: JSON.stringify({ url: $project.url }),
				headers: { 'content-type': 'application/json' }
			});
			$project.appStoreInfo = (await response.json()) as AppStoreInfo;

			console.log($project.appStoreInfo);
		} catch (error) {
			console.error('Error extracting entities:', error);
		} finally {
			loadingContent = false;
		}
	}

	let loadingRefinements = false;
	async function refine() {
		loadingRefinements = true;
		try {
			if (!appStoreInfo) {
				console.error('No app store info');
				return;
			}

			const openai = openAiBrowserClient();
			const stream = await refineWithLLMStreaming(openai, prompt, appStoreInfo);

			const openAiHandler = new OpenAiHandler(StreamMode.StreamObjectKeyValue);
			const entityStream = openAiHandler.process(stream);

			for await (const item of entityStream) {
				console.log(item);
				suggestions = item?.data;
			}
		} catch (error) {
			console.error('Error running analysis:', error);
		} finally {
			loadingRefinements = false;
		}
	}
</script>

<div class="container mx-auto flex h-full p-6">
	<div class="flex flex-col space-y-10">
		<h1 class="h1">Improve your App Store presence</h1>
		<div class="w-full space-y-2">
			<div class="justify-center space-x-2">
				<form on:submit={scrape}>
					<div class="input-group input-group-divider grid-cols-[1fr_auto]">
						<input
							bind:value={$project.url}
							class="input"
							type="text"
							placeholder="Enter your appstore URL"
						/>
						<button class="variant-filled-secondary btn">Start </button>
					</div>
				</form>
			</div>
			<div>
				{#if loadingContent}
					<span class="flex">
						<ProgressRadial
							value={undefined}
							stroke={100}
							meter="stroke-primary-500"
							track="stroke-primary-500/30"
							strokeLinecap="butt"
							width="w-5"
						/>
						<span class="ml-2 flex-1 text-sm text-primary-500">Loading app store content...</span>
					</span>
				{/if}
				{#if appStoreInfo?.description}
					<button on:click={refine} class="variant-filled-secondary btn mb-4 mt-4 flex"
						>Make improvement suggestions</button
					>
					<SlideToggle name="refinementPrompt" bind:checked={showRefinementPrompt} size="sm">
						Show prompt
					</SlideToggle>

					{#if showRefinementPrompt}
						<textarea
							class="textarea"
							rows="20"
							bind:value={prompt}
							placeholder="Enter your prompt"
						/>
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
							{#if suggestions?.name?.suggestion}
								Suggestion:
								<pre class="suggestion" transition:fade>{suggestions.name.suggestion}</pre>
							{/if}
							{#if suggestions?.name?.explanation}
								Explanation:
								<p class="explanation" transition:fade>{suggestions.name.explanation}</p>
							{/if}
						</div>
						<h3>Category:</h3>
						<div class="card p-2">
							Current:
							<pre class="current">{$project.appStoreInfo?.applicationCategory}</pre>
							{#if suggestions?.category?.suggestion}
								Suggestion:
								<pre class="suggestion" transition:fade>{suggestions.category.suggestion}</pre>
							{/if}
							{#if suggestions?.category?.explanation}
								Explanation:
								<p class="explanation" transition:fade>
									{suggestions.category.explanation}
								</p>
							{/if}
						</div>
						<h3>Description:</h3>
						<div class="card p-2">
							Current:
							<pre class="current">{$project.appStoreInfo?.description}</pre>
							{#if suggestions?.description?.suggestion}
								Suggestion:
								<pre class="suggestion" transition:fade>{suggestions.description.suggestion}</pre>
							{/if}
							{#if suggestions?.description?.explanation}
								Explanation:
								<p class="explanation" transition:fade>
									{suggestions.description.explanation}
								</p>
							{/if}
						</div>
						<h3>Screenshots:</h3>

						Current:
						<div class="card p-2">
							<Screenshots screenshotUrls={$project.appStoreInfo.screenshot} />
						</div>
						{#if suggestions?.screenshots?.suggestion}
							Suggestion:
							<pre class="suggestion" transition:fade>{suggestions.screenshots.suggestion}</pre>
						{/if}
						{#if suggestions?.screenshots?.explanation}
							Explanation:
							<p class="explanation" transition:fade>
								{suggestions.screenshots.explanation}
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
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	h3 {
		font-size: 24px;
		margin-top: 1em;
		margin-bottom: 0.3em;
	}
	.appstore-content {
		font-size: 18px;
		line-height: 1.4;
	}
	pre {
		/* white-space: normal; */
		white-space: pre-line;
		margin-bottom: 15px;
		margin-top: 3px;
		padding: 8px;
	}
	pre.current {
		background-color: theme('colors.secondary.800');
	}

	pre.suggestion {
		background-color: theme('colors.secondary.500');
	}

	.explanation {
		background-color: theme('colors.primary.800');
		font-size: 16px;
		margin-top: 3px;
		padding: 8px;
	}
</style>
