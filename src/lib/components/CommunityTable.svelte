<script lang="ts">
	import type { CommunitySearchResult, CommunityPost } from '$lib/types';
	import CommunityRow from './CommunityRow.svelte';

	export let results: CommunitySearchResult[];

	const indexMap = new Map<CommunityPost, number>();
	let idx = 1;
	for (const result of results) {
		for (const post of result.posts) {
			indexMap.set(post, idx);
			idx++;
		}
	}

	function removePost(post: CommunityPost) {
		results = results.map((result) => {
			return {
				...result,
				posts: result.posts.filter((p) => p !== post)
			};
		});
	}
</script>

<table class="table table-compact">
	{#each results as result, resultIdx}
		<tr>
			<td colspan="2" class="text-xl">
				<h4>
					<span class="font-bold">Search Term:</span> "{result.searchTerm}"
				</h4>
			</td>
			<td> Actions </td>
		</tr>
		{#if result?.posts?.length > 0}
			{#each result.posts as post, idx}
				<CommunityRow {idx} {post} {removePost} />
			{/each}
		{/if}
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
