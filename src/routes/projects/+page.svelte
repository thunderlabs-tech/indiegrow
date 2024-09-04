<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectForm from '$lib/components/ProjectForm.svelte';
	import type { Tables } from '$lib/supabase';
	import { dbclient } from '$lib/dbclient';
	import Spinner from '$lib/components/Spinner.svelte';
	let projects: Tables<'projects'>[] = [];

	let loading = false;
	async function loadProjects() {
		loading = true;
		const { error, data } = await dbclient().from('projects').select('*').is('competitor_of', null);
		if (error) {
			console.error(error);
		} else {
			projects = data;
		}
		loading = false;
	}

	onMount(async () => {
		await loadProjects();
	});

	let showNewProjectForm = false;
	function newProject() {
		showNewProjectForm = true;
	}

	function onSave() {
		showNewProjectForm = false;
		loadProjects();
	}

	async function deleteProject(id: string) {
		const { error } = await dbclient().from('projects').delete().match({ id });
		if (error) {
			console.error('Error deleting project:', error);
		} else {
			loadProjects();
		}
	}
</script>

<div class="mx-auto max-w-5xl space-y-8 p-4 md:p-12">
	<div class="flex flex-col space-y-4">
		<h1 class="h1">Your projects</h1>

		{#if showNewProjectForm}
			<ProjectForm project={{}} {onSave} />
		{:else}
			<span>
				<button class="variant-filled btn btn-sm" on:click={newProject}>Add project</button>
			</span>
			{#if loading}
				<Spinner text="Loading projects..." />
			{:else if projects.length === 0}
				<p>No projects yet</p>
			{:else}
				<section class="card text-token w-full space-y-4 p-4">
					<table class="projects">
						{#each projects as project}
							<tr>
								<td>
									<a href="/projects/{project.id}">
										{project.name}
									</a>
								</td>
								<td>
									{#if project.description}
										{project.description}
									{/if}
								</td>
								<td>
									<a class="variant-filled btn btn-sm" href="/projects/{project.id}">Select</a>
									<button
										class="variant-filled-error btn btn-sm"
										on:click={() => deleteProject(project.id)}>Delete</button
									>
								</td>
							</tr>
						{/each}
					</table>
				</section>
			{/if}
		{/if}
	</div>
</div>

<style lang="postcss">
	td {
		padding: 15px;
	}
</style>
