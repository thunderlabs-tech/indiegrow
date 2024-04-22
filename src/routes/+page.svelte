<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { type AppStoreInfo } from '$lib/scrapeAppstore';
	import { project } from '$lib/project';

	let loadingContent = false;

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
					<AppStoreInfo />
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	h3 {
		font-size: 24px;
		margin-top: 1em;
		margin-bottom: 0.3em;
	}
	.appstore-content {
		font-size: 18px;
		line-height: 1.4;
	}
	pre {
		/* white-space: normal; */
		white-space: pre-line;
		margin-bottom: 15px;
		margin-top: 3px;
		padding: 8px;
	}
	pre.current {
		background-color: theme('colors.secondary.800');
	}

	pre.suggestion {
		background-color: theme('colors.secondary.500');
	}

	.explanation {
		background-color: theme('colors.primary.800');
		font-size: 16px;
		margin-top: 3px;
		padding: 8px;
	}
</style>
