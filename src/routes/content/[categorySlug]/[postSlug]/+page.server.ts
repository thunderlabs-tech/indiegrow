import { error } from '@sveltejs/kit';
import contentfulFetch from '$lib/contentful-fetch';

function postsQuery(postSlug: string) {
	return `
	{
		postCollection(where: { slug: "${postSlug}" }, limit: 1) {
			items {
				slug
				title
				category {
					title
				}

				content {
					json
					links{
					assets {
						block {
						sys {
							id
						}
						title
						description
						contentType
						fileName
						size
						url
						width
						height
						}
					}
					}
				}
			}
		}
	}
	`;
}

export async function load({ params }) {
	const postSlug = params.postSlug;
	const postsResponse = await contentfulFetch(postsQuery(postSlug));
	if (!postsResponse.ok) {
		throw error(postsResponse.status, {
			message: postsResponse.statusText
		});
	}

	const postsData = await postsResponse.json();
	const posts = postsData.data.postCollection.items;
	const post = posts[0];
	const category = post.category;

	return {
		category,
		post
	};
}
