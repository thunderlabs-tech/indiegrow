<script lang="ts">
	import type { AppStoreInfo, Competitor, ProductMarketingAnalysis, WebsiteInfo } from '$lib/types';
	import { openAiBrowserClient } from '$lib/openaiBrowserClient';
	import { OpenAiHandler, StreamMode } from 'openai-partial-stream';
	import { analyzeCompetitorWebsite, websiteAnalysisPrompt } from '$lib/competition';
	import { onMount } from 'svelte';
	import Spinner from './Spinner.svelte';
	import { fade } from 'svelte/transition';
	import { scrapeAppStoreInfo, scrapeWebsiteInfo } from '$lib/scrapingClientSide';
	import { dbclient } from '$lib/dbclient';

	export let competitor: Competitor;
	export let onRemove: (id: string) => void;

	let websiteInfo: WebsiteInfo | undefined = undefined;
	let appStoreInfo: AppStoreInfo | undefined = undefined;

	const prompt = websiteAnalysisPrompt;
	let pma: ProductMarketingAnalysis | undefined = undefined;

	let loading = false;

	async function compileProductMarketingAnalaysis() {
		if (!websiteInfo) return;

		loading = true;
		try {
			const openai = openAiBrowserClient();
			const stream = await analyzeCompetitorWebsite(openai, prompt, websiteInfo);

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

	const appStoreUrlRegex =
		/https?:\/\/(itunes\.apple\.com|apps\.apple\.com)\/[a-z]{2}\/app\/(?:[^\/]+\/)?id\d+/i;

	onMount(async () => {
		if (competitor.website_url) {
			websiteInfo = await scrapeWebsiteInfo(competitor.website_url);
		}
		if (!competitor.appstore_url && websiteInfo) {
			competitor.appstore_url = websiteInfo.html.match(appStoreUrlRegex)?.[0] || null;
		}

		if (competitor.appstore_url) {
			appStoreInfo = await scrapeAppStoreInfo(competitor.appstore_url);
		}

		if (competitor.pma) {
			console.log('pma:', competitor.pma);
			pma = JSON.parse(competitor.pma) as ProductMarketingAnalysis;
		} else {
			await compileProductMarketingAnalaysis();
			const { error } = await dbclient()
				.from('projects')
				.update({ pma: JSON.stringify(pma) })
				.eq('id', competitor.id);
			if (error) {
				console.error('Error updating competitor:', error);
			}
		}
	});

	$: ogObject = websiteInfo?.ogObject;
	$: name = ogObject?.ogSiteName || ogObject?.ogTitle;
	$: app = appStoreInfo;
	$: imageUrl =
		(app?.image && appStoreIconUrl(app.image)) || (ogObject?.ogImage && ogObject.ogImage[0].url);

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
	<td><a href={competitor.website_url} class="anchor">{name}</a></td>
	<!-- <td>
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
	</td> -->
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
