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
			<li>
				<a href="/projects/{currentProject.id}/competition" on:click={drawerClose}>Competition</a>
			</li>
			{#if currentProject.appstore_url}
				<li><a href="/projects/{currentProject.id}/aso" on:click={drawerClose}>ASO</a></li>
			{/if}
		</ul>
	</nav>
{/if}
