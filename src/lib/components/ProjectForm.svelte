<script lang="ts">
	import { page } from '$app/stores';
	import { scrapeAppStoreInfo, scrapeWebsiteInfo } from '$lib/scraping/scrapingClientSide';
	import type { Tables } from '$lib/supabase';

	let project: Partial<Tables<'projects'>> = {
		type: 'app',
		name: undefined,
		description: undefined,
		appstore_info: undefined,
		website_info: undefined
	};
	$: project = project;
	export let onSave: () => void;

	let loadingContent = false;

	let valid = false;
	function validate() {
		switch (project.type) {
			case 'app':
				valid = project.appstore_url !== undefined && project.appstore_info !== undefined;
				break;
			case 'website':
				valid = project.website_url !== undefined && project.website_info !== undefined;
				break;
			default:
				valid = project.name !== undefined && project.description !== undefined;
		}
	}

	$: validate();
	$: saveActive = valid && !loadingContent;

	async function createProject() {
		if (!valid) return;
		const supabase = $page.data.supabase;

		const newProject = {
			...project,
			user_id: $page.data?.session?.user.id
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
		project.appstore_info = undefined;
		try {
			if (project.appstore_url) {
				const info = await scrapeAppStoreInfo(project.appstore_url);
				project.appstore_info = JSON.stringify(info);
				project.name = info.name;
				project.description = info.description;
			}

			// project.suggestions = undefined;
		} catch (error) {
			console.error('Error scraping app store', error);
			project.appstore_info = undefined;
		} finally {
			loadingContent = false;
		}
	}

	async function updateWebsiteInfo() {
		if (!project.website_url) return;
		loadingContent = true;
		project.website_info = undefined;
		try {
			const info = await scrapeWebsiteInfo(project.website_url);
			project.website_info = JSON.stringify(info);
			project.name = info.ogObject?.ogTitle;
			project.description = info.ogObject?.ogDescription;
		} catch (error) {
			console.error('Error scraping app store', error);
		} finally {
			loadingContent = false;
		}
	}
</script>

<form class="space-y-2">
	<label for="projectType"
		>Project type

		<label>
			<input bind:group={project.type} type="radio" name="amount" value="app" /> App
		</label>
		<label>
			<input bind:group={project.type} type="radio" name="amount" value="website" /> Website
		</label>
		<label>
			<input bind:group={project.type} type="radio" name="amount" value="other" /> Other
		</label>
	</label>

	{#if project.type === 'app'}
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

	{#if project.type === 'website'}
		<label for="website_url" class="label"
			>Website URL:
			<input
				bind:value={project.website_url}
				type="text"
				class="input"
				placeholder="Website URL"
				on:change={updateWebsiteInfo}
				on:input={updateWebsiteInfo}
			/>
		</label>
	{/if}

	{#if project.name !== undefined || project.type === 'other'}
		<label for="name"
			>Name
			<input
				type="text"
				id="name"
				class="input"
				bind:value={project.name}
				placeholder="Name of your project"
				on:change={validate}
				on:input={validate}
			/>
		</label>
	{/if}

	{#if project.description !== undefined || project.type === 'other'}
		<label for="description"
			>Description
			<textarea
				rows={10}
				id="description"
				class="textarea"
				bind:value={project.description}
				placeholder="Description of your project: what it does, who it's for, etc."
				on:change={validate}
				on:input={validate}
			/>
		</label>
	{/if}

	<p>
		<button on:click={createProject} class="variant-filled btn btn-sm" disabled={!saveActive}
			>Create project
		</button>
	</p>
</form>
