<script lang="ts">
	import Breadcrumbs from '$lib/components/content/Breadcrumbs.svelte';
	import Post from '$lib/components/content/Post.svelte';

	export let data;
</script>

<div class="mx-auto max-w-5xl space-y-8 p-4 md:p-12">
	<Breadcrumbs category={data.category} />

	<div class="flex items-center justify-between space-y-4">
		<div class="space-y-4">
			<h2 class="h2">{data.category.title}</h2>
		</div>
	</div>
	<hr class="my-8" />

	<section class="blog-list space-y-8">
		{#each data.posts as post}
			<Post {post} />
		{/each}
		<hr />
	</section>
</div>
