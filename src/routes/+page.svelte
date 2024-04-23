<script lang="ts">
	import { project } from '$lib/project';
	import type { AppStoreInfo, WebsiteInfo } from '$lib/types';
	let loadingContent = false;

	$: nameValid = $project?.name && $project.name?.length > 2;
	$: descriptionValid = $project?.description && $project.description?.length > 10;

	function initProject() {
		// if ($project.appStoreUrl) {
		// 	scrapeAppStoreInfo();
		// }
	}

	async function scrapeAppStoreInfo() {
		loadingContent = true;
		$project.appStoreInfo = undefined;
		try {
			const response = await fetch('/api/scrape/appstore', {
				method: 'POST',
				body: JSON.stringify({ url: $project.appStoreUrl }),
				headers: { 'content-type': 'application/json' }
			});
			if (response.status == 200) {
				$project.appStoreInfo = (await response.json()) as AppStoreInfo;
			} else {
				console.error(response);
			}
		} catch (error) {
			console.error('Error scraping app store', error);
			$project.appStoreInfo = undefined;
		} finally {
			loadingContent = false;
		}
	}

	async function scrapeWebsiteInfo() {
		loadingContent = true;
		$project.websiteInfo = undefined;

		try {
			const response = await fetch('/api/scrape/website', {
				method: 'POST',
				body: JSON.stringify({ url: $project.websiteUrl }),
				headers: { 'content-type': 'application/json' }
			});
			$project.websiteInfo = (await response.json()) as WebsiteInfo;
			console.log($project.appStoreInfo);
		} catch (error) {
			console.error('Error scraping app store', error);
		} finally {
			loadingContent = false;
		}
	}
</script>

<div class="container mx-auto flex h-full p-6">
	<div class="flex flex-col space-y-10">
		<h1 class="h1">What's your project?</h1>
		<div class="w-full space-y-2">
			<div class="justify-center">
				<form on:submit={initProject} class="space-y-2">
					<p>Name*:</p>
					<input
						bind:value={$project.name}
						class="input"
						type="text"
						placeholder="Name of your project"
					/>

					<p>Description*:</p>
					<textarea
						bind:value={$project.description}
						class="textarea"
						placeholder="What is your project about? "
					/>

					<p>Website:</p>
					<input
						bind:value={$project.websiteUrl}
						on:blur={scrapeWebsiteInfo}
						type="text"
						class="input"
						placeholder="Website URL"
					/>
					{#if $project.websiteInfo !== undefined}
						🌐 {$project.websiteInfo.ogObject.ogTitle}:
						{$project.websiteInfo.ogObject.ogDescription}
					{/if}

					<p>App Store URL:</p>
					<input
						bind:value={$project.appStoreUrl}
						on:blur={scrapeAppStoreInfo}
						type="text"
						class="input"
						placeholder="App Store URL"
					/>
					{#if $project.appStoreInfo !== undefined}
						📱 {$project.appStoreInfo.name}
					{/if}

					<p>
						<button
							class="variant-filled-primary btn btn-sm"
							type="submit"
							disabled={!nameValid || !descriptionValid}
						>
							Next
						</button>
					</p>
				</form>
			</div>
		</div>
	</div>
</div>
