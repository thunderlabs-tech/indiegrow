<script lang="ts">
	import Screenshots from '$lib/components/Screenshots.svelte';
	import { ProgressRadial, TabGroup, Tab } from '@skeletonlabs/skeleton';
	import { type AppStoreInfo } from '$lib/scrapeAppstore';
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
	import { parse } from 'best-effort-json-parser';

	let url: string | undefined =
		'https://apps.apple.com/tt/app/connected-living-messenger/id1543400123?platform=iphone';
	url = undefined;

	let appStoreInfo: AppStoreInfo | undefined = {
		'@context': 'http://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Connected Living Messenger',
		description:
			"Connected Living Messenger is a chat app for neighbors who live in the same apartment building or complex. Start group chats shared with everyone in your community or send private direct messages. New members join your community by invite only, keeping it safe and secure.\n\nWith Connected Living Messenger, you can:\n\n- Message your neighbors without sharing your phone number\n- Join group channels for public discussions\n- Automatically translate messages into your preferred language (German or English)\n- Create a user profile that is only visible to people in your building\n- Use the building directory in the app to find someone by name or floor\n\nGETTING STARTED\n\nTo get started simply install the app and you'll be prompted for an invite code to join an existing community. Otherwise you can create a new community and we'll help you get your neighbors on board!\n\nTake a look at our founder page for more information on starting a new community: https://connectedliving.chat/founder\n\nMISSION\n\nOur mission is to make urban life sustainable. By connecting people who live together we can make our lives a little bit more sustainable by:\n\n1. AVOIDING UNNECESSARY PURCHASES\n   Asking to borrow something instead of buying it reduces emissions and saves you money and space at home\n\n2. REDUCING FOOD WASTE\n   Sharing food when you have more than you need reduces waste\n\n3. FIGHTING ISOLATION\n   Loneliness is a growing health epidemic. People who are connected, however, report lower levels of anxiety and depression\n\n4. BUILDING RESILIENT COMMUNITIES\n   The smallest step we can take towards building a community is being able to talk to each other. If we can build that first connection, we can help transform a group of people in the same place into a community making us all more resilient in crises\n\nLearn more on our mission page https://connectedliving.chat/mission\n\nQUESTIONS, COMMENTS?\n\nIf you have any questions or you get stuck on anything, don't hesitate to reach out to us at support@connectedliving.chat. We're happy to help!",
		screenshot: [
			'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/59/97/17/59971761-64a1-53c8-e942-3a4aba1d22c4/6cf19a79-0601-41b2-94a1-d8767333bfb8_screenshot1.jpeg/300x0w.jpg',
			'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/80/91/b0/8091b0eb-030f-c895-dd4c-ceeac21c5758/a4305911-59cd-4943-84a1-633e747158f7_screenshot2.jpeg/300x0w.jpg',
			'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/39/be/d8/39bed8a0-bcd0-43f5-c166-7caf04aae242/292d5a1f-f926-4a1e-9017-9b1f98f4aed0_screenshot3.jpeg/300x0w.jpg',
			'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource116/v4/4e/a7/2c/4ea72cdb-0b28-5687-27f4-d9119af35edf/bcf3711a-3ae5-4d7a-a669-133b9c0d05a9_screenshot4.jpeg/300x0w.jpg',
			'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource116/v4/15/4c/98/154c9815-7f9c-8f12-0d0f-52896a8b11c3/ae5fb58f-65df-4efb-bddf-8cc94f0ad0e0_screenshot5.jpeg/300x0w.jpg',
			'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/72/25/9f/72259fad-a76e-69b3-5d96-72220a7804e6/058d3d51-e959-4561-a572-55a1a4c63211_screenshot6.jpeg/300x0w.jpg'
		],
		image:
			'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/35/43/ba/3543ba37-6e39-6f10-5527-4611f6295f93/AppIcon-1x_U007epad-85-220.png/1200x630wa.png',
		applicationCategory: 'Social Networking',
		datePublished: '2 Apr 2021',
		operatingSystem: 'Requires iOS 13.0 or later. Compatible with iPhone, iPad and iPod touch.',
		author: {
			'@type': 'Person',
			name: 'Thunder Labs GmbH',
			url: 'https://apps.apple.com/tt/developer/thunder-labs-gmbh/id1543400125'
		},
		offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'free' }
	};
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

			let partialResult = '';
			for await (const chunk of stream) {
				const chunkDelta: string = chunk.choices[0]?.delta?.content || '';
				partialResult += chunkDelta;
				if (partialResult.length > 10) {
					try {
						const newRefinements = parse(partialResult);
						refinements = newRefinements;
					} catch (error) {
						console.error('Error parsing partial result:', error);
					}
				}
				console.log('Partial result:', partialResult);
			}

			// refinements = JSON.parse(partialResult);
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
