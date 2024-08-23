<script lang="ts">
	import type { Competitor } from '$lib/types';
	import CompetitorsTable from '$lib/components/CompetitorsTable.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { page } from '$app/stores';

	import { dbclient } from '$lib/dbclient';
	import { onMount } from 'svelte';
	import { scrapeAppStoreInfo } from '$lib/scraping/scrapingClientSide';
	import { openAiBrowserClient } from '$lib/openaiBrowserClient';
	import { compileProductMarketingAnalysis, findCompetitorsPrompt } from '$lib/competition';
	import { OpenAiHandler, StreamMode } from 'openai-partial-stream';

	let competitorUrls = '';

	$: currentProject = $page.data.currentProject;

	let competitors: Competitor[] = [];

	async function loadCompetitors() {
		if (!currentProject) {
			console.log('No current project set');
			return;
		}
		const { error, data } = await dbclient()
			.from('projects')
			.select('*')
			.or(`id.eq.${currentProject.id}, competitor_of.eq.${currentProject.id}`);
		if (error) {
			console.log(error);
		} else {
			competitors = data;
		}
	}

	onMount(async () => {
		loadCompetitors();
	});

	let analyzingCompetitors = false;
	const appStoreUrlRegex =
		/https?:\/\/(itunes\.apple\.com|apps\.apple\.com)\/[a-z]{2}\/app\/(?:[^\/]+\/)?id\d+/i;

	function sanitizeUrl(url: string): string {
		let sanitized = url.trim();
		sanitized = sanitized.startsWith('http') ? sanitized : `https://${sanitized}`;
		return sanitized;
	}

	function isAppleAppStoreUrl(url: string) {
		return appStoreUrlRegex.test(url);
	}

	async function competitorFromUrl(rawUrl: string): Promise<Partial<Competitor> | undefined> {
		const competitor: Partial<Competitor> = {};

		const url = sanitizeUrl(rawUrl);

		if (!isAppleAppStoreUrl(url)) {
			console.error("URL doesn't match Apple App Store URL pattern:", url);
			return undefined;
		}
		competitor.appstore_url = url;
		const appStoreInfo = await scrapeAppStoreInfo(competitor.appstore_url);

		competitor.name = appStoreInfo.name;
		competitor.description = appStoreInfo.description;
		competitor.appstore_info = JSON.stringify(appStoreInfo);

		return competitor;
	}

	async function addCompetitor(competitor: Partial<Competitor>) {
		const { error } = await dbclient()
			.from('projects')
			.insert({
				user_id: currentProject.user_id,
				competitor_of: currentProject.id,
				...competitor
			})
			.select('*');
		if (error) {
			console.log('error inserting competitor', error);
		}
		competitors = [...competitors, competitor];
	}

	async function addCompetitors() {
		analyzingCompetitors = true;
		console.log('Adding competitors:', competitorUrls);

		try {
			const urls = competitorUrls.split(' ').filter(Boolean);
			for (const url of urls) {
				const competitor = await competitorFromUrl(url.trim());
				if (!competitor) {
					continue;
				}
				await addCompetitor(competitor);
			}
			competitorUrls = '';
		} catch (error) {
			console.error('Error adding competitors:', error);
		} finally {
			analyzingCompetitors = false;
		}
	}

	function removeCompetitor(id: string) {
		dbclient()
			.from('projects')
			.delete()
			.eq('id', id)
			.then((res) => {
				if (res.error) {
					console.error('Error deleting competitor:', res.error);
				}
			});
		competitors = competitors.filter((competitor) => competitor.id !== id);
	}

	async function searchAppStore(term: string): Promise<string[]> {
		const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&limit=10&country=DE`;
		try {
			const response = await fetch(endpoint);
			const data = await response.json();
			console.log('data', data);
			return data.results.map((app: any) => app.trackViewUrl);
		} catch (error) {
			console.error(`Error searching for term "${term}":`, error);
			return [];
		}
	}

	async function findCompetitors() {
		console.log('finding competitors');
		console.log('current project', currentProject.appstore_info.description);

		let data: string[] = [];
		const info = JSON.parse(currentProject.appstore_info);
		analyzingCompetitors = true;
		try {
			const openai = openAiBrowserClient();
			const stream = await compileProductMarketingAnalysis(openai, findCompetitorsPrompt, info);

			const openAiHandler = new OpenAiHandler(StreamMode.StreamObjectKeyValue);
			const entityStream = openAiHandler.process(stream);

			for await (const item of entityStream) {
				if (item) {
					data = item.data; // as unknown as ProductMarketingAnalysis;
					console.log('partial response: ', item.data);
				}
			}

			const competitorUrls = await searchAppStore(data.search_term);

			const allCompetitors = await Promise.all(competitorUrls.map(competitorFromUrl));

			const topCompetitors = allCompetitors.sort((a, b) => {
				const aReviewCount = JSON.parse(a?.appstore_info || '{}').aggregateRating?.reviewCount || 1;
				const bReviewCount = JSON.parse(b?.appstore_info || '{}').aggregateRating?.reviewCount || 1;
				return bReviewCount - aReviewCount;
			});
			topCompetitors.forEach((competitor) => {
				console.log('adding competitor:', competitor);
				if (competitor?.name !== currentProject.name) {
					addCompetitor(competitor);
				}
			});

			console.log('topCompetitors:', topCompetitors);
		} catch (error) {
			console.error('Error running analysis:', error);
		} finally {
			analyzingCompetitors = false;
		}
	}
</script>

<div class="mx-auto max-w-5xl space-y-8 p-4 md:p-12">
	<div class="flex flex-col space-y-4">
		<h1 class="h1">Competition</h1>
		<p>Let's compile a list of your competitors. Add a list of your competitor URLs.</p>

		<form on:submit={addCompetitors}>
			<div class="input-group input-group-divider grid-cols-[1fr_auto]">
				<input
					bind:value={competitorUrls}
					class="input"
					type="text"
					placeholder="URLs of your competitors"
				/>
				<button class="variant-filled-secondary">Add manually</button>
			</div>
		</form>

		<p>
			<button class="variant-filled-secondary btn btn-md" on:click={findCompetitors}
				>Automatic search</button
			>
		</p>

		{#if analyzingCompetitors}
			<Spinner text="Loading competitors..." />
		{/if}
		{#if competitors}
			<CompetitorsTable {competitors} onRemove={removeCompetitor} />
		{/if}
	</div>
</div>
