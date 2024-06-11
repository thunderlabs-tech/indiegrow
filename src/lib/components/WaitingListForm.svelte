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

<div class="max-w-[800px] space-y-4 md:text-xl">
	{#if submitted}
		<p class="text-green-500">You are now on the waiting list!</p>
	{:else}
		<h2 class="text-2xl font-medium text-primary-500">Closed alpha</h2>
		<p class="text-primary-50">
			We are currently in a closed alpha. We'll send you an email when we are ready for more users.
		</p>
		<form class="space-y-4" on:submit={addToWaitingList}>
			<input
				bind:value={email}
				class="input"
				type="email"
				name="email"
				id="email"
				placeholder="Your email"
			/>
			<button class="variant-filled-primary btn" type="submit">Apply for waiting list</button>
		</form>
	{/if}
</div>
