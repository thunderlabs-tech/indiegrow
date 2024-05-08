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
</script>

<ul>
	{#each projects as project}
		<li>
			<a href="/projects/{project.id}">
				{project.name}
			</a>
		</li>
	{/each}
</ul>
