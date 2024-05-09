<script lang="ts">
	import ProjectForm from '$lib/components/ProjectForm.svelte';
</script>

<div class="container mx-auto flex h-full p-6">
	<div class="flex flex-col space-y-10">
		<h1 class="h1">What's your project?</h1>
		<div class="w-full space-y-2">
			<div class="justify-center">
				<ProjectForm project={{}} />
			</div>
		</div>
	</div>
</div>
