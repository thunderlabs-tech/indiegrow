<script lang="ts">
	import CommunityPosts from '$lib/components/CommunityPosts.svelte';
	import Breadcrumbs from '$lib/components/content/Breadcrumbs.svelte';
</script>

<div class="mx-auto max-w-5xl space-y-8 p-4 md:p-12">
	<Breadcrumbs />
	<div class="flex flex-col space-y-4">
		<h1 class="h1">Community pulse</h1>
		<p>Let's find communities talking about the problems your app is solving.</p>
		<CommunityPosts />
	</div>
</div>
