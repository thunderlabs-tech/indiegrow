<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumbs from '$lib/components/layout/Breadcrumbs.svelte';

	/** @type {import('./$types').PageData} */
	const currentProject = $page.data.currentProject;
</script>

<div class="mx-auto max-w-5xl space-y-8 p-4 md:p-12">
	<Breadcrumbs />
	<div class="flex flex-col space-y-4">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="card">
				<div class="card-header font-bold">Competition</div>
				<section class="p-4">
					Analyze your competition based on their website and AppStore presence.
				</section>
				<footer class="card-footer">
					<a class="variant-filled btn btn-sm" href="/projects/{currentProject.id}/competition"
						>Analyze your competition</a
					>
				</footer>
			</div>

			{#if currentProject.appstore_url}
				<div class="card">
					<div class="card-header font-bold">ASO</div>
					<section class="p-4">
						Improve your AppStore content to increase your visibility and downloads.
					</section>
					<footer class="card-footer">
						<a class="variant-filled btn btn-sm" href="/projects/{currentProject.id}/aso"
							>Improve AppStore content</a
						>
					</footer>
				</div>
			{/if}

			<div class="card">
				<div class="card-header font-bold">Community pulse</div>
				<section class="p-4">
					Find the right community conversations for your app - on reddit, discord, or slack.
				</section>
				<footer class="card-footer">
					<a class="variant-filled btn btn-sm" href="/projects/{currentProject.id}/communities"
						>Find relevant conversations</a
					>
				</footer>
			</div>
		</div>
	</div>
</div>

<div class="card"></div>
