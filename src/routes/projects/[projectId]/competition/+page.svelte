<script lang="ts">
	import type { Competitor } from '$lib/types';
	import CompetitorsTable from '$lib/components/CompetitorsTable.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { page } from '$app/stores';

	import { dbclient } from '$lib/dbclient';
	import { onMount } from 'svelte';
	import { scrapeAppStoreInfo } from '$lib/scraping/scrapingClientSide';

	let competitorUrls = '';

	$: currentProject = $page.data.currentProject;

	let competitors: Competitor[] = [];

	async function loadCompetitors() {
		const { error, data } = await dbclient()
			.from('projects')
			.select('*')
			.or(`id.eq.${currentProject.id}, competitor_of.eq.${currentProject.id}`);
		if (error) {
			console.log(error);
		} else {
			competitors = data;
			console.log('loaded competitors:', competitors);
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
			}
			loadCompetitors();
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
				} else {
					loadCompetitors();
				}
			});
	}
</script>

<div class="h-full w-full p-4">
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
				<button class="variant-filled-secondary">Add</button>
			</div>
		</form>
		{#if analyzingCompetitors}
			<Spinner text="Loading competitors..." />
		{/if}
		{#if competitors}
			<CompetitorsTable {competitors} onRemove={removeCompetitor} />
		{/if}
	</div>
</div>
