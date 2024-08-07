import { error } from '@sveltejs/kit';
import contentfulFetch from '$lib/contentful-fetch';

function postsQuery(postSlug: string, preview: boolean) {
	return `
{
	postCollection(where: { slug: "${postSlug}"}, limit: 1, preview: ${preview}) {
		items {
			slug
			title

			category {
				title
				slug
			}

			image{
				title
				url(transform: {
				width: 480
				})
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

			sys {
				publishedAt
			}
		}
	}
}
	`;
}

export async function load({ params, url }) {
	const postSlug = params.postSlug;
	const preview = url.searchParams.get('preview') == 'true';
	const query = postsQuery(postSlug, preview);
	const postsResponse = await contentfulFetch(query, preview);
	if (!postsResponse.ok) {
		throw error(postsResponse.status, {
			message: postsResponse.statusText
		});
	}

	const postsData = await postsResponse.json();
	const posts = postsData.data.postCollection.items;
	if (posts.length === 0) {
		throw error(404, {
			message: 'Post not found'
		});
	}
	const post = posts[0];
	post.publishedAt = new Date(post.sys.publishedAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	const category = post.category;

	return {
		category,
		post
	};
}
