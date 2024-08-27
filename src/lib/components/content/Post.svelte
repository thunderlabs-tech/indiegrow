<script lang="ts">
	export let post: any;
</script>

<a
	class="block p-4 hover:card hover:variant-soft"
	href="/content/{post.category.slug}/{post.slug}"
	data-sveltekit-preload-data="hover"
>
	<article class="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr] lg:gap-8">
		<img
			class="aspect-video w-full bg-black/50 bg-cover bg-center shadow-xl rounded-container-token lg:max-w-sm"
			src={post.image.url}
			alt={post.image.title}
		/>
		<div class="space-y-4">
			<time class="block">{post.publishedAt} </time>
			<h2 class="h2">{post.title}</h2>
			<p>
				{post.teaser}
			</p>
			<div class="flex items-center space-x-4">
				<a href="/content/{post.category.slug}">
					<span class="text-xs font-bold opacity-50">{post.category.title}</span>
				</a>
			</div>
			<button class="variant-filled btn">Read post →</button>
		</div>
	</article>
</a>
