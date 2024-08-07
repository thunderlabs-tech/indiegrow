<script lang="ts">
	import '../app.postcss';
	import { page } from '$app/stores';
	import Navigation from '$lib/components/Navigation.svelte';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';

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

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
	<svelte:fragment slot="header">
		<AppBar padding="p-2">
			<svelte:fragment slot="lead">
				<span class="logo xs:text-xs xs:p-0 p-1 xl:text-xl">
					{#if $page.data.currentProject}
						<button class="btn btn-sm p-0 lg:hidden" on:click={drawerOpen}>
							<span>
								<svg viewBox="0 0 100 80" class="fill-token h-4 w-4">
									<rect width="100" height="20" />
									<rect y="30" width="100" height="20" />
									<rect y="60" width="100" height="20" />
								</svg>
							</span>
						</button>
					{/if}
					<span class="strong text-white">
						<a href="/">
							<span class="font-bold"> indiegrow </span>
						</a>

						<!-- {#if $page.data.currentProject}
							<a href="/projects/{$page.data.currentProject.id}">
								<span class="">
									&#60;{$page.data.currentProject.name}&#62;
								</span>
							</a>
						{/if} -->
						$
					</span>
				</span>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if $page.data.projects?.length > 0}
					<a class="variant-ghost-surface btn btn-sm" href="/projects"> Projects </a>
				{/if}
				<a class="variant-ghost-surface btn btn-sm" href="/content"> Content </a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- <svelte:fragment slot="sidebarLeft">
		{#if $page.data.currentProject}
			<Navigation />
		{/if}
	</svelte:fragment> -->

	<div class="layout-docs flex items-start justify-center gap-10">
		<div class="page-container-wide page-padding">
			<div class="mx-auto w-full max-w-5xl p-4">
				<slot />
			</div>
		</div>
	</div>
</AppShell>

<style lang="postcss">
	.logo {
		background-color: none;
		white-space: nowrap;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
			'Courier New', monospace;
		/* color: rgb(var(--color-primary-700) / var(--tw-text-opacity)); */
		/* background-color: rgb(var(--color-primary-500) / 0.3); */
		border-radius: 0.25rem;
		padding-top: 0.125rem;
		padding-bottom: 0.125rem;
		padding-left: 0.25rem;
		padding-right: 0.25rem;
	}
</style>
