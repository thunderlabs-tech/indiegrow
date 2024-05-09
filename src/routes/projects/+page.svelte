<script lang="ts">
	import { page } from '$app/stores';
	import type { Database, Tables } from '$lib/supabase';
	import { SupabaseClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

	let projects: Tables<'projects'>[] = [];
	onMount(async () => {
		const db = $page.data.supabase as SupabaseClient<Database>;
		const { error, data } = await db.from('projects').select('*');
		if (error) {
			// console.log(error);
		} else {
			projects = data;
		}
	});

	function newProject() {}

	async function deleteProject(id: string) {
		const db = $page.data.supabase as SupabaseClient<Database>;
		const { error } = await db.from('projects').delete().match({ id });
		if (error) {
			console.log(error);
		} else {
			projects = projects.filter((project) => project.id !== id);
		}
	}
</script>

<div class="h-full w-full p-6">
	<div class="flex flex-col space-y-4">
		<h1 class="h1">Your projects</h1>

		<span>
			<a class="variant-filled-primary btn btn-sm" on:click={newProject}>add project</a>
		</span>
		<section class="card text-token w-full space-y-4 p-4">
			<dl class="list-dl">
				{#each projects as project}
					<div>
						<!-- <span class="badge bg-primary-500 text-xl">{project.name[0]}</span> -->
						<a href="/projects/{project.id}">
							<span class="flex-auto">
								<dt class="font-bold">{project.name}</dt>
								<dd>{project.description}</dd>
							</span>
						</a>
						<span>
							<a class="variant-filled-primary btn btn-sm" href="/projects/{project.id}">Select</a>
							<a class="variant-filled-primary btn btn-sm">Edit</a>
							<a class="variant-filled-error btn btn-sm" on:click={deleteProject(project.id)}
								>Delete</a
							>
						</span>
					</div>
				{/each}
			</dl>
		</section>
	</div>
</div>
