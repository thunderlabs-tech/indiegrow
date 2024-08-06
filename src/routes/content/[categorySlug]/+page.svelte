<script lang="ts">
	export let data;
</script>

<h1 class="h1">{data.category.title}</h1>

<section>
	{#each data.posts as post}
		<hr />
		<h2 class="h3">
			<a href="/content/{data.category.slug}/{post.slug}">{post.title}</a>
		</h2>
	{/each}
</section>
