<script lang="ts">
	import { page } from '$app/stores';

	const discordWebhookUrl =
		'https://discord.com/api/webhooks/1250451829741977641/UIvHjqlu_eG8XVRA9vdItJ8yQJ59HiYNuIBJDmhhOyCdscc1CPpT1hhl8Yi2_gWvaPGR';

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

<div class="text-md items-center space-y-4">
	{#if submitted}
		<p class="text-green-500">You are now on the waiting list!</p>
	{:else}
		<!-- <h2 class="text-2xl font-medium text-primary-500">Closed alpha</h2> -->
		<p class="text-secondary-300">
			We are currently in a closed alpha. We'll send you an email when we are ready for more users.
		</p>
		<form class="mx-auto" on:submit={addToWaitingList}>
			<div class="input-group flex bg-surface-100">
				<input
					bind:value={email}
					class="input"
					type="email"
					name="email"
					placeholder="Your email address"
				/>
				<button class="variant-filled-secondary btn" type="submit">Sign up for waiting list</button>
			</div>
		</form>
	{/if}
</div>

<style lang="postcss">
	.form {
		width: 450px;
	}
	.input-group {
		@apply bg-surface-100;
		@apply border-surface-100;
		@apply border-0;
	}
	.input,
	input,
	input::placeholder {
		@apply bg-surface-100;
		@apply text-slate-400;
		@apply border-surface-100;
	}
</style>
