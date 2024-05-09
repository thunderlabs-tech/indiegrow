<script lang="ts">
	import { page } from '$app/stores';
	import ImproveAppStoreInfo from '$lib/components/ImproveAppStoreInfo.svelte';
</script>

<div class="container mx-auto flex h-full p-6">
	<div class="flex flex-col space-y-10">
		<h1 class="h1">Improve your App Store presence</h1>
		<div class="w-full space-y-2">
			{#if $page.data.currentProject}
				<ImproveAppStoreInfo />
			{/if}
		</div>
	</div>
</div>
