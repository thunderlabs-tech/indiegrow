<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { type AppStoreInfo } from '$lib/scrapeAppstore';
	import { analysisPrompt, type AnalysisResult } from '$lib/analysis';
	import { fade } from 'svelte/transition';

	let url = '';

	let appStoreInfo: AppStoreInfo | null = null;

	let prompt = analysisPrompt;
	let loadingContent = false;
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
	async function analyze() {
		try {
			loadingAnalysis = true;
			const response = await fetch('/api/analyze', {
				method: 'POST',
				body: JSON.stringify({
					appStoreInfo,
					prompt
				}),
				headers: {
					'content-type': 'application/json'
				}
			});

			analysisResult = (await response.json()) as AnalysisResult;
		} catch (error) {
			console.error('Error extracting entities:', error);
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

					<form on:submit={analyze} class="" transition:fade={{ duration: 1000 }}>
						<label>
							<span>Description:</span>
							<textarea bind:value={appStoreInfo.description} class="textarea" rows="10"></textarea>
						</label>
						<span>Screenshots:</span>

						<div class="flex gap-2">
							{#each appStoreInfo.screenshot as screenshot}
								<img src={screenshot} alt="Screenshot" />
							{/each}
						</div>

						<h2 class="h2 mt-4 mb-2">AI Analysis</h2>
						<label>
							<span>Analysis Prompt:</span>
							<textarea bind:value={prompt} class="textarea" rows="20"></textarea>
						</label>
						<button class="btn variant-filled-secondary">Analyze</button>
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
						<div class="space-y-4 card" transition:fade={{ duration: 1000 }}>
							<h2 class="h2 mt-4 mb-2">Analysis result</h2>

							<p>{@html analysisResult.analysis}</p>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
