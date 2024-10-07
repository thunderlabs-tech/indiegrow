<script lang="ts">
	import type { CommunityPost } from '$lib/types';
	import CommunityPostRow from './CommunityPostRow.svelte';

	let posts: CommunityPost[] = [];
	$: posts = posts;

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	function handleDbChange(payload: any) {
		console.log('Change received!', payload);
		loadPosts()
			.then((data) => {
				console.log('new posts loaded!', data);
				posts = data;
			})
			.catch((error) => {
				console.error('Error loading posts', error);
			});
	}

	$: supabase = $page.data.supabase;
	$: currentProject = $page.data.currentProject;

	async function loadPosts(): Promise<CommunityPost[]> {
		const { data: posts, error } = await supabase
			.from('community_posts')
			.select('*')
			.eq('project_id', currentProject.id)
			.is('relevant', null)
			.order('created_at', { ascending: true });
		if (error) {
			console.error('Error loading posts', error);
		}
		return posts;
	}

	onMount(async () => {
		posts = await loadPosts();
	});

	$: {
		if (supabase) {
			console.log('subscribing to changes in the database');
			supabase
				.channel('room1')
				.on(
					'postgres_changes',
					{ event: '*', schema: 'public', table: 'community_posts' },
					handleDbChange
				)
				.subscribe();
		}
	}
</script>

<table class="table table-compact">
	<tr>
		<td colspan="2" class="text-xl">
			<h4>
				<span class="font-bold">Posts:</span>
			</h4>
		</td>
		<td> Actions </td>
	</tr>
	{#each posts as post, idx}
		<CommunityPostRow {idx} {post} />
	{/each}
</table>

<style lang="postcss">
	tr {
		border-bottom: 4px solid #e2e8f0;
	}
	td {
		padding: 0.5rem;
	}
</style>
