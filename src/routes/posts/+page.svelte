<script>
	export let data;
</script>

<h1 class="h1">Posts</h1>

<section>
	{#each data.posts as post}
		<hr />
		<h2 class="h3">{post.title}</h2>
		{@html post.content}
	{/each}
</section>
