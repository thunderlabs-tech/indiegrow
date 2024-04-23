<script lang="ts">
	import type { Competitor } from '$lib/types';

	export let competitors: Competitor[] = [];
	export let onRemove: (event: Event) => void;

	function removeCompetitor(event: Event) {
		onRemove(event);
	}
</script>

<table class="table">
	<tr>
		<td>Name</td>
		<td>Website</td>
		<td>Description</td>
		<td>Logo</td>
		<td>App</td>
		<td>Actions</td>
	</tr>

	{#each competitors as competitor, idx}
		{@const ogObject = competitor.websiteInfo?.ogObject}
		{@const app = competitor.appStoreInfo}
		{@const image = (ogObject?.ogImage && ogObject.ogImage[0].url) || app?.image}
		<tr>
			<td>{ogObject?.ogSiteName || ogObject?.ogTitle}</td>
			<td>{competitor.websiteUrl}</td>
			<td>{ogObject?.ogDescription}</td>
			<td>
				<img src={image} />
			</td>
			<td>
				{#if app}
					<img class="h-8 w-8" src={app.image} alt={app.name} />
				{/if}
			</td>
			<td>
				<button class="variant-outline-warning btn btn-sm" on:click={removeCompetitor}
					>Remove</button
				>
			</td>
		</tr>
	{/each}
</table>

<style lang="postcss">
	td {
		padding: 0.5rem;
	}
	tr {
		border-bottom: 1px solid #e2e8f0;
	}
</style>
