<script lang="ts">
	export let data;
</script>

<h1 class="h1">Content Categories</h1>

<section>
	{#each data.categories as category}
		<hr />
		<h2 class="h3">
			<a href="/content/{category.slug}">{category.title}</a>
		</h2>
	{/each}
</section>
