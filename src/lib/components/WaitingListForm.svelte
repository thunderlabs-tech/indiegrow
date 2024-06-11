<script lang="ts">
	import { page } from '$app/stores';

	let email = '';

	let submitted = false;
	async function addToWaitingList() {
		const supabase = $page.data.supabase;
		const uid = $page.data.user.id;

		// validate the email:
		const emailIsValid = email.includes('@');
		if (!emailIsValid) {
			console.log('email invalid');
			return;
		}

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
</script>

<div class="space-y-4 p-2">
	{#if submitted}
		<p class="text-green-500">You are now on the waiting list!</p>
	{:else}
		<h2 class="h2 text-lg font-medium">Join the Waiting List</h2>
		<form class="space-y-4" on:submit={addToWaitingList}>
			<input
				bind:value={email}
				class="input"
				type="email"
				name="email"
				id="email"
				placeholder="Your email"
			/>
			<p class="text-sm text-gray-500">We'll send you an email when we are ready for more users.</p>
			<button class="variant-filled-primary btn" type="submit">Apply for waiting list</button>
		</form>
	{/if}
</div>
