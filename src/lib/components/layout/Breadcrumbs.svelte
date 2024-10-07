<script lang="ts">
	import { page } from '$app/stores';

	/** @type {import('./$types').PageData} */
	const currentProject = $page.data.currentProject;
</script>

<ol class="breadcrumb">
	<li class="crumb"><a class="anchor" href="/projects">Projects</a></li>
	<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
	{#if currentProject}
		<li class="crumb">
			<a class="anchor" href="/projects/{currentProject.id}">{currentProject.name}</a>
		</li>
	{/if}
</ol>
