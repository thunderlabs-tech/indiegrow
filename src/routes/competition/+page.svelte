<script>
	import { project } from '$lib/project';
</script>

<div class="container mx-auto flex h-full p-6">
	<div class="flex flex-col space-y-10">
		<h1 class="h1">Competion analysis</h1>
		<div class="w-full space-y-2">
			<div class="justify-center space-x-2">
				<form>
					<div class="input-group input-group-divider grid-cols-[1fr_auto]">
						<input
							bind:value={$project.websiteUrl}
							class="input"
							type="text"
							placeholder="Enter your appstore URL"
						/>
						<button class="variant-filled-secondary btn">Start </button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
