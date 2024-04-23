<script lang="ts">
	import { project } from '$lib/project';
	import type { Competitor } from '$lib/types';
	import { scrapeAppStoreInfo, scrapeWebsiteInfo } from '$lib/scrapingClientSide';
	import CompetitorsTable from '$lib/components/CompetitorsTable.svelte';

	let competitorUrls = '';

	// const appStoreUrlRegex = /https?:\/\/apps|itunes\.apple\.com\/[a-z]{2}\/app\/[^\/]+\/id\d+/i;
	const appStoreUrlRegex =
		/https?:\/\/(itunes\.apple\.com|apps\.apple\.com)\/[a-z]{2}\/app\/(?:[^\/]+\/)?id\d+/i;

	function isAppleAppStoreUrl(url: string) {
		return appStoreUrlRegex.test(url);
	}

	async function competitorFromUrl(url: string): Promise<Partial<Competitor> | undefined> {
		const competitor: Partial<Competitor> = {};

		if (isAppleAppStoreUrl(url)) {
			competitor.appStoreUrl = url;
			competitor.appStoreInfo = await scrapeAppStoreInfo(url);
		} else {
			competitor.websiteUrl = url;
			competitor.websiteInfo = await scrapeWebsiteInfo(url);

			competitor.appStoreUrl = competitor.websiteInfo?.html.match(appStoreUrlRegex)?.[0];

			if (competitor.appStoreUrl) {
				competitor.appStoreInfo = await scrapeAppStoreInfo(competitor.appStoreUrl);
			}
		}

		return competitor;
	}

	async function addCompetitors() {
		const urls = competitorUrls.split(' ').filter(Boolean);
		for (const url of urls) {
			const competitor = await competitorFromUrl(url);
			if (competitor) {
				project.update((project) => {
					project.competitors = project.competitors || [];
					project.competitors.push(competitor as Competitor);
					return project;
				});
			}
		}
	}

	function removeCompetitor(event: Event) {
		const idx = (event.target as HTMLButtonElement).closest('tr')?.rowIndex;
		if (idx) {
			project.update((project) => {
				project.competitors.splice(idx - 1, 1);
				return project;
			});
		}
	}

	$: console.log($project.competitors);
</script>

<div class="container mx-auto flex h-full p-6">
	<div class="flex flex-col space-y-10">
		<h1 class="h1">Competion analysis</h1>
		<p>Let's compile a list of your competitors. Add a list of your competitor URLs.</p>
		<div class="w-full space-y-2">
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
				</form>
			</div>
		</div>
	</div>
</div>

{#if $project.competitors}
	<h2>Your Competitors:</h2>

	<CompetitorsTable competitors={$project.competitors} onRemove={removeCompetitor} />
{/if}
