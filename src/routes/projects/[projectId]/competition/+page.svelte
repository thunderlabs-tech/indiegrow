<script lang="ts">
	import type { Competitor } from '$lib/types';
	import CompetitorsTable from '$lib/components/CompetitorsTable.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { page } from '$app/stores';

	import { dbclient } from '$lib/dbclient';
	import { onMount } from 'svelte';
	import { scrapeAppStoreInfo } from '$lib/scraping/scrapingClientSide';
	import { openAiBrowserClient } from '$lib/openaiBrowserClient';
	import { competitorSearchTerms, findCompetitorsPrompt } from '$lib/competition';
	import { OpenAiHandler, StreamMode } from 'openai-partial-stream';
	import Breadcrumbs from '$lib/components/layout/Breadcrumbs.svelte';

	let competitorUrls = '';

	$: currentProject = $page.data.currentProject;

	let competitors: Competitor[] = [];

	async function loadCompetitors() {
		if (!currentProject) {
			console.error('No current project set');
			return;
		}
		const { error, data } = await dbclient()
			.from('projects')
			.select('*')
			.or(`id.eq.${currentProject.id}, competitor_of.eq.${currentProject.id}`)
			.is('relevant', null);
		if (error) {
			console.error('Error loading competitors:', error);
		} else {
			competitors = data;
		}
	}

	onMount(async () => {
		loadCompetitors();
	});

	let loadingCompetitors = false;
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

	async function competitorExists(appstore_url: string) {
		const { data, error: existingError } = await dbclient()
			.from('projects')
			.select('*')
			.eq('competitor_of', currentProject.id)
			.eq('appstore_url', appstore_url);
		if (existingError) {
			console.error('Error checking for existing competitor:', existingError);
			return false;
		}
		return data && data.length > 0;
	}

	async function addCompetitor(competitor: Partial<Competitor>) {
		if (await competitorExists(competitor.appstore_url)) {
			console.info('competitor already exists:', competitor.appstore_url);
			return;
		}

		const insertData = {
			user_id: currentProject.user_id,
			competitor_of: currentProject.id,
			...competitor
		};

		const { data: newCompetitor, error } = await dbclient()
			.from('projects')
			.insert(insertData)
			.select('*')
			.single();
		if (error) {
			console.error('Error inserting competitor:', error);
		} else {
			competitors = [...competitors, newCompetitor];
		}
	}

	async function addCompetitors() {
		loadingCompetitors = true;

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
			loadingCompetitors = false;
		}
	}

	function markIrrelevant(id: string) {
		dbclient()
			.from('projects')
			.update({ relevant: false })
			.eq('id', id)
			.then((res) => {
				if (res.error) {
					console.error('Error marking competitor as irrelevant:', res.error);
				}
			});
		competitors = competitors.filter((competitor) => competitor.id !== id);
	}

	async function searchAppStore(term: string): Promise<string[]> {
		const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&limit=10&country=DE`;
		try {
			const response = await fetch(endpoint);
			const data = await response.json();
			return data.results.map((app: any) => app.trackViewUrl);
		} catch (error) {
			console.error(`Error searching for term "${term}":`, error);
			return [];
		}
	}

	async function findCompetitors() {
		let data: string[] = [];
		const info = JSON.parse(currentProject.appstore_info);
		loadingCompetitors = true;
		try {
			const openai = openAiBrowserClient();
			const stream = await competitorSearchTerms(openai, findCompetitorsPrompt, info);

			const openAiHandler = new OpenAiHandler(StreamMode.StreamObjectKeyValue);
			const entityStream = openAiHandler.process(stream);

			for await (const item of entityStream) {
				if (item) {
					data = item.data; // as unknown as ProductMarketingAnalysis;
				}
			}
			console.log('using search terms', data.search_terms);

			const allSearchResults = await Promise.all(data.search_terms.map(searchAppStore));

			// flatten the array:
			const competitorUrls = allSearchResults.flat();

			const allCompetitors = await Promise.all(competitorUrls.map(competitorFromUrl));

			const uniqueCompetitors = allCompetitors.filter(
				async (competitor, index, self) =>
					index === self.findIndex((t) => t?.appstore_url === competitor?.appstore_url) &&
					!(await competitorExists(competitor?.appstore_url))
			);

			const sortedCompetitors = uniqueCompetitors.sort((a, b) => {
				const aReviewCount = JSON.parse(a?.appstore_info || '{}').aggregateRating?.reviewCount || 1;
				const bReviewCount = JSON.parse(b?.appstore_info || '{}').aggregateRating?.reviewCount || 1;
				return bReviewCount - aReviewCount;
			});
			sortedCompetitors.slice(0, 10).forEach((competitor) => {
				if (competitor?.name !== currentProject.name) {
					addCompetitor(competitor);
				}
			});
		} catch (error) {
			console.error('Error running analysis:', error);
		} finally {
			loadingCompetitors = false;
		}
	}
</script>

<div class="mx-auto max-w-5xl space-y-8 p-4 md:p-12">
	<Breadcrumbs />
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
				<button class="variant-filled">Add manually</button>
			</div>
		</form>

		<p>
			<button class="variant-filled btn btn-md" on:click={findCompetitors}>Automatic search</button>
		</p>

		{#if loadingCompetitors}
			<Spinner text="Loading competitors..." />
		{/if}

		{#if competitors}
			<CompetitorsTable {competitors} onRemove={markIrrelevant} />
		{/if}
	</div>
	{#if competitors.length > 1}
		{#if loadingCompetitors}
			<Spinner text="Loading competitors..." />
		{/if}
		<button class="variant-filled btn btn-md" on:click={findCompetitors}
			>Find more competitors</button
		>
	{/if}
</div>
