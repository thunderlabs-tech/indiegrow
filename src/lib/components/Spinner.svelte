<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let text: string | undefined = undefined;
</script>

<span class="flex">
	<ProgressRadial value={undefined} stroke={100} strokeLinecap="butt" width="w-5" />
	{#if text}
		<span class="ml-2 flex-1 text-sm">{text}</span>
	{/if}
</span>
