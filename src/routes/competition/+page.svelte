<script lang="ts">
	import { project } from '$lib/project';
	import type { Competitor } from '$lib/types';
	import { srapeAppStoreInfo, srapeWebsiteInfo } from '$lib/scrapingClientSide';

	let competitorUrls = '';

	function isAppleAppStoreUrl(url: string) {
		const regex = /^https?:\/\/apps\.apple\.com\/[a-z]{2}\/app\/[^\/]+\/id\d+.*$/;
		return regex.test(url);
	}

	async function competitorFromUrl(url: string): Promise<Partial<Competitor> | undefined> {
		const competitor: Partial<Competitor> = {};

		if (isAppleAppStoreUrl(url)) {
			competitor.appStoreUrl = url;
			competitor.appStoreInfo = await srapeAppStoreInfo(url);
		} else {
			competitor.websiteUrl = url;
			competitor.websiteInfo = await srapeWebsiteInfo(url);
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

	<table class="table">
		<tr>
			<td>Name</td>
			<td>Website</td>
			<td>Description</td>
			<td>Logo</td>
			<td>Actions</td>
		</tr>

		{#each $project.competitors as competitor, idx}
			{@const ogObject = competitor.websiteInfo?.ogObject}
			{@const app = competitor.appStoreInfo}
			{@const image = (ogObject?.ogImage && ogObject.ogImage[0].url) || app?.image}
			<tr>
				<td>{ogObject?.ogSiteName || ogObject?.ogTitle}</td>
				<td>{competitor.websiteUrl}</td>
				<td>{ogObject?.ogDescription}</td>
				<td>
					<img src={image} />
				</td>
				<td>
					<button class="variant-outline-warning btn btn-sm" on:click={removeCompetitor}
						>Remove</button
					>
				</td>
			</tr>
		{/each}
	</table>
{/if}

<style lang="postcss">
	td {
		padding: 0.5rem;
	}
	tr {
		border-bottom: 1px solid #e2e8f0;
	}
</style>
