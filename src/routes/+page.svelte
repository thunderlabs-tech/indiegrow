<script lang="ts">
	import { ProgressRadial, TabGroup, Tab } from '@skeletonlabs/skeleton';
	import { type AppStoreInfo } from '$lib/scrapeAppstore';
	import { analysisPrompt, type AnalysisResult, type AnalysisRequest } from '$lib/analysis';
	import { fade } from 'svelte/transition';

	let url = '';

	let appStoreInfo: AppStoreInfo | null = null;

	let prompt = analysisPrompt;
	let assistantId = 'asst_fo8tifPDDG95lmaJwbbdZfc8';

	let tabSet = 'use-assistant';

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
		} catch (error) {
			console.error('Error extracting entities:', error);
		} finally {
			loadingContent = false;
		}
	}

	let loadingAnalysis = false;
	let analysisResult: AnalysisResult | null = null;

	async function analyzeWithPrompt() {
		return analyze(false);
	}

	async function analyzeWithAssistant() {
		return analyze(true);
	}

	async function analyze(useAssistant: boolean) {
		try {
			if (!appStoreInfo) {
				console.error('No app store info');
				return;
			}

			loadingAnalysis = true;

			let payload: AnalysisRequest = {
				appStoreInfo,
				assistantId: undefined,
				prompt: undefined
			};

			if (useAssistant) {
				payload.assistantId = assistantId;
			} else {
				payload.prompt = prompt;
			}

			const response = await fetch('/api/analyze', {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'content-type': 'application/json'
				}
			});

			analysisResult = (await response.json()) as AnalysisResult;
			if (analysisResult.error) {
				errorString = analysisResult.error;
			}
		} catch (error) {
			console.error('Error running analysis:', error);
			errorString = error.toString();
		} finally {
			loadingAnalysis = false;
		}
	}
</script>

<div class="container h-full mx-auto flex p-6">
	<div class="space-y-10 flex flex-col">
		<h1 class="h1">Improve your App Store presence</h1>
		<div class="space-y-2 w-full">
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
						<button class="btn variant-filled-secondary">Start </button>
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
						<span class="text-sm ml-2 text-primary-500 flex-1">Loading app store content...</span>
					</span>
				{/if}
				{#if appStoreInfo?.description}
					<h2 class="h2 mt-4 mb-2">Current App Store content</h2>

					<form class="" transition:fade={{ duration: 1000 }}>
						<label>
							<span>Category:</span>
							<input type="text" bind:value={appStoreInfo.applicationCategory} class="input" />
						</label>
						<label>
							<span>Name:</span>
							<input type="text" bind:value={appStoreInfo.name} class="input" />
						</label>
						<label>
							<span>Description:</span>
							<textarea bind:value={appStoreInfo.description} class="textarea" rows="10" />
						</label>
						<span>Screenshots:</span>

						<div class="flex gap-2">
							{#each appStoreInfo.screenshot as screenshot}
								<img src={screenshot} alt="Screenshot" />
							{/each}
						</div>

						<h2 class="h2 mt-4 mb-2">AI Analysis</h2>

						<TabGroup>
							<Tab bind:group={tabSet} name="use-assistant" value={'use-assistant'}>
								<span>Use assistant</span>
							</Tab>
							<Tab bind:group={tabSet} name="use-prompt" value={'use-prompt'}>Use prompt</Tab>
							<svelte:fragment slot="panel">
								{#if tabSet === 'use-assistant'}
									<span class="bg-warning-800 mt-2 mb-2"
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
									<button on:click={analyzeWithAssistant} class="btn variant-filled-secondary mt-2"
										>Use assistant
									</button>
								{:else if tabSet === 'use-prompt'}
									<label>
										<span>Prompt:</span>
										<textarea bind:value={prompt} class="textarea" rows="20"></textarea>
									</label>
									<button on:click={analyzeWithPrompt} class="btn variant-filled-secondary mt-2"
										>Use prompt</button
									>
								{/if}
							</svelte:fragment>
						</TabGroup>
					</form>

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
							<span class="text-sm ml-2 text-primary-500 flex-1">Loading analysis...</span>
						</span>
					{/if}
					{#if analysisResult?.analysis}
						<h2 class="h2 mt-4 mb-2">Analysis result</h2>
						<div class="space-y-4 card" transition:fade={{ duration: 1000 }}>
							<p>{@html analysisResult.analysis}</p>
						</div>
						<p>LLM time: {analysisResult.time} seconds</p>
					{/if}
					{#if errorString}
						<div class="bg-error-800 text-white p-2 mt-2">{errorString}</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
