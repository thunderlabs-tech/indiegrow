<script lang="ts">
	import WaitingListForm from '$lib/components/WaitingListForm.svelte';

	const containerClasses = 'section-container mx-auto max-w-5xl px-4 md:px-8';
	const sectionPaddingClasses = 'py-12 md:py-16 md:pb-28 xl:py-24 xl:pb-36';
</script>

<header
	id="hero"
	class="hero-gradient bg-surface-500-50-token items-center {sectionPaddingClasses}"
>
	<div class={containerClasses}>
		<div class="mx-auto grid-cols-1 items-center justify-center gap-4 text-center lg:gap-8">
			<h1 class="h1 text-xl sm:text-3xl md:text-4xl lg:text-6xl/none">
				Grow Your App’s User Base with <strong> IndieGrow </strong> — No Budget Required!
			</h1>
			<div class="mb-4 mt-4 flex w-full justify-center">
				<p class="w-full text-xs md:w-3/4 md:text-lg lg:w-2/3">
					The simplest way for indie developers to boost app growth — without breaking the bank. 
				</p>
			</div>
			<div id="signup" class="mb-4 mt-4 flex justify-center">
				<WaitingListForm />
			</div>
			<!-- <img
				style="border-radius:80px;   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);;"
				src="/screenshots/mobile-view.webp"
				alt="IndieGrow Screenshot"
				class="mx-auto overflow-hidden rounded-xl object-cover object-center lg:order-last"
			/> -->
		</div>
	</div>
</header>

<section
	class="rounded-top-corners w-full bg-surface-500 text-white {sectionPaddingClasses}"
	id="features"
>
	<div class={containerClasses}>
		<div
			class="grid items-center gap-4 lg:grid-cols-[550px_1fr] lg:gap-12 xl:grid-cols-[650px_1fr]"
		>
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<h2
						class="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none"
						id="competitor-analysis"
					>
						Automated Competitor Analysis
					</h2>
					<p class="max-w-[600px] text-secondary-200 md:text-xl">
						Track competitors with real-time data on their app rankings, user reviews, and marketing strategies. See what key benefits they’re targeting and get insights on their top-performing features to stay ahead.
					</p>
				</div>
			</div>
			<img
				src="/screenshots/competition.webp"
				width="650"
				alt="Competitor Analysis"
				class="mx-auto overflow-hidden rounded-xl border-[15px] border-surface-300/50 object-cover object-center sm:w-full lg:order-first"
			/>
		</div>
	</div>
</section>

<section class="rounded-top-corners w-full bg-surface-900 text-white {sectionPaddingClasses}">
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
						AppStore Search Optimization (ASO) Improvements
					</h2>
					<p class="max-w-[600px] text-secondary-200 md:text-xl">
						Get AI-driven suggestions for your app’s title, description, and keywords, optimized for visibility and user engagement. These insights are based on successful apps in your category and ASO best practices.
					</p>
				</div>
			</div>
			<img
				src="/screenshots/improve-appstore-content.webp"
				width="650"
				alt="App Store Search Optimization - ASO - Content"
				class="mx-auto overflow-hidden rounded-xl border-[15px] border-surface-300/50 object-cover object-center sm:w-full"
			/>
		</div>
	</div>
</section>

<section class=" rounded-top-corners w-full bg-surface-500 text-white {sectionPaddingClasses}">
	<div class={containerClasses}>
		<div
			class="grid items-center gap-6 lg:grid-cols-[550px_1fr] lg:gap-12 xl:grid-cols-[650px_1fr]"
		>
			<div class="flex flex-col justify-center space-y-4">
				<div class="space-y-2">
					<h2
						class="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none"
						id="community-pulse"
					>
						Community Pulse
					</h2>
					<p class="max-w-[600px] text-secondary-200 md:text-xl">
						If you're solving a real problem there are probably thousands of people talking about it in online communities like Reddit. We can help you find the right conversations relevant for your app and generate meaningful responses promoting your app
					</p>
				</div>
			</div>
			<img
				src="/screenshots/community-pulse.webp"
				width="650"
				alt="Community Pulse"
				class="mx-auto overflow-hidden rounded-xl border-[15px] border-surface-300/50 object-cover object-center sm:w-full lg:order-first"
			/>
		</div>
	</div>
</section>

<section class=" rounded-top-corners w-full items-center bg-surface-50 {sectionPaddingClasses}">
	<div class={containerClasses}>
		<div class="grid items-center gap-4">
			<div class="mb-4 mt-4 flex justify-center">
				<WaitingListForm />
			</div>
		</div>
	</div>
</section>
