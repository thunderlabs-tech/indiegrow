<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectForm from '$lib/components/ProjectForm.svelte';
	import type { Tables } from '$lib/supabase';
	import { dbclient } from '$lib/dbclient';
	let projects: Tables<'projects'>[] = [];

	async function loadProjects() {
		const { error, data } = await dbclient().from('projects').select('*').is('competitor_of', null);
		if (error) {
			console.log(error);
		} else {
			projects = data;
		}
	}

	onMount(async () => {
		loadProjects();
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
			console.log(error);
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
			<span>
				<button
					class="variant-filled-gray btn btn-sm"
					on:click={() => {
						showNewProjectForm = false;
					}}>Cancel</button
				>
			</span>
		{:else}
			<span>
				<button class="variant-filled-primary btn btn-sm" on:click={newProject}>Add project</button>
			</span>
			{#if projects.length === 0}
				<p>No projects yet</p>
			{:else}
				<section class="card text-token w-full space-y-4 p-4">
					<table class="projects">
						{#each projects as project}
							<tr>
								<!-- <span class="badge bg-primary-500 text-xl">{project.name[0]}</span> -->
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
									<a class="variant-filled-primary btn btn-sm mr-2" href="/projects/{project.id}"
										>Select</a
									>
									<a
										class="variant-filled-error btn btn-sm mr-2"
										on:click={deleteProject(project.id)}>Delete</a
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
