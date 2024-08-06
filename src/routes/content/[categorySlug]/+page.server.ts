import { error } from '@sveltejs/kit';
import contentfulFetch from '$lib/contentful-fetch';

function postsQuery(categorySlug: string) {
	return `
	{
		postCollection(where: { category: { slug: "${categorySlug}" } }) {
			items {
				slug
				title
				category {
					slug
					title
				}
			}
		}
	}
	`;
}

export async function load({ params }) {
	const categorySlug = params.categorySlug;
	const postsResponse = await contentfulFetch(postsQuery(categorySlug));
	if (!postsResponse.ok) {
		throw error(postsResponse.status, {
			message: postsResponse.statusText
		});
	}

	const postsData = await postsResponse.json();
	const posts = postsData.data.postCollection.items;
	const category = posts[0].category;

	return {
		category,
		posts
	};
}
