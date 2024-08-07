<script lang="ts">
	export let category: { title: string; slug: string } | undefined = undefined;
	export let post: { title: string; slug: string } | undefined = undefined;
</script>

<ol class="breadcrumb">
	<li class="crumb"><a class="anchor" href="/content">Content</a></li>

	{#if category}
		<li class="crumb-separator" aria-hidden="true">›</li>
		<li><a class="anchor" href="/content/{category.slug}">{category.title}</a></li>
	{/if}
	{#if post}
		<li class="crumb-separator" aria-hidden="true">›</li>
		<li><a class="anchor" href="/content/{post.slug}">{post.title}</a></li>
	{/if}
</ol>
