<script lang="ts">
	import { project } from '$lib/project';
	import { srapeAppStoreInfo, srapeWebsiteInfo } from '$lib/scrapingClientSide';

	$: nameValid = $project?.name && $project.name?.length > 2;
	$: descriptionValid = $project?.description && $project.description?.length > 10;

	let loadingContent = false;

	async function updateAppStoreInfo() {
		if (!$project.appStoreUrl) return;
		loadingContent = true;
		$project.appStoreInfo = undefined;
		try {
			$project.appStoreInfo = await srapeAppStoreInfo($project.appStoreUrl);
		} catch (error) {
			console.error('Error scraping app store', error);
			$project.appStoreInfo = undefined;
		} finally {
			loadingContent = false;
		}
	}

	async function updateWebsiteInfo() {
		if (!$project.websiteUrl) return;
		loadingContent = true;
		$project.websiteInfo = undefined;
		try {
			$project.websiteInfo = await srapeWebsiteInfo($project.websiteUrl);
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
				<form class="space-y-2">
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
						on:blur={updateWebsiteInfo}
						type="text"
						class="input"
						placeholder="Website URL"
					/>
					{#if $project.websiteInfo?.ogObject !== undefined}
						🌐 {$project.websiteInfo.ogObject.ogTitle}:
						{$project.websiteInfo.ogObject.ogDescription}
					{/if}

					<p>App Store URL:</p>
					<input
						bind:value={$project.appStoreUrl}
						on:blur={updateAppStoreInfo}
						type="text"
						class="input"
						placeholder="App Store URL"
					/>
					{#if $project.appStoreInfo !== undefined}
						📱 {$project.appStoreInfo.name}
					{/if}

					<p>
						{#if !loadingContent && nameValid && descriptionValid}
							<a href="/competition" class="variant-filled-primary btn btn-sm"
								>Next: your competition
							</a>
						{/if}
					</p>
				</form>
			</div>
		</div>
	</div>
</div>
