<script lang="ts">
	import Fa from 'svelte-fa';
	import { faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';

	import '../app.postcss';
	import { page } from '$app/stores';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { initializeStores, getDrawerStore } from '@skeletonlabs/skeleton';

	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

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
	<svelte:fragment slot="header">
		<AppBar padding="p-2" background="bg-surface-50">
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
					<span class="strong text-secondary-500">
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
					<a class="variant-filled-secondary btn btn-md" href="/projects">Projects</a>
				{/if}
				<a class="variant-filled-secondary btn btn-md" href="/content">Content</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- <svelte:fragment slot="sidebarLeft">
		{#if $page.data.currentProject}
			<Navigation />
		{/if}
	</svelte:fragment> -->

	<!-- <div class="layout-docs flex items-start justify-center"> -->
	<!-- <div class="page-container-wide page-padding"> -->
	<!-- <div class="mx-auto w-full"> -->
	<div>
		<slot />
	</div>
	<!-- </div> -->
	<!-- </div> -->
	<!-- </div> -->
	<svelte:fragment slot="pageFooter"
		><footer id="page-footer" class="flex-none">
			<div
				class="page-footer border-t border-surface-500/10 bg-surface-50 text-xs dark:bg-surface-100-800-token md:text-base"
			>
				<div class="mx-auto w-full max-w-5xl space-y-10 p-4 py-12">
					<section
						class="flex flex-col items-center justify-between space-y-5 md:flex-row md:items-start md:space-y-0"
					>
						<!-- <div
							class="grid grid-cols-1 place-content-center place-items-center gap-2 md:place-items-start"
						>
							<p class="text-md opacity-80">
								IndieGrow helps early-stage app developers grow their user base.
							</p>
						</div> -->
						<div
							class="hidden grid-cols-3 gap-8 md:grid md:place-items-start"
							data-svelte-h="svelte-euzn36"
						>
							<div class="space-y-6">
								<h6 class="h6">Content</h6>
								<ul class="space-y-3">
									<li><a class="anchor" href="/content/news">News</a></li>
									<li><a class="anchor" href="/content/blog">Blog</a></li>
									<li>
										<a class="anchor" href="/content/aso-best-practices">ASO best practices</a>
									</li>
								</ul>
							</div>
							<div class="space-y-6">
								<h6 class="h6">Features</h6>
								<ul class="space-y-3">
									<li><a class="anchor" href="/#competitor-analysis">Competitor Analysis</a></li>
									<li><a class="anchor" href="/#community-pulse">Community Pulse</a></li>
									<li>
										<a class="anchor" href="/#appstore-content">AppStore Content Optimization</a>
									</li>
								</ul>
							</div>
							<div class="space-y-6">
								<h6 class="h6">Team</h6>
								<ul class="space-y-3">
									<li>
										<a
											class="anchor"
											href="https://www.linkedin.com/in/ionutciobotaru/"
											target="_blank"
											rel="noreferrer">Ionut Ciobotaru</a
										>
									</li>
									<li>
										<a
											class="anchor"
											href="https://www.linkedin.com/in/eugenmartin/"
											target="_blank"
											rel="noreferrer">Eugen Martin</a
										>
									</li>
								</ul>
							</div>
						</div>
					</section>
					<hr class="opacity-20" />
					<section
						class="flex flex-col items-center justify-between space-y-4 md:flex-row md:items-start md:space-y-0"
					>
						<p data-svelte-h="svelte-eh0jpm">
							<a class="anchor" href="https://indiegrow.dev" target="_blank" rel="noreferrer"
								>IndieGrow</a
							>
							was made with ❤️ in Berlin, Germany.
						</p>
						<div class="flex gap-6">
							<a
								class="opacity-75 hover:opacity-100"
								href="https://www.linkedin.com/in/ionutciobotaru/"
								target="_blank"
								rel="noreferrer"
								title="LinkedIn"
								><Fa icon={faLinkedin} />
							</a>
							<a
								class="opacity-75 hover:opacity-100"
								href="https://x.com/weeb0"
								target="_blank"
								rel="noreferrer"
								title="X (Twitter)"
								><Fa icon={faXTwitter} />
							</a>
							<!-- <a
								class="opacity-75 hover:opacity-100"
								href="https://discord.gg/EXqV7W8MtY"
								target="_blank"
								rel="noreferrer"
								title="Discord"
								><Fa icon={faDiscord} />
							</a> -->
						</div>
					</section>
				</div>
			</div>
		</footer>
	</svelte:fragment>
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
