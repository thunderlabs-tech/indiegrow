<script lang="ts">
	import { goto } from '$app/navigation';
	import ProjectForm from '$lib/components/ProjectForm.svelte';
	import WaitingListForm from '$lib/components/WaitingListForm.svelte';

	function onSave() {
		goto('/projects');
	}
</script>

<section class="lg:py-18 w-full items-center bg-surface-900 py-12 md:py-16 xl:py-24">
	<div class="container px-4 md:px-8">
		<div class="grid items-center gap-4 lg:grid-cols-[1fr_550px] lg:gap-8 xl:grid-cols-[1fr_650px]">
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-4">
					<h1
						class="h1 text-3xl font-bold tracking-tighter text-primary-500 sm:text-4xl md:text-5xl lg:text-6xl/none"
					>
						We help you grow your app - with zero budget!
					</h1>
					<p class="max-w-[600px] text-secondary-50 md:text-xl">
						Indiegrow is the easiest to use SaaS product for indie developers to grow their apps
						without spending a dime. Use our automatic competitor analysis and ASO tools to take
						your app to the next level.
					</p>
				</div>
				<WaitingListForm />
			</div>
			<img
				style="border-radius:80px;   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);;"
				src="/screenshots/mobile-view.png"
				alt="IndieGrow Screenshot"
				class="mx-auto overflow-hidden rounded-xl object-cover object-center lg:order-last"
			/>
		</div>
	</div>
</section>

<section class="w-full bg-surface-800 py-12 md:py-16 xl:py-24">
	<div class="container px-4 md:px-6">
		<div
			class="grid items-center gap-6 lg:grid-cols-[550px_1fr] lg:gap-12 xl:grid-cols-[650px_1fr]"
		>
			<img
				src="/screenshots/competition.png"
				width="650"
				alt="Competitor Analysis"
				class="mx-auto overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-first"
			/>
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<h2
						class="text-2xl font-bold tracking-tighter text-primary-500 sm:text-3xl md:text-4xl lg:text-5xl/none"
					>
						Automated competitor analysis
					</h2>
					<p class="max-w-[600px] dark:text-secondary-300 md:text-xl">
						Learn from your competition, improve your positioning and differentiation.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="w-full bg-surface-700 py-12 md:py-16 xl:py-24">
	<div class="container px-4 md:px-6">
		<div
			class="grid items-center gap-6 lg:grid-cols-[650px_1fr] lg:gap-12 xl:grid-cols-[650px_1fr]"
		>
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<h2
						class="text-2xl font-bold tracking-tighter text-primary-500 sm:text-3xl md:text-4xl lg:text-5xl/none"
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
			</div>
			<img
				src="/screenshots/improve-appstore-content.png"
				width="650"
				alt="App Store Content"
				class="mx-auto overflow-hidden rounded-xl object-cover object-center sm:w-full"
			/>
		</div>
	</div>
</section>

<section class="w-full items-center bg-surface-900 py-12">
	<div class="container px-4 md:px-8">
		<div class="grid items-center gap-4 lg:grid-cols-[1fr_550px] lg:gap-8 xl:grid-cols-[1fr_650px]">
			<div class="flex flex-col justify-center space-y-4">
				<WaitingListForm />
			</div>
		</div>
	</div>
</section>
