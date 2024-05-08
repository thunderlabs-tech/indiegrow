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

<section class="card text-token w-full space-y-4 p-4">
	<p class="font-bold">Projects</p>

	<dl class="list-dl">
		{#each projects as project}
			<div>
				<span class="badge bg-primary-500">{project.name[0]}</span>
				<a href="/projects/{project.id}">
					<span class="flex-auto">
						<dt class="font-bold">{project.name}</dt>
						<dd>{project.description}</dd>
					</span>
				</a>
				<span>
					<a class="variant-outline-primary btn btn-sm" href="/projects/{project.id}">Select</a>
					<a class="variant-outline-warning btn btn-sm">Edit</a>
					<a class="variant-outline-error btn btn-sm" on:click={deleteProject(project.id)}>Delete</a
					>
				</span>
			</div>
		{/each}
	</dl>
</section>
