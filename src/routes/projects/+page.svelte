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

<div class="h-full w-full p-6">
	<div class="flex flex-col space-y-4">
		<h1 class="h1">Your projects</h1>

		<span>
			<button class="variant-filled-primary btn btn-sm" on:click={newProject}>Add project</button>
		</span>
		{#if showNewProjectForm}
			<ProjectForm project={{}} {onSave} />
		{/if}

		{#if projects.length === 0}
			<p>No projects yet</p>
		{:else}
			<section class="card text-token w-full space-y-4 p-4">
				<dl class="list-dl">
					{#each projects as project}
						<div>
							<!-- <span class="badge bg-primary-500 text-xl">{project.name[0]}</span> -->
							<a href="/projects/{project.id}">
								<span class="flex-auto">
									<dt class="font-bold">{project.name}</dt>
									<dd>
										{#if project.description}
											{project.description}
										{/if}
									</dd>
								</span>
							</a>
							<span>
								<a class="variant-filled-primary btn btn-sm" href="/projects/{project.id}">Select</a
								>
								<button class="variant-filled-error btn btn-sm" on:click={deleteProject(project.id)}
									>Delete</button
								>
							</span>
						</div>
					{/each}
				</dl>
			</section>
		{/if}
	</div>
</div>
