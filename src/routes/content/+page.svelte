<script lang="ts">
	import Post from '$lib/components/content/Post.svelte';

	export let data;
</script>

<header class="flex items-center justify-between space-y-4">
	<div class="space-y-4">
		<h2 class="h2">Indigrow Posts</h2>
		<p>Latest news and updates from the Indigrow team.</p>
		<div class="md flex items-center space-x-4">
			{#each data.categories as category}
				<a class="variant-ghost-surface btn btn-sm" href="/content/{category.slug}">
					{category.title}
				</a>
			{/each}
		</div>
	</div>
</header>
<hr class="my-8" />

<section class="blog-list space-y-8">
	{#each data.posts as post}
		<Post {post} />
	{/each}
	<hr />
</section>
