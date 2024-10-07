<script lang="ts">
	import { marked } from 'marked';
	import { page } from '$app/stores';
	import type { CommunityPost } from '$lib/types';
	import Spinner from './Spinner.svelte';
	import { clipboard } from '@skeletonlabs/skeleton';

	export let post: CommunityPost;
	export let idx: number;
	$: currentProject = $page.data.currentProject;

	$: supabase = $page.data.supabase;

	async function markIrrelevant() {
		console.log('marking irrelevant', post);
		const { error } = await supabase
			.from('community_posts')
			.update({ relevant: false })
			.eq('id', post.id);
		if (error) {
			console.error('Error marking irrelevant', error);
		}
	}

	let loading = false;

	let suggestedResponse: string | undefined = undefined;
	$: suggestedResponse;

	async function suggestResponse() {
		loading = true;
		suggestedResponse = '';

		const briefing = `You are an expert at generating responses to community posts to promote apps.
		You will be given a post on reddit and an appstore url of an app in question.
		First, get the app info from the app store.
		Then, generate a response that tells the user about the app and how it might be able to solve their problem.
		Write in a typical reddit tone and be very brief - only 2-3 sentences.
		Avoid formal language and marketing speak and jargon. Use very simple and natural language that a happy user would use to recommend it to others.

		If the app is not likely to be of use to the user, or if the user is not likely to be able to benefit from the app, then do not suggest it - just respond: The app is not relevant.
		Your response should be in the same language as the post's content.
		Return a markdown formatted text.

		# App Url: ${currentProject.appstore_url}`;

		const input = `Respond to the following post:
		# Post:
		title: ${post.title}
		content: ${post.content}`;

		try {
			const response = await fetch('/api/agent', {
				method: 'POST',
				body: JSON.stringify({ briefing, input }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) throw new Error('Reponse not ok!');
			if (!response.body) throw new Error('No body found!');

			const stream = response.body.pipeThrough(new TextDecoderStream());
			const reader = stream.getReader();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				suggestedResponse += value;
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			loading = false;
		}
	}
</script>

<tr>
	<td class="text-center text-xl">💬</td>
	<td>
		<a href={post.url} class="font-bold" target="_blank">
			{idx + 1}.
			{post.title}
		</a>
		<p>{post.content}</p>

		{#if loading}
			<Spinner text="Generating a response..." />
		{/if}
		{#if suggestedResponse}
			<dd class="card mt-2 p-2">
				<h3 class="h3">Suggested response:</h3>
				<p class="italic">{@html marked(suggestedResponse)}</p>
				<button type="button" class="variant-soft btn btn-sm mt-2" use:clipboard={suggestedResponse}
					>Copy</button
				>
			</dd>
		{/if}
	</td>
	<td class="space-y-2">
		<button
			class="variant-filled btn btn-sm"
			on:click={() => {
				suggestResponse();
			}}>Respond</button
		>
		<button
			class="variant-filled-error btn btn-sm"
			on:click={async () => {
				markIrrelevant();
			}}>Mark irrelevant</button
		>
	</td>
</tr>

<style lang="postcss">
	td {
		padding: 0.5rem;
		vertical-align: top;
	}
	tr {
		border-bottom: 1px solid #e2e8f0;
	}
</style>
