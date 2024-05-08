<script lang="ts">
	import { page } from '$app/stores';
	import { project } from '$lib/project';
	import { scrapeAppStoreInfo, scrapeWebsiteInfo } from '$lib/scrapingClientSide';
	$: nameValid = $project?.name && $project.name?.length > 2;
	$: descriptionValid = $project?.description && $project.description?.length > 10;
	let loadingContent = false;

	$: saveActive = nameValid && descriptionValid && !loadingContent;

	async function createProject() {
		if (!nameValid || !descriptionValid) return;
		const supabase = $page.data.supabase;

		const newProject = {
			user_id: $page.data?.session?.user.id,
			name: $project.name,
			description: $project.description,
			website_url: $project.websiteUrl,
			website_info: $project.websiteInfo,
			appstore_url: $project.appStoreUrl,
			appstore_info: $project.appStoreInfo
		};
		const insertProjectResult = await supabase
			.from('projects')
			.insert(newProject)
			.select('*')
			.single();

		if (insertProjectResult.error) {
			console.error('Failed to insert', newProject, insertProjectResult.error);
		} else {
			console.log('Project inserted', insertProjectResult.data);
		}
	}

	async function updateAppStoreInfo() {
		loadingContent = true;
		$project.appStoreInfo = undefined;
		try {
			if ($project.appStoreUrl) {
				$project.appStoreInfo = await scrapeAppStoreInfo($project.appStoreUrl);
				console.log('App store info', $project.appStoreInfo);
			}
			$project.suggestions = undefined;
		} catch (error) {
			console.error('Error scraping app store', error);
			$project.appStoreInfo = undefined;
		} finally {
			loadingContent = false;
		}
	}

	async function updateWebsiteInfo() {
		loadingContent = true;
		$project.websiteInfo = undefined;
		try {
			$project.websiteInfo = await scrapeWebsiteInfo($project.websiteUrl);
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
						<button
							on:click={createProject}
							class="variant-filled-primary btn btn-sm"
							disabled={!saveActive}
							>Create project
						</button>
					</p>
				</form>
			</div>
		</div>
	</div>
</div>
