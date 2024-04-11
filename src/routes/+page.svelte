<script lang="ts">
	import type { ExtractionResult } from '$lib/appstore';

	let url = '';
	let loading = false;

	let content: string | undefined;
	let screenShotPath: string | undefined;

	async function analyze() {
		try {
			loading = true;
			const response = await fetch('/api/extract', {
				method: 'POST',
				body: JSON.stringify({
					url
				}),
				headers: {
					'content-type': 'application/json'
				}
			});

			const result: ExtractionResult | null = await response.json();
			if (result) {
				content = result.content;
				screenShotPath = result.screenShotPath.replace('static/', '');
			}
		} catch (error) {
			console.error('Error extracting entities:', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Improve your App Store presence for free</h2>
		<div class="flex justify-center space-x-2">
			<input
				bind:value={url}
				class="input w-full"
				type="text"
				placeholder="Enter your appstore URL"
			/>
			<button class="btn variant-filled" on:click={analyze}> Analyze </button>
		</div>
		{#if content}
			<div class="card p-4 space-y-2 text-center items-center">
				<h3 class="text-lg">Extracted content:</h3>
				<p>{content}</p>
				<img src={screenShotPath} alt="Screenshot" />
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
