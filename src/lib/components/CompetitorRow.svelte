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
	const imageUrl =
		pma?.logoUrl ||
		(app?.image && appStoreIconUrl(app.image)) ||
		(ogObject?.ogImage && ogObject.ogImage[0].url);

	// https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/35/43/ba/3543ba37-6e39-6f10-5527-4611f6295f93/AppIcon-1x_U007epad-85-220.png/540x540bb.jpg
	//is1-ssl.mzstatic.com/image/thumb/Purple211/v4/30/22/8e/30228eb1-eccd-bf23-0cf0-6361301e803e/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/270x270.png

	function appStoreIconUrl(imgUrl: string): string {
		// transform the url from the following format: https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/30/22/8e/30228eb1-eccd-bf23-0cf0-6361301e803e/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/1200x630wa.png
		// to the following: https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/30/22/8e/30228eb1-eccd-bf23-0cf0-6361301e803e/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/270x270.png
		const parts = imgUrl.split('/');
		parts.pop();
		const size = 270;
		const newLastPart = `${size}x${size}.png`;
		parts.push(newLastPart);
		return parts.join('/');
	}

	const effect = fade;
</script>

<tr>
	<td>
		{#if loading}
			<Spinner />
		{/if}
	</td>
	<td>
		<!-- <img src={imageUrl} alt="logo" class="w-24" /> -->
		<a
			href={competitor.appStoreUrl}
			style="width: 85px; height: 85px; border-radius: 22%; overflow: hidden; display: inline-block; vertical-align: middle;"
			><img
				src={imageUrl}
				alt="Connected Living Messenger"
				style="width: 85px; height:85px;  border-radius: 22%; overflow: hidden; display: inline-block; vertical-align: middle;"
			/></a
		>
	</td>
	<td><a href={competitor.websiteUrl} class="anchor">{name}</a></td>
	<td>
		{#if app}
			<a
				href={competitor.appStoreUrl}
				style="display: inline-block; overflow: hidden; border-radius: 13px; width: 80px;"
				><img
					src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1617321600"
					alt="Download on the App Store"
					style="border-radius: 20px;  height: 83px;"
				/></a
			>
		{/if}
	</td>
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
		{#if pma?.positioning}
			<span transition:effect>
				<i>{pma.positioning}</i>
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
