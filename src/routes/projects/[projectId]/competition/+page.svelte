<script lang="ts">
	import type { Competitor } from '$lib/types';
	import { scrapeAppStoreInfo, scrapeWebsiteInfo } from '$lib/scrapingClientSide';
	import CompetitorsTable from '$lib/components/CompetitorsTable.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { page } from '$app/stores';
	import type { Tables } from '$lib/supabase';

	import { dbclient } from '$lib/dbclient';
	import { onMount } from 'svelte';
	import { load } from 'cheerio';

	let competitorUrls = '';

	$: currentProject = $page.data.currentProject;

	$: competitors = [];

	async function loadCompetitors() {
		const { error, data } = await dbclient()
			.from('projects')
			.select('*')
			.eq('competitor_of', currentProject.id);
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
		competitor.name = url;

		if (isAppleAppStoreUrl(url)) {
			competitor.appstore_url = url;
		} else {
			competitor.website_url = url;
		}

		return competitor;
	}

	async function addCompetitors() {
		analyzingCompetitors = true;
		console.log('Adding competitors:', competitorUrls);

		try {
			const urls = competitorUrls.split(' ').filter(Boolean);
			for (const url of urls) {
				const competitor = await competitorFromUrl(url.trim());
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
		} catch (error) {
			console.error('Error adding competitors:', error);
		} finally {
			analyzingCompetitors = false;
		}
	}

	function removeCompetitor(event: Event) {
		const idx = (event.target as HTMLButtonElement).closest('tr')?.rowIndex;
		// if (idx) {
		// 	project.update((project) => {
		// 		project.competitors.splice(idx - 1, 1);
		// 		return project;
		// 	});
		// }
	}

	// $: console.log($project.competitors);
</script>

<div class="h-full w-full p-6">
	<div class="flex flex-col space-y-4">
		<h1 class="h1">Competition</h1>
		<p>Let's compile a list of your competitors. Add a list of your competitor URLs.</p>
		<div class="space-y-4">
			<div class="justify-center space-x-2">
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
					{#if analyzingCompetitors}
						<Spinner text="Loading competitors..." />
					{/if}
					<div class="p-6">
						{#if competitors}
							<h2>Your Competitors:</h2>

							<CompetitorsTable {competitors} onRemove={removeCompetitor} />
						{/if}
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
