<script lang="ts">
	import '../app.postcss';
	import { page } from '$app/stores';
	import { AppShell, getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Drawer } from '@skeletonlabs/skeleton';

	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { initializeStores } from '@skeletonlabs/skeleton';

	// for the  mobile menu
	initializeStores();
	const drawerStore = getDrawerStore();
	const drawerSettings: DrawerSettings = {
		id: 'mobile-menu',
		// Provide your property overrides:
		bgDrawer: 'bg-white',
		bgBackdrop: 'bg-gradient-to-tr from-surface-900/50  to-surface-200/50',
		width: 'w-full',
		height: 'h-auto',
		padding: 'p-4',
		rounded: 'rounded-xl',
		position: 'top'
	};

	function drawerOpen(): void {
		drawerStore.open(drawerSettings);
	}
	function drawerClose(): void {
		drawerStore.close();
	}

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	if ($page.data.user) {
		posthog.identify($page.data.user?.id);
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

<!-- for the mobile menu -->
<Drawer>
	<div class="flex flex-col gap-4 p-4">
		<hr class="my-8" />
		<a href="/" class="header-link" on:click={drawerClose}>Home</a>
		<a href="/#features" class="header-link" on:click={drawerClose}>Features</a>
		<a href="/content" class="header-link mb-8" on:click={drawerClose}>Content</a>
		{#if $page.data.projects?.length > 0}
			<a
				class="header-btn variant-filled-secondary btn btn-md"
				on:click={drawerClose}
				href="/projects">Projects</a
			>
		{/if}
		<a class="header-btn variant-filled-secondary btn btn-md" on:click={drawerClose} href="/#signup"
			>Sign up</a
		>
		<hr class="my-8" />
	</div>
</Drawer>

<AppShell slotSidebarLeft="bg-surface-50/5 w-0 lg:w-64">
	<svelte:fragment slot="pageHeader">
		<Header {drawerOpen} />
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
