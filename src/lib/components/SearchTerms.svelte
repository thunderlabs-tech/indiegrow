<script lang="ts">
	import Fa from 'svelte-fa';
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
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
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><Fa icon={faSearch} /></div>
					<input type="text" class="input" bind:value={term} />
					<button class="variant-filled btn btn-sm" on:click={() => removeTerm(term)}>Remove</button
					>
				</div>
			</li>
		{/each}
		<li>
			<button class="variant-filled btn btn-sm" on:click={() => addTerm()}>Add</button>
		</li>
	</ul>
{/if}
