<script lang="ts">
	import { page } from '$app/stores';
	import {
		analysisPrompt,
		analyzetWithAssistant,
		analyzetWithLLM,
		type AnalysisResult
	} from '$lib/analysis';
	import { openAiBrowserClient } from '$lib/openaiBrowserClient';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import Spinner from './Spinner.svelte';

	$: currentProject = $page.data.currentProject;

	let prompt = analysisPrompt;
	let assistantId = 'asst_fo8tifPDDG95lmaJwbbdZfc8';
	let tabSet: 'use-prompt' | 'use-assistant' = 'use-prompt';

	let loadingAnalysis = false;
	let analysisResult: AnalysisResult | null = null;

	let errorString: string | undefined = undefined;

	async function analyzeWithPrompt() {
		return analyze(false);
	}

	async function analyzeWithAssistant() {
		return analyze(true);
	}

	async function analyze(useAssistant: boolean) {
		try {
			if (!currentProject.appStoreInfo) {
				console.error('No app store info');
				return;
			}

			loadingAnalysis = true;
			errorString = undefined;

			const openai = openAiBrowserClient();

			if (useAssistant) {
				analysisResult = await analyzetWithAssistant(
					openai,
					assistantId,
					currentProject.appStoreInfo
				);
			} else {
				analysisResult = await analyzetWithLLM(openai, prompt, currentProject.appStoreInfo);
			}

			if (analysisResult?.error) {
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

<div class="">
	<h2 class="h2 mb-2 mt-4">Analysis</h2>
	<TabGroup>
		<Tab bind:group={tabSet} name="use-prompt" value={'use-prompt'}>Use prompt</Tab>
		<Tab bind:group={tabSet} name="use-assistant" value={'use-assistant'}>
			<span>Use assistant</span>
		</Tab>
		<svelte:fragment slot="panel">
			{#if tabSet === 'use-assistant'}
				<span class="mb-2 mt-2 bg-warning-800">Assistant doesn't support screenshots yet!</span>
				<label>
					<span>Assistant Id:</span>
					<input type="text" bind:value={assistantId} class="input" placeholder="Assistant ID" />
				</label>
				<button on:click={analyzeWithAssistant} class="variant-filled-secondary btn mt-2"
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
{#if loadingAnalysis}
	<Spinner text="Loading analysis..." />
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
