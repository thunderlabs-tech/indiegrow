<script lang="ts">
	import type { Competitor } from '$lib/types';
	import CompetitorRow from '$lib/components/CompetitorRow.svelte';

	export let competitors: Competitor[] = [];
	export let onRemove: (event: Event) => void;
</script>

<table class="table">
	<tr>
		<td>
			<!-- Loading spinner... -->
		</td>
		<td>Logo</td>
		<td>Name</td>
		<td>Apps</td>
		<td>One line pitch</td>
		<td>Product Type</td>
		<td>Target Audience</td>
		<td>Key Benefits</td>
		<td>Key Features</td>
		<td>Positioning</td>
		<td>Actions</td>
	</tr>

	{#each competitors as competitor, idx}
		<CompetitorRow {competitor} {onRemove} />
	{/each}
</table>

<style lang="postcss">
	tr {
		border-bottom: 1px solid #e2e8f0;
	}
	td {
		padding: 0.5rem;
	}
</style>
