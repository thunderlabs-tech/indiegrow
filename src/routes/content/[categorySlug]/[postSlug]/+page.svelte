<script lang="ts">
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
	import { BLOCKS } from '@contentful/rich-text-types';

	// inspired by:
	// https://www.contentful.com/developers/docs/concepts/rich-text/
	// Create a bespoke renderOptions object to target
	// BLOCKS.EMBEDDED_ASSET (linked assets e.g. images)
	function renderOptions(links) {
		// create an asset block map
		const assetBlockMap = new Map();
		// loop through the assets and add them to the map
		for (const asset of links.assets.block) {
			console.log('asset', asset);
			assetBlockMap.set(asset.sys.id, asset);
		}

		return {
			// other options...

			renderNode: {
				[BLOCKS.EMBEDDED_ASSET]: (node) => {
					// find the asset in the assetBlockMap by ID
					const asset = assetBlockMap.get(node.data.target.sys.id);

					// render the asset accordingly
					return `<img class="embedded-img" src="${asset.url}" alt="${asset.description}" />`;
				}
			}
		};
	}

	export let data;
	const post = data.post;

	const options = renderOptions(post.content.links);
	const htmlContent = documentToHtmlString(post.content.json, options);

	function calculateReadingTime(content: string) {
		const wpm = 225;
		const words = content.trim().split(/\s+/).length;
		const time = Math.ceil(words / wpm);
		return time;
	}

	const readingTime = calculateReadingTime(htmlContent);
</script>

<div class="mx-auto max-w-5xl space-y-8 p-4 md:p-12">
	<ol class="breadcrumb">
		<li class="crumb"><a class="anchor" href="/blog">Blog</a></li>
		<li class="crumb-separator" aria-hidden="true">›</li>
		<li>Article</li>
	</ol>
	<header class="space-y-4">
		<div class="blog-meta flex items-center justify-between">
			<time class="time block">{post.publishedAt}</time>
			<span class="hidden text-xs opacity-50 md:block">{readingTime} min read</span>
		</div>
		<h1 class="h1">{post.title}</h1>
		<div class="flex items-center space-x-4 py-4">
			<figure
				class="avatar bg-surface-400-500-token isolate flex aspect-square w-16 items-center justify-center overflow-hidden rounded-full font-semibold text-surface-50"
				data-testid="avatar"
				alt="Ionut Ciobotaru"
			>
				<img
					class="avatar-image w-full object-cover"
					style=""
					src="/images/ionut_profile.jpeg"
					alt="Ionut Ciobotaru"
				/>
			</figure>
			<div>
				<a
					class="text-md anchor text-secondary-500"
					href="https://www.linkedin.com/in/ionutciobotaru/">Ionut Ciobotaru</a
				>
			</div>
		</div>
		<img
			src={post.image.url}
			alt={post.image.title}
			class="aspect-video w-full shadow-xl rounded-container-token"
		/>
	</header>
	<article class="prose-lg max-w-full space-y-2">
		{@html htmlContent}
	</article>
	<footer class="card variant-glass-surface mb-28 flex items-center justify-between p-4">
		<div class="flex items-center space-x-4">
			<a href="/content/{post.category.slug}" class="text-sm font-bold capitalize opacity-50"
				>{post.category.title}</a
			>
		</div>
		<button class="variant-ghost-surface btn">Scroll to Top ↑</button>
	</footer>
</div>

<style>
	:global(img.embedded-img) {
		/* width: 40%; */
	}
</style>
