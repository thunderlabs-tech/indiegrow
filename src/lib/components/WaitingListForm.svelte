<script lang="ts">
	import { page } from '$app/stores';

	const discordWebhookUrl =
		'https://discord.com/api/webhooks/1250136503951032482/g7W_scQknOS2z0Bb1_-6kDrj5YFnJeuKPDs8pLQpx3ID-wB3qV_WjyrWG4Y9zUWds4yp';

	async function sendToDiscord(payload: string | object) {
		const data = typeof payload === 'string' ? { content: payload } : payload;

		const response = await fetch(discordWebhookUrl, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' }
		});
		if (!response.ok) {
			console.error('Failed to send to discord', response);
		}
	}

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
			sendToDiscord({
				content: `New user on waiting list: ${email}`,
				username: 'Waiting List Bot'
			});
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
