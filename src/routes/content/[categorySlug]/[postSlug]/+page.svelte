<script lang="ts">
	export let data;
	const post = data.post;
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
</script>

<h1 class="h1">{post.title}</h1>

<section>
	{@html documentToHtmlString(post.content.json)}
</section>
