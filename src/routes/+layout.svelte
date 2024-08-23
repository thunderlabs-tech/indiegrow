<script lang="ts">
	import '../app.postcss';
	import { page } from '$app/stores';
	import { AppShell } from '@skeletonlabs/skeleton';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { initializeStores, getDrawerStore } from '@skeletonlabs/skeleton';

	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	if ($page.data.user) {
		posthog.identify($page.data.user?.id);
	}

	initializeStores();

	const drawerStore = getDrawerStore();
	function drawerOpen(): void {
		drawerStore.open({});
	}

	export let data;

	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<AppShell slotSidebarLeft="bg-surface-50/5 w-0 lg:w-64">
	<svelte:fragment slot="pageHeader">
		<Header />
	</svelte:fragment>

	<!-- <svelte:fragment slot="sidebarLeft">
		{#if $page.data.currentProject}
			<Navigation />
		{/if}
	</svelte:fragment> -->

	<div>
		<slot />
	</div>
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>

<style lang="postcss">
	:global(.page-footer) {
		background: #f6f8ed;
	}

	:global(body) {
		@apply bg-[url('/images/ellipses.svg')];
		@apply bg-center;
		@apply bg-no-repeat;
		background-position: center 100px;
	}
</style>
