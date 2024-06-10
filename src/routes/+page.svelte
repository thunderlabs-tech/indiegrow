<script lang="ts">
	import { goto } from '$app/navigation';
	import ProjectForm from '$lib/components/ProjectForm.svelte';
	import WaitingListForm from '$lib/components/WaitingListForm.svelte';

	function onSave() {
		goto('/projects');
	}
</script>

<!-- <div class="container mx-auto flex h-full p-6">
	<div class="flex flex-col space-y-10">




		<h1 class="h1">What's your project?</h1>
		<div class="w-full space-y-2">
			<div class="justify-center">
				<ProjectForm project={{}} {onSave} />
			</div>
		</div>
	</div>
</div> -->

<section class="w-full bg-surface-900 py-12 md:py-24 lg:py-32 xl:py-48">
	<div class="container px-4 md:px-6">
		<div
			class="grid items-center gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]"
		>
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<h1
						class="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl/none"
					>
						We help you grow your app - with zero budget!
					</h1>
					<p class="max-w-[600px] text-primary-500 md:text-xl">
						IndieGrow is the ultimate SaaS product that helps indie developers grow their apps
						without spending a dime. Leverage our powerful marketing tools, user acquisition
						strategies, and monetization features to take your app to new heights.
					</p>
				</div>
				<div class="flex flex-col gap-2 min-[400px]:flex-row">
					<a
						class="variant-filled-secondary inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-800 disabled:pointer-events-none disabled:opacity-50"
						href="/projects"
					>
						Get Started
					</a>
					<a
						class="inline-flex h-10 items-center justify-center rounded-md border bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-secondary-300 hover:text-primary-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-900 disabled:pointer-events-none disabled:opacity-50 dark:border-green-500 dark:bg-primary-900 dark:hover:bg-green-500 dark:hover:text-white dark:focus-visible:ring-green-500"
						href="/about"
					>
						Learn More
					</a>
				</div>
				<WaitingListForm />
			</div>
			<img
				src="/placeholder.svg"
				width="650"
				height="450"
				alt="IndieGrow Screenshot"
				class="mx-auto aspect-[13/9] overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
			/>
		</div>
	</div>
</section>

<section class="w-full bg-blue-800 py-12 md:py-24 lg:py-32 xl:py-48">
	<div class="container px-4 md:px-6">
		<div
			class="grid items-center gap-6 lg:grid-cols-[650px_1fr] lg:gap-12 xl:grid-cols-[650px_1fr]"
		>
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<h2
						class="text-2xl font-bold tracking-tighter text-white sm:text-3xl md:text-4xl lg:text-5xl/none"
					>
						Improve your AppStore content
					</h2>
					<p class="max-w-[600px] text-secondary-300 md:text-xl">
						Using best practices and AI Magic, we'll help you craft the perfect App Store content to
						attract more users and boost your downloads. Our AI-powered tools analyze your
						competition and provide personalized recommendations to optimize your app listings,
						screenshots, and descriptions.
					</p>
				</div>
				<div class="flex flex-col gap-2 min-[400px]:flex-row">
					<a
						class="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-blue-800 shadow transition-colors hover:bg-secondary-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-800 disabled:pointer-events-none disabled:opacity-50"
						href="#"
					>
						Optimize Now
					</a>
					<a
						class="inline-flex h-10 items-center justify-center rounded-md border border-secondary-300 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-secondary-300 hover:text-primary-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-900 disabled:pointer-events-none disabled:opacity-50 dark:border-green-500 dark:bg-primary-900 dark:hover:bg-green-500 dark:hover:text-white dark:focus-visible:ring-green-500"
						href="#"
					>
						Learn More
					</a>
				</div>
			</div>
			<img
				src="/placeholder.svg"
				width="650"
				height="450"
				alt="App Store Content"
				class="mx-auto aspect-[13/9] overflow-hidden rounded-xl object-cover object-center sm:w-full"
			/>
		</div>
	</div>
</section>

<section class="w-full bg-white py-12 md:py-24 lg:py-32 xl:py-48">
	<div class="container px-4 md:px-6">
		<div
			class="grid items-center gap-6 lg:grid-cols-[550px_1fr] lg:gap-12 xl:grid-cols-[650px_1fr]"
		>
			<img
				src="/placeholder.svg"
				width="650"
				height="450"
				alt="Competitor Analysis"
				class="mx-auto aspect-[13/9] overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-first"
			/>
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<h2
						class="text-2xl font-bold tracking-tighter text-blue-800 sm:text-3xl md:text-4xl lg:text-5xl/none"
					>
						Automatic competitor analysis
					</h2>
					<p class="max-w-[600px] text-primary-900 dark:text-green-500 md:text-xl">
						Learn from your competition, improve your positioning and differentiation.
					</p>
				</div>
				<div class="flex flex-col gap-2 min-[400px]:flex-row">
					<a
						class="inline-flex h-10 items-center justify-center rounded-md bg-blue-800 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-800 disabled:pointer-events-none disabled:opacity-50"
						href="#"
					>
						Analyze Now
					</a>
					<a
						class="inline-flex h-10 items-center justify-center rounded-md border border-secondary-300 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-secondary-300 hover:text-primary-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-900 disabled:pointer-events-none disabled:opacity-50 dark:border-green-500 dark:bg-primary-900 dark:hover:bg-green-500 dark:hover:text-white dark:focus-visible:ring-green-500"
						href="#"
					>
						Learn More
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
