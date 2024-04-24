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
		<td>One line pitch</td>
		<td>Product Type</td>
		<td>Target Audience</td>
		<td>Key Benefits</td>
		<td>Key Features</td>
		<td>Actions</td>
	</tr>

	{#each competitors as competitor, idx}
		{@const ogObject = competitor.websiteInfo?.ogObject}
		{@const app = competitor.appStoreInfo}
		{@const image = (ogObject?.ogImage && ogObject.ogImage[0].url) || app?.image}
		{@const pma = competitor.productMarketingAnalysis}
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
				{pma?.oneLinePitch || ''}
			</td>
			<td>
				{pma?.productType || ''}
			</td>
			<td>
				{pma?.targetAudience || ''}
			</td>
			<td>
				{pma?.keyBenefits || ''}
			</td>
			<td>
				{pma?.keyFeatures || ''}
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
