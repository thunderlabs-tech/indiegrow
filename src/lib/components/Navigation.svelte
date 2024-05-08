<script lang="ts">
	import { page } from '$app/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	$: currentProject = $page.data.currentProject;
	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

{#if currentProject}
	<nav class="list-nav p-4">
		<ul>
			<li><a href="/projects/{currentProject.id}" on:click={drawerClose}>Edit Project</a></li>
			<li><a href="/competition" on:click={drawerClose}>Competition</a></li>
			{#if currentProject.appStoreInfo}
				<li><a href="/aso" on:click={drawerClose}>ASO</a></li>
			{/if}
		</ul>
	</nav>
{/if}
