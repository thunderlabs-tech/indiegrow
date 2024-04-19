<script lang="ts">
	import Screenshots from '$lib/components/Screenshots.svelte';
	import { ProgressRadial, TabGroup, Tab } from '@skeletonlabs/skeleton';
	import { exampleAppStoreInfo, type AppStoreInfo, exampleUrl } from '$lib/scrapeAppstore';
	import {
		analysisPrompt,
		type AnalysisResult,
		analyzetWithLLM,
		analyzetWithLLMStreaming,
		analyzetWithAssistant,
		refinementPrompt,
		refinedResponse
	} from '$lib/analysis';
	import { fade } from 'svelte/transition';
	import { openAiBrowserClient } from '$lib/openaiBrowserClient';
	import { OpenAiHandler, StreamMode } from 'openai-partial-stream';

	let url: string | undefined = exampleUrl;
	url = undefined;

	let appStoreInfo: AppStoreInfo | undefined = exampleAppStoreInfo;
	appStoreInfo = null;

	let prompt = analysisPrompt;
	prompt = refinementPrompt;

	let refinements = refinedResponse;
	refinements = undefined;

	let assistantId = 'asst_fo8tifPDDG95lmaJwbbdZfc8';
	let tabSet: 'use-prompt' | 'use-assistant' = 'use-prompt';

	let loadingContent = false;
	let errorString: string | undefined = undefined;
	async function scrape() {
		try {
			loadingContent = true;

			const response = await fetch('/api/scrape', {
				method: 'POST',
				body: JSON.stringify({ url }),
				headers: { 'content-type': 'application/json' }
			});
			appStoreInfo = (await response.json()) as AppStoreInfo;
			console.log(appStoreInfo);
		} catch (error) {
			console.error('Error extracting entities:', error);
		} finally {
			loadingContent = false;
		}
	}

	let loadingAnalysis = false;
	let loadingRefinements = false;
	let analysisResult: AnalysisResult | null = null;

	async function analyzeWithPrompt() {
		return analyze(false);
	}

	async function analyzeWithAssistant() {
		return analyze(true);
	}

	async function refine() {
		loadingRefinements = true;
		try {
			if (!appStoreInfo) {
				console.error('No app store info');
				return;
			}

			loadingAnalysis = true;
			errorString = undefined;

			const openai = openAiBrowserClient();
			const stream = await analyzetWithLLMStreaming(openai, prompt, appStoreInfo);

			const openAiHandler = new OpenAiHandler(StreamMode.StreamObjectKeyValue);
			const entityStream = openAiHandler.process(stream);

			for await (const item of entityStream) {
				console.log(item);
				refinements = item?.data;
			}
		} catch (error) {
			console.error('Error running analysis:', error);
			errorString = error.toString();
		} finally {
			loadingRefinements = false;
		}
	}

	async function analyze(useAssistant: boolean) {
		try {
			if (!appStoreInfo) {
				console.error('No app store info');
				return;
			}

			loadingAnalysis = true;
			errorString = undefined;

			const openai = openAiBrowserClient();

			if (useAssistant) {
				analysisResult = await analyzetWithAssistant(openai, assistantId, appStoreInfo);
			} else {
				analysisResult = await analyzetWithLLM(openai, prompt, appStoreInfo);
			}

			if (analysisResult?.error) {
				errorString = analysisResult.error;
			}

			refinements = JSON.parse(analysisResult?.analysis);
		} catch (error) {
			console.error('Error running analysis:', error);
			errorString = error.toString();
		} finally {
			loadingAnalysis = false;
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
						<!-- <div class="input-group-shim">AppStore:</div> -->
						<input
							bind:value={url}
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
					<h2 class="h2 mb-2 mt-4">App Store Content</h2>
					<button on:click={refine} class="variant-filled-secondary btn mt-2">Refine</button>
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
							<span class="ml-2 flex-1 text-sm text-primary-500">Loading refinements...</span>
						</span>
					{/if}
					<!-- <label >
						<span>Prompt:</span>
						<textarea bind:value={prompt} class="textarea" rows="20"></textarea>
					</label> -->

					<div class="appstore-content" transition:fade={{ duration: 1000 }}>
						<h3>Name:</h3>
						<div class="card p-2">
							Current:
							<pre class="current">{appStoreInfo.name}</pre>
							{#if refinements?.name?.refined}
								Refined:
								<pre class="refined" transition:fade>{refinements.name.refined}</pre>
							{/if}
							{#if refinements?.name?.explanation}
								Explanation:
								<p class="explanation" transition:fade>{refinements.name.explanation}</p>
							{/if}
						</div>
						<h3>Category:</h3>
						<div class="card p-2">
							Current:
							<pre class="current">{appStoreInfo.applicationCategory}</pre>
							{#if refinements?.category?.refined}
								Refined:
								<pre class="refined" transition:fade>{refinements.category.refined}</pre>
							{/if}
							{#if refinements?.category?.explanation}
								Explanation:
								<p class="explanation" transition:fade>
									{refinements.category.explanation}
								</p>
							{/if}
						</div>
						<h3>Description:</h3>
						<div class="card p-2">
							Current:
							<pre class="current">{appStoreInfo.description}</pre>
							{#if refinements?.description?.refined}
								Refined:
								<pre class="refined" transition:fade>{refinements.description.refined}</pre>
							{/if}
							{#if refinements?.description?.explanation}
								Explanation:
								<p class="explanation" transition:fade>
									{refinements.description.explanation}
								</p>
							{/if}
						</div>
						<h3>Screenshots:</h3>

						<div class="card p-2">
							<Screenshots screenshotUrls={appStoreInfo.screenshot} />
						</div>

						<div class="invisible">
							<h2 class="h2 mb-2 mt-4">Refinement</h2>
							<TabGroup>
								<Tab bind:group={tabSet} name="use-prompt" value={'use-prompt'}>Use prompt</Tab>
								<Tab bind:group={tabSet} name="use-assistant" value={'use-assistant'}>
									<span>Use assistant</span>
								</Tab>
								<svelte:fragment slot="panel">
									{#if tabSet === 'use-assistant'}
										<span class="mb-2 mt-2 bg-warning-800"
											>Assistant doesn't support screenshots yet!</span
										>
										<label>
											<span>Assistant Id:</span>
											<input
												type="text"
												bind:value={assistantId}
												class="input"
												placeholder="Assistant ID"
											/>
										</label>
										<button
											on:click={analyzeWithAssistant}
											class="variant-filled-secondary btn mt-2"
											>Use assistant
										</button>
									{:else if tabSet === 'use-prompt'}
										<label>
											<span>Prompt:</span>
											<textarea bind:value={prompt} class="textarea" rows="20"></textarea>
										</label>
										<button on:click={analyzeWithPrompt} class="variant-filled-secondary btn mt-2"
											>Use prompt</button
										>
									{/if}
								</svelte:fragment>
							</TabGroup>
						</div>
					</div>

					{#if loadingAnalysis}
						<span class="flex">
							<ProgressRadial
								value={undefined}
								stroke={100}
								meter="stroke-primary-500"
								track="stroke-primary-500/30"
								strokeLinecap="butt"
								width="w-5"
							/>
							<span class="ml-2 flex-1 text-sm text-primary-500">Loading analysis...</span>
						</span>
					{/if}
					{#if analysisResult?.analysis}
						<h2 class="h2 mb-2 mt-4">Analysis result</h2>
						<div class="card space-y-4" transition:fade={{ duration: 1000 }}>
							<p>{@html analysisResult.analysis}</p>
						</div>
						<p>LLM time: {analysisResult.time} seconds</p>
					{/if}
					{#if errorString}
						<div class="mt-2 bg-error-800 p-2 text-white">{errorString}</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.appstore-content {
		font-size: 18px;
		line-height: 1.4;
	}
	pre {
		/* white-space: normal; */
		white-space: pre-line;
		margin-bottom: 15px;
	}
	pre.current {
		background-color: theme('colors.secondary.800');
	}

	pre.refined {
		background-color: theme('colors.secondary.500');
	}

	.explanation {
		background-color: theme('colors.primary.800');
		font-size: 16px;
	}
</style>
