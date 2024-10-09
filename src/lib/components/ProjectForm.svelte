<script lang="ts">
	import { page } from '$app/stores';
	import { scrapeAppStoreInfo } from '$lib/scraping/scrapingClientSide';
	import type { Tables } from '$lib/supabase';
	import type { AppStoreInfo } from '$lib/types';

	export let project: Partial<Tables<'projects'>> = {
		name: undefined,
		description: undefined
	};
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
				project.name = appStoreInfo.name;
				project.description = appStoreInfo.description;
			}

			// project.suggestions = undefined;
		} catch (error) {
			console.error('Error scraping app store', error);
			appStoreInfo = undefined;
		} finally {
			loadingContent = false;
		}
	}

	const projectTypes = ['app', 'website', 'other'];
	let projectType = projectTypes[0];
</script>

<form class="space-y-2">
	<label for="projectType"
		>Project type

		<label>
			<input bind:group={projectType} type="radio" name="amount" value="app" /> App
		</label>
		<label>
			<input bind:group={projectType} type="radio" name="amount" value="website" /> Website
		</label>
		<label>
			<input bind:group={projectType} type="radio" name="amount" value="other" /> Other
		</label>
	</label>

	{#if projectType === 'app'}
		<label for="appstore_url" class="label"
			>App Store URL:
			<input
				bind:value={project.appstore_url}
				type="text"
				class="input"
				placeholder="App Store URL"
				on:change={updateAppStoreInfo}
				on:input={updateAppStoreInfo}
			/>
		</label>
	{/if}

	{#if project.name !== undefined}
		<label for="name"
			>Name
			<input type="text" id="name" class="input" bind:value={project.name} />
		</label>
	{/if}

	{#if project.description !== undefined}
		<label for="description"
			>Description
			<textarea rows={10} id="description" class="textarea" bind:value={project.description} />
		</label>
	{/if}

	<p>
		<button on:click={createProject} class="variant-filled btn btn-sm" disabled={!saveActive}
			>Create project
		</button>
	</p>
</form>
