<script lang="ts">
	import { project } from '$lib/project';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/" on:click={drawerClose}>Start</a></li>
		{#if $project}
			<li><a href="/competition" on:click={drawerClose}>Competition</a></li>
			{#if $project.appStoreInfo}
				<li><a href="/aso" on:click={drawerClose}>ASO</a></li>
			{/if}
		{/if}
	</ul>
</nav>
