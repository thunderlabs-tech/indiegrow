<script lang="ts">
	import type { Competitor, ProductMarketingAnalysis } from '$lib/types';
	import { openAiBrowserClient } from '$lib/openaiBrowserClient';
	import { OpenAiHandler, StreamMode } from 'openai-partial-stream';
	import { analyzeCompetitorWebsite, websiteAnalysisPrompt } from '$lib/competition';
	import { onMount } from 'svelte';
	import Spinner from './Spinner.svelte';
	import { fade } from 'svelte/transition';

	export let competitor: Competitor;
	export let onRemove: (event: Event) => void;

	const prompt = websiteAnalysisPrompt;
	$: pma = undefined;

	let loading = false;

	async function compileProductMarketingAnalaysis(competitor: Competitor) {
		loading = true;
		try {
			const openai = openAiBrowserClient();
			const stream = await analyzeCompetitorWebsite(openai, prompt, competitor);

			const openAiHandler = new OpenAiHandler(StreamMode.StreamObjectKeyValue);
			const entityStream = openAiHandler.process(stream);

			for await (const item of entityStream) {
				if (item) {
					pma = item.data as unknown as ProductMarketingAnalysis;
				}
				console.log(pma);
			}
		} catch (error) {
			console.error('Error running analysis:', error);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		await compileProductMarketingAnalaysis(competitor as Competitor);
	});

	const ogObject = competitor.websiteInfo?.ogObject;
	$: name = pma?.brandName || ogObject?.ogSiteName || ogObject?.ogTitle;
	const app = competitor.appStoreInfo;
	const imageUrl = pma?.logoUrl || (ogObject?.ogImage && ogObject.ogImage[0].url) || app?.image;

	const effect = fade;
</script>

<tr>
	<td>
		{#if loading}
			<Spinner />
		{/if}
	</td>
	<td>
		<img src={imageUrl} alt="logo" class="w-24" />
	</td>
	<td><a href={competitor.websiteUrl} class="anchor">{name}</a></td>
	<!-- <td>
		{#if app}
			<img class="h-8 w-8" src={app.image} alt={app.name} />
		{/if}
	</td> -->
	<td>
		{#if pma?.oneLinePitch}
			<span transition:effect>
				{pma.oneLinePitch}
			</span>
		{:else}
			<div class="placeholder animate-pulse" />
		{/if}
	</td>
	<td>
		{#if pma?.productType}
			<span transition:effect>
				{pma.productType}
			</span>
		{:else}
			<div class="placeholder animate-pulse" />
		{/if}
	</td>
	<td>
		{#if pma?.targetAudience}
			<span transition:effect>
				{pma.targetAudience}
			</span>
		{:else}
			<div class="placeholder animate-pulse" />
		{/if}
	</td>
	<td>
		{#if pma?.keyBenefits}
			<span transition:effect>
				{#each pma.keyBenefits as benefit}
					<span class="variant-outline-primary chip">{benefit}</span>
				{/each}
			</span>
		{:else}
			<div class="placeholder animate-pulse" />
		{/if}
	</td>
	<td>
		{#if pma?.keyFeatures}
			<span transition:effect>
				{#each pma.keyFeatures as feature}
					<span class="variant-outline-secondary chip">{feature}</span>
				{/each}
			</span>
		{:else}
			<div class="placeholder animate-pulse" />
		{/if}
	</td>

	<td>
		<button class="variant-outline-warning btn btn-sm" on:click={onRemove}>Remove</button>
	</td>
</tr>

<style lang="postcss">
	td {
		padding: 0.5rem;
	}
</style>
