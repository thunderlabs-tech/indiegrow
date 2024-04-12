<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import type { ExtractionResult } from '$lib/appstore';
	import type { AnalysisResult } from '$lib/openai';
	import { fade } from 'svelte/transition';

	let url = '';

	let appstoreContent: ExtractionResult | null = {
		content: `Discover the power of the sun with SolarWatch - the ultimate companion for outdoor enthusiasts and photographers!

	Plan your day with confidence using accurate sunrise, sunset, and twilight times, and never miss a perfect moment again with customizable solar alarms. SolarWatch's AR mode and map overlays make it easy to find the best lighting for your photos, while the app's widgets keep you informed at a glance.

	Whether you're hiking, camping, or simply enjoying nature, SolarWatch helps you live in harmony with the sun's natural rhythm. Picture yourself capturing breathtaking sunsets and golden hour moments with ease - all thanks to SolarWatch's powerful features.

	- Accurate sun-tracking for your location
	- AR mode and map overlays for perfect photo planning
	- Convenient widgets for your Home Screen, Lock Screen, and Watch
	- Customizable solar alarms for key moments
	- Plan sunlight exposure for your home or office

	Join over 500 thousand satisfied users and download SolarWatch today!`,
		screenshotUrl:
			'https://cdn.discordapp.com/attachments/1227294623190220820/1227495007972233266/image.png?ex=66289ccf&is=661627cf&hm=8ca2032cd389827c601872f5d1e26c919ae0231422e595d66f395dac81ccb80d&'
		// screenshotUrl: ''
	};

	appstoreContent = null;

	let prompt = `Act as a product marketing expert.
You will begiven the contents of an App Store page for an app and an image with the screenshots.
Analyze the app-store presense and answer the following questions:
- What is the app about?
- What are the key features?
- What are the benefits?
- Who is the target group?


Return the result in form of text with simple html markup.
Don't use any other encoding for the result.
`;

	let loadingContent = false;
	async function getContent() {
		try {
			loadingContent = true;
			const response = await fetch('/api/extract', {
				method: 'POST',
				body: JSON.stringify({
					url
				}),
				headers: {
					'content-type': 'application/json'
				}
			});

			appstoreContent = (await response.json()) as ExtractionResult;
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
					...appstoreContent,
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
				<form on:submit={getContent}>
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
				{#if appstoreContent?.content}
					<form on:submit={analyze} class="" transition:fade={{ duration: 1000 }}>
						<label>
							<span>Content:</span>
							<textarea bind:value={appstoreContent.content} class="textarea" rows="10"></textarea>
						</label>
						<label>
							<span>Screenshot:</span>

							{#if appstoreContent.screenshotUrl?.length > 0}
								<img src={appstoreContent.screenshotUrl} alt="Screenshot" />
							{/if}
							<input type="text" value={appstoreContent.screenshotUrl} class="input" />
						</label>

						<label>
							<span>Analysis Prompt:</span>
							<textarea bind:value={prompt} class="textarea" rows="10"></textarea>
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
							<h2>LLM Analysis Result:</h2>

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
