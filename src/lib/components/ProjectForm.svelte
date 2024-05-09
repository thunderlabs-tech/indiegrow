<script lang="ts">
	import { page } from '$app/stores';
	import type { Tables } from '$lib/supabase';
	// import { scrapeAppStoreInfo, scrapeWebsiteInfo } from '$lib/scrapingClientSide';

	export let project: Partial<Tables<'projects'>>;
	export let onSave: () => void;

	$: nameValid = project?.name && project.name?.length > 2;
	let loadingContent = false;

	$: saveActive = nameValid && !loadingContent;

	async function createProject() {
		if (!nameValid) return;
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
			console.log('Project inserted', insertProjectResult.data);
			project = insertProjectResult.data;
			onSave();
		}
	}

	// async function updateAppStoreInfo() {
	// 	loadingContent = true;
	// 	project.appstore_info = null;
	// 	try {
	// 		if (project.appstore_url) {
	// 			const info = await scrapeAppStoreInfo(project.appstore_url);
	// 			project.appstore_info = JSON.stringify(info);
	// 			console.log('App store info', project.appstore_info);
	// 		}
	// 		// project.suggestions = undefined;
	// 	} catch (error) {
	// 		console.error('Error scraping app store', error);
	// 		project.appstore_info = undefined;
	// 	} finally {
	// 		loadingContent = false;
	// 	}
	// }

	// async function updateWebsiteInfo() {
	// 	project.website_info = undefined;
	// 	if (!project.website_url) {
	// 		return;
	// 	}
	// 	loadingContent = true;
	// 	try {
	//         const info =await scrapeWebsiteInfo(project.website_url);
	// 		project.website_info = JSON.stringify(info);
	// 	} catch (error) {
	// 		console.error('Error scraping app store', error);
	// 	} finally {
	// 		loadingContent = false;
	// 	}
	// }
</script>

<form class="space-y-2">
	<p>Name*:</p>
	<input bind:value={project.name} class="input" type="text" placeholder="Name of your project" />

	<p>Description:</p>
	<textarea
		bind:value={project.description}
		class="textarea"
		placeholder="What is your project about? "
	/>

	<p>Website:</p>
	<input bind:value={project.website_url} type="text" class="input" placeholder="Website URL" />
	<!-- {#if project.website_info?.ogObject !== null}
		🌐 {project.website_info.ogObject.ogTitle}:
		{project.website_info.ogObject.ogDescription}
	{/if} -->

	<p>App Store URL:</p>
	<input bind:value={project.appstore_url} type="text" class="input" placeholder="App Store URL" />
	<!-- {#if project.appstore_info !== null}
		📱 {project.appstore_info.name}
	{/if} -->

	<p>
		<button
			on:click={createProject}
			class="variant-filled-primary btn btn-sm"
			disabled={!saveActive}
			>Create project
		</button>
	</p>
</form>
