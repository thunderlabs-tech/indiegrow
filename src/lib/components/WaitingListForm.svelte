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
			return;
		}

		const entry = { email, user_id: uid };
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

<div class="text-md w-full items-center space-y-4 lg:w-2/3">
	{#if submitted}
		<p class="text-green-500">You are now on the waiting list!</p>
	{:else}
		<!-- <p class="text-secondary-300">We are currently in a closed alpha.</p> -->
		<form class="mx-auto" on:submit={addToWaitingList}>
			<div class="dark:border- input-group flex flex-col sm:flex-row">
				<input
					bind:value={email}
					class="input"
					type="email"
					name="email"
					placeholder="Your email address"
				/>
				<button class="variant-filled btn btn-sm" type="submit">Join the waiting list</button>
			</div>
		</form>
	{/if}
</div>

<style lang="postcss">
	.input-group {
		@apply p-1;
	}
</style>
