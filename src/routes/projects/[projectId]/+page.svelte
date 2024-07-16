<script lang="ts">
	import { page } from '$app/stores';

	/** @type {import('./$types').PageData} */

	const currentProject = $page.data.currentProject;
</script>

<div class="h-full w-full p-6">
	<div class="flex flex-col space-y-4">
		<!-- <h1 class="h1">{currentProject.name}</h1> -->

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="card">
				<header class="card-header font-bold">Competition</header>
				<section class="p-4">
					Analyze your competition based on their website and AppStore presence.
				</section>
				<footer class="card-footer">
					<a
						class="variant-filled-primary btn btn-md"
						href="/projects/{currentProject.id}/competition">Analyze your competition</a
					>
				</footer>
			</div>

			{#if currentProject.appstore_url}
				<div class="card">
					<header class="card-header font-bold">ASO</header>
					<section class="p-4">
						Improve your AppStore content to increase your visibility and downloads.
					</section>
					<footer class="card-footer">
						<a class="variant-filled-primary btn btn-md" href="/projects/{currentProject.id}/aso"
							>Improve your AppStore content</a
						>
					</footer>
				</div>
			{/if}

			<div class="card">
				<header class="card-header font-bold">Community marketing</header>
				<section class="p-4">
					Find the right community for your app - on reddit, discord, or slack.
				</section>
				<footer class="card-footer">
					<a
						class="variant-outline-primary btn btn-md"
						href="/projects/{currentProject.id}/communities">Find communities</a
					>
				</footer>
			</div>
		</div>
	</div>
</div>

<div class="card"></div>
