<script lang="ts">
	import type { Competitor } from '$lib/types';
	import CompetitorRow from '$lib/components/CompetitorRow.svelte';

	export let competitors: Competitor[] = [];
	export let onRemove: (event: Event) => void;
</script>

<table class="table">
	<tr>
		<td>Name</td>
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
		<CompetitorRow {competitor} {onRemove} />
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
