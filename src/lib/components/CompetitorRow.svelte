<script lang="ts">
	import type { Competitor, ProductMarketingAnalysis } from '$lib/types';
	import { openAiBrowserClient } from '$lib/openaiBrowserClient';
	import { OpenAiHandler, StreamMode } from 'openai-partial-stream';
	import { compileProductMarketingAnalysis, appStorePMAAnalysisPrompt } from '$lib/competition';
	import { onMount } from 'svelte';
	import Spinner from './Spinner.svelte';
	import { fade } from 'svelte/transition';
	import { dbclient } from '$lib/dbclient';

	export let competitor: Competitor;
	export let onRemove: (id: string) => void;

	const prompt = appStorePMAAnalysisPrompt;
	let pma: ProductMarketingAnalysis | undefined = undefined;

	let loadingPma = false;

	async function compileProductMarketingAnalaysis() {
		if (!competitor.appstore_info) return;

		const info = JSON.parse(competitor.appstore_info);
		loadingPma = true;
		try {
			const openai = openAiBrowserClient();
			const stream = await compileProductMarketingAnalysis(openai, prompt, info);

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
			loadingPma = false;
		}
	}

	async function updatePMA() {
		if (competitor.pma) {
			console.log('pma:', competitor.pma);
			pma = JSON.parse(competitor.pma) as ProductMarketingAnalysis;
		} else {
			await compileProductMarketingAnalaysis();
			const { error } = await dbclient()
				.from('projects')
				.update({
					pma: JSON.stringify(pma)
				})
				.eq('id', competitor.id);
			if (error) {
				console.error('Error updating competitor:', error);
			}
		}
	}
	onMount(async () => {
		await updatePMA();
	});

	$: name = competitor.name;
	$: app = JSON.parse(competitor.appstore_info) as AppStoreInfo;
	$: imageUrl = app?.image && appStoreIconUrl(app.image);

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

<tr class="!border-t-2">
	<td>
		{#if loadingPma}
			<Spinner />
		{/if}
	</td>
	<td>
		<p class="mt-2">
			{#if imageUrl}
				<a
					href={competitor.appstore_url}
					style="width: 85px; height: 85px; border-radius: 22%; overflow: hidden; display: inline-block; vertical-align: middle;"
				>
					<img
						src={imageUrl}
						alt={name}
						style="width: 85px; height:85px;  border-radius: 22%; overflow: hidden; display: inline-block; vertical-align: middle;"
					/></a
				>
			{/if}
		</p>
	</td>
	<td><a href={competitor.appstore_url} class="anchor">{name}</a></td>
	<td>{app.applicationCategory}</td>
	<td>
		{#if app?.screenshot}
			<span transition:effect>
				<div class="grid h-24 w-48 grid-cols-[auto_1fr_auto] items-center gap-0">
					<div class="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-2">
						{#each app.screenshot as url}
							<img class="h-24 rounded-container-token" alt="screenshot" src={url} loading="lazy" />
						{/each}
					</div>
				</div>
			</span>
		{/if}
	</td>
	<td>
		{#if app?.aggregateRating}
			<span transition:effect>
				<div class="grid h-24 w-48 grid-cols-[auto_1fr_auto] items-center gap-0">
					<div class="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-2">
						{app.aggregateRating.ratingValue} ({app.aggregateRating.reviewCount} reviews)
					</div>
				</div>
			</span>
		{:else}
			No reviews.
		{/if}
	</td>
	<td>
		{#if pma?.oneLinePitch}
			<span transition:effect>
				{pma.oneLinePitch}
			</span>
		{:else if loadingPma}
			<div class="placeholder animate-pulse" />
		{/if}
	</td>
	<td>
		{#if pma?.productType}
			<span transition:effect>
				{pma.productType}
			</span>
		{:else if loadingPma}
			<div class="placeholder animate-pulse" />
		{/if}
	</td>
	<td>
		{#if pma?.targetAudience}
			<span transition:effect>
				{pma.targetAudience}
			</span>
		{:else if loadingPma}
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
		{:else if loadingPma}
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
		{:else if loadingPma}
			<div class="placeholder animate-pulse" />
		{/if}
	</td>
	<td>
		{#if pma?.positioning}
			<span transition:effect>
				<i>{pma.positioning}</i>
			</span>
		{:else if loadingPma}
			<div class="placeholder animate-pulse" />
		{/if}
	</td>

	<td>
		<button class="variant-outline-warning btn btn-sm" on:click={onRemove(competitor.id)}
			>Remove</button
		>
	</td>
</tr>

<style lang="postcss">
	td {
		padding: 0.5rem;
	}
</style>
