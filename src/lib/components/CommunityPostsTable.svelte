<script lang="ts">
	import type { CommunityPost } from '$lib/types';
	import CommunityPostRow from './CommunityPostRow.svelte';

	export let posts: CommunityPost[] = [];
	$: posts = posts;

	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

	function handleDbChange(payload: any) {
		console.log('Change received!', payload);
		loadPosts()
			.then((data) => {
				posts = data;
			})
			.catch((error) => {
				console.error('Error loading posts', error);
			});
	}

	$: supabase = $page.data.supabase;
	$: currentProject = $page.data.currentProject;

	async function loadPosts(): Promise<CommunityPost[]> {
		if (!currentProject) {
			return [];
		}
		const { data: posts, error } = await supabase
			.from('community_posts')
			.select('*')
			.eq('project_id', currentProject.id)
			.is('relevant', null)
			.order('relevance', { ascending: false });
		if (error) {
			console.error('Error loading posts', error);
		}
		return posts;
	}

	onMount(async () => {
		posts = await loadPosts();
	});

	const channelName = 'community_posts_changes';
	$: {
		if (supabase) {
			console.log('subscribing to changes in the database');
			supabase
				.channel(channelName)
				.on(
					'postgres_changes',
					{ event: '*', schema: 'public', table: 'community_posts' },
					handleDbChange
				)
				.subscribe();
		}
	}

	onDestroy(() => {
		if (supabase) {
			console.log('unsubscribing from changes in the database');
			supabase.channel(channelName).unsubscribe();
		}
	});
</script>

{#if posts.length > 0}
	<table class="table">
		<tr>
			<td class="text-sm">Relevance </td>
			<td class="text-sm">Content </td>
			<td class="text-sm"> Actions </td>
		</tr>
		{#each posts as post}
			<CommunityPostRow {post} />
		{/each}
	</table>
{/if}

<style lang="postcss">
	tr {
		border-bottom: 4px solid #e2e8f0;
	}
	td {
		padding: 0.5rem;
	}
</style>
