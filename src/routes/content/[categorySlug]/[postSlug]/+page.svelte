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

	// Render richTextResponse.json to the DOM using
	// documentToReactComponents from "@contentful/rich-text-react-renderer"

	export let data;
	const post = data.post;

	const options = renderOptions(post.content.links);
	const html = documentToHtmlString(post.content.json, options);
</script>

<h1 class="h1">{post.title}</h1>

<section>
	{@html html}
</section>

<style>
	:global(img.embedded-img) {
		/* width: 40%; */
	}
</style>
