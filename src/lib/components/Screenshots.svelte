<script lang="ts">
	export let screenshotUrls: string[];
</script>

<div class="grid grid-cols-[auto_1fr_auto] items-center gap-0">
	<div class="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-2">
		{#each screenshotUrls as url}
			<img
				class="rounded-container-token hover:brightness-125"
				alt="screenshot"
				src={url}
				loading="lazy"
			/>
		{/each}
	</div>
</div>
