<script lang="ts">
	export let searchTerms: string[] | undefined;
	function removeTerm(term: string) {
		searchTerms = searchTerms?.filter((t) => t !== term);
	}

	function addTerm() {
		searchTerms ||= [];
		searchTerms = [...searchTerms, ''];
	}
</script>

{#if searchTerms}
	<ul class="list-none space-y-2">
		{#each searchTerms as term}
			<li>
				<input type="text" bind:value={term} />
				<button class="variant-filled btn btn-sm" on:click={() => removeTerm(term)}>Remove</button>
			</li>
		{/each}
	</ul>
	<button class="variant-filled btn btn-sm" on:click={() => addTerm()}>Add</button>
{/if}
