<script lang="ts">
	import WaitingListForm from '$lib/components/WaitingListForm.svelte';

	const containerClasses = 'section-container mx-auto max-w-5xl px-4 md:px-8';
</script>

<header
	id="hero"
	class="hero-gradient bg-surface-500-50-token items-center py-12 md:py-16 xl:py-24"
>
	<div class={containerClasses}>
		<div class="mx-auto grid grid-cols-1 gap-4 text-center lg:gap-8">
			<h1 class="h1 text-3xl text-secondary-500 sm:text-4xl md:text-5xl lg:text-6xl/none">
				IndieGrow helps you grow your app - with zero budget!
			</h1>
			<p class=" text-secondary-500 md:text-xl">
				Indiegrow is the easiest to use SaaS product for indie developers to grow their apps without
				spending a dime.
			</p>
			<WaitingListForm />
			<!-- <img
				style="border-radius:80px;   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);;"
				src="/screenshots/mobile-view.webp"
				alt="IndieGrow Screenshot"
				class="mx-auto overflow-hidden rounded-xl object-cover object-center lg:order-last"
			/> -->
		</div>
	</div>
</header>

<section class="w-full bg-surface-500 py-12 text-white md:py-16 xl:py-24" id="features">
	<div class={containerClasses}>
		<div
			class="grid items-center gap-6 lg:grid-cols-[550px_1fr] lg:gap-12 xl:grid-cols-[650px_1fr]"
		>
			<img
				src="/screenshots/competition.webp"
				width="650"
				alt="Competitor Analysis"
				class="mx-auto overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-first"
			/>
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<h2
						class="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none"
						id="competitor-analysis"
					>
						Automated competitor analysis
					</h2>
					<p class="max-w-[600px] text-secondary-200 md:text-xl">
						Learn from your competition, improve your positioning and differentiation.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="w-full bg-surface-900 py-12 text-white md:py-16 xl:py-24">
	<div class={containerClasses}>
		<div
			class="grid items-center gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]"
		>
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<h2
						class=":text-3xl text-2xl font-bold tracking-tighter md:text-4xl lg:text-5xl/none"
						id="appstore-content"
					>
						Improve your AppStore content
					</h2>
					<p class="max-w-[600px] text-xl text-secondary-200">
						Using best practices and AI Magic, we'll help you craft the perfect App Store content to
						attract more users and boost your downloads.
					</p>
				</div>
			</div>
			<img
				src="/screenshots/improve-appstore-content.webp"
				width="650"
				alt="App Store Content"
				class="mx-auto overflow-hidden rounded-xl object-cover object-center sm:w-full"
			/>
		</div>
	</div>
</section>

<section class="w-full bg-surface-500 py-12 text-white md:py-16 xl:py-24">
	<div class={containerClasses}>
		<div
			class="grid items-center gap-6 lg:grid-cols-[550px_1fr] lg:gap-12 xl:grid-cols-[650px_1fr]"
		>
			<img
				src="/screenshots/community-pulse.webp"
				width="650"
				alt="Community Pulse"
				class="mx-auto overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-first"
			/>
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<h2
						class="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none"
						id="community-pulse"
					>
						Community Pulse
					</h2>
					<p class="max-w-[600px] dark:text-secondary-200 md:text-xl">
						If you're solving a real problem there probably are thousands of people talking about it
						in online communities like reddit. We can help you find the right community conversation
						relevant for your app and generate a meaningful response promoting your app.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="w-full items-center bg-surface-50 py-12">
	<div class={containerClasses}>
		<div class="grid items-center gap-4">
			<div class="flex flex-col justify-center space-y-4">
				<WaitingListForm />
			</div>
		</div>
	</div>
</section>
