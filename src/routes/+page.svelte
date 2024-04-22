<script lang="ts">
	import { ProgressRadial, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { type AppStoreInfo } from '$lib/scrapeAppstore';
	import ImproveAppStoreInfo from '$lib/components/ImproveAppStoreInfo.svelte';
	import CompetitionAnalysis from '$lib/components/CompetitionAnalysis.svelte';
	import { project } from '$lib/project';

	let loadingContent = false;
	let tabSet: 'improve' | 'competition' = 'improve';

	async function scrape() {
		$project.appStoreInfo = undefined;
		$project.suggestions = undefined;

		try {
			loadingContent = true;

			const response = await fetch('/api/scrape', {
				method: 'POST',
				body: JSON.stringify({ url: $project.url }),
				headers: { 'content-type': 'application/json' }
			});
			$project.appStoreInfo = (await response.json()) as AppStoreInfo;

			console.log($project.appStoreInfo);
		} catch (error) {
			console.error('Error extracting entities:', error);
		} finally {
			loadingContent = false;
		}
	}
</script>

<div class="container mx-auto flex h-full p-6">
	<div class="flex flex-col space-y-10">
		<h1 class="h1">Improve your App Store presence</h1>
		<div class="w-full space-y-2">
			<div class="justify-center space-x-2">
				<form on:submit={scrape}>
					<div class="input-group input-group-divider grid-cols-[1fr_auto]">
						<input
							bind:value={$project.url}
							class="input"
							type="text"
							placeholder="Enter your appstore URL"
						/>
						<button class="variant-filled-secondary btn">Start </button>
					</div>
				</form>
			</div>
			<div>
				{#if loadingContent}
					<span class="flex">
						<ProgressRadial
							value={undefined}
							stroke={100}
							meter="stroke-primary-500"
							track="stroke-primary-500/30"
							strokeLinecap="butt"
							width="w-5"
						/>
						<span class="ml-2 flex-1 text-sm text-primary-500">Loading app store content...</span>
					</span>
				{/if}

				{#if $project}
					<TabGroup>
						<Tab bind:group={tabSet} name="improve" value={'improve'}>Improve content</Tab>
						<Tab bind:group={tabSet} name="competition" value={'competition'}
							>Competition analysis
						</Tab>
						<svelte:fragment slot="panel">
							{#if tabSet === 'improve'}
								<ImproveAppStoreInfo />
							{:else if tabSet === 'competition'}
								<CompetitionAnalysis />
							{/if}
						</svelte:fragment>
					</TabGroup>
				{/if}
			</div>
		</div>
	</div>
</div>
