<script lang="ts">
	import { page } from '$app/stores';
	import { AppBar } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faBars } from '@fortawesome/free-solid-svg-icons';

	export let drawerOpen: () => void;
</script>

<AppBar gap="none">
	<svelte:fragment slot="lead">
		<a href="/" class="w-32 lg:w-auto">
			<img class="h-7 w-auto dark:hidden" src="/images/logo-2x.png" alt="IndieGrow" />
			<img class="hidden h-7 w-auto dark:block" src="/images/logo-2x-white.png" alt="IndieGrow" />
		</a>
	</svelte:fragment>
	<svelte:fragment slot="default">
		<div class="invisible flex items-center justify-center gap-4 lg:visible">
			<a href="/#features" class="header-link">Features</a>
			<a href="/content" class="header-link">Content</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<div class="invisible h-0 lg:visible lg:h-auto">
			{#if $page.data.projects?.length > 0}
				<a class="header-btn variant-filled btn btn-md" href="/projects">Projects</a>
			{/if}
			<a class="header-btn variant-filled btn btn-md" href="/#signup">Get started</a>
		</div>
		<div class="visible lg:invisible lg:w-0">
			<button on:click={drawerOpen}>
				<Fa icon={faBars} />
			</button>
		</div>
	</svelte:fragment>
</AppBar>

<style lang="postcss">
	:global(.app-bar) {
		@apply w-full;
		padding: 15px;

		@media screen(xl) {
			width: 1200px;
			padding-left: 20px;
			padding-right: 20px;
			padding-top: 18px;
			padding-bottom: 18px;
		}

		border-radius: 10px;
		border: 1px solid rgba(246, 248, 237, 0.6);
		background: rgba(246, 248, 237, 0.25);
		backdrop-filter: blur(5px);
	}

	:global(header) {
		padding: 15px;
		@media screen(xl) {
			padding-top: 20px;
			padding-bottom: 20px;
		}
		/* this is what centers your element in the fixed wrapper*/
		display: flex;
		flex-flow: column nowrap;
		justify-content: center; /* aligns on vertical for column */
		align-items: center; /* aligns on horizontal for column */
	}

	:global(.app-bar-slot-default) {
		display: none;

		@media screen(sm) {
			display: block;
		}
	}

	:global(.app-bar-slot-trail) {
		@apply space-x-0;
	}
	.header-btn {
		height: 40px;
		/* color: #f6f8ed; */

		text-align: center;
		font-family: Poppins;
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}
	:global(.header-link) {
		/* color: #001f3e; */
		font-family: Poppins;
		font-size: 18px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}
</style>
