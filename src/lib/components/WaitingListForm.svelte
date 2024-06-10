<script lang="ts">
	import { page } from '$app/stores';

	let email = '';

	let submitted = false;
	async function addToWaitingList() {
		const supabase = $page.data.supabase;
		const uid = $page.data.user.id;

		const entry = { email, user_id: uid };
		console.log('Inserting: ', entry);
		const { error } = await supabase.from('waiting_list').insert(entry);
		if (error) {
			console.error(error);
		} else {
			submitted = true;
		}
		return true;
	}

	const supabase = $page.data.supabase;
</script>

<div class="card">
	{#if submitted}
		<p class="text-green-500">You are now on the waiting list!</p>
	{:else}
		<form class="space-y-4" on:submit={addToWaitingList}>
			<input
				bind:value={email}
				class="input"
				type="email"
				name="email"
				id="email"
				placeholder="Email"
			/>
			<button class="variant-filled-primary btn" type="submit">Join the Waiting List</button>
		</form>
	{/if}
</div>
