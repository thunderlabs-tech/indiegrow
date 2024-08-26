<script lang="ts">
	import { page } from '$app/stores';
	import { scrapeAppStoreInfo } from '$lib/scraping/scrapingClientSide';
	import type { Tables } from '$lib/supabase';
	import type { AppStoreInfo } from '$lib/types';

	export let project: Partial<Tables<'projects'>>;
	export let onSave: () => void;

	let appStoreInfo: AppStoreInfo | undefined = undefined;

	$: projectValid = project?.appstore_url && appStoreInfo !== undefined;
	let loadingContent = false;

	$: saveActive = projectValid && !loadingContent;

	async function createProject() {
		if (!projectValid) return;
		const supabase = $page.data.supabase;

		const newProject = {
			...project,
			user_id: $page.data?.session?.user.id,
			appstore_info: JSON.stringify(appStoreInfo),
			name: appStoreInfo.name
		};
		const insertProjectResult = await supabase
			.from('projects')
			.insert(newProject)
			.select('*')
			.single();

		if (insertProjectResult.error) {
			console.error('Failed to insert', newProject, insertProjectResult.error);
		} else {
			project = insertProjectResult.data;
			onSave();
		}
	}

	async function updateAppStoreInfo() {
		loadingContent = true;
		appStoreInfo = undefined;
		try {
			if (project.appstore_url) {
				appStoreInfo = await scrapeAppStoreInfo(project.appstore_url);
			}
			// project.suggestions = undefined;
		} catch (error) {
			console.error('Error scraping app store', error);
			appStoreInfo = undefined;
		} finally {
			loadingContent = false;
		}
	}
</script>

<form class="space-y-2">
	<p>App Store URL:</p>
	<input
		bind:value={project.appstore_url}
		type="text"
		class="input"
		placeholder="App Store URL"
		on:change={updateAppStoreInfo}
		on:input={updateAppStoreInfo}
	/>
	{#if project?.appstore_info !== undefined}
		📱 {project.appstore_info?.name}
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
