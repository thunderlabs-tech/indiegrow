<script lang="ts">
	export let category: { title: string; slug: string } | undefined;
</script>

<ol class="breadcrumb">
	<li class="crumb"><a class="anchor" href="/content">Content</a></li>

	{#if category}
		<li class="crumb-separator" aria-hidden="true">›</li>
		<li><a class="anchor" href="/content/{category.slug}">{category.title}</a></li>
	{/if}
</ol>
