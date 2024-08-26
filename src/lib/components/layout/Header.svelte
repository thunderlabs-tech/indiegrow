<script>
	import { page } from '$app/stores';
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar gap="none">
	<svelte:fragment slot="lead">
		<a href="/" class="w-32 lg:w-auto">
			<img class="h-7 w-auto sm:h-9" src="/images/logo-2x.png" alt="IndieGrow" />
		</a>
	</svelte:fragment>
	<svelte:fragment slot="default">
		<div class="invisible flex items-center justify-center gap-4 sm:visible">
			<a href="/#features" class="header-link">Features</a>
			<a href="/content" class="header-link">Content</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<span class="invisible h-0 sm:visible sm:h-auto">
			{#if $page.data.projects?.length > 0}
				<a class="header-btn variant-filled-secondary btn btn-md" href="/projects">Projects</a>
			{/if}
			<a class="header-btn variant-filled-secondary btn btn-md" href="/#signup">Sign up</a>
		</span>
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

	.header-btn {
		height: 40px;
		color: #f6f8ed;

		text-align: center;
		font-family: Poppins;
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}
	.header-link {
		color: #001f3e;
		font-family: Poppins;
		font-size: 18px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}
</style>
