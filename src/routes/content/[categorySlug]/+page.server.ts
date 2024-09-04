import { error } from '@sveltejs/kit';
import contentfulFetch from '$lib/contentful-fetch';

function postsQuery(categorySlug: string) {
	return `
{
  postCollection(where: { category: { slug: "${categorySlug}" } }){
    items {
      slug
      title
	  teaser

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

  	  sys {
        publishedAt
      }
    }
  }
}
	`;
}

async function loadPosts(categorySlug: string) {
	const query = postsQuery(categorySlug);
	const postsResponse = await contentfulFetch(query, false);
	if (!postsResponse.ok) {
		throw error(postsResponse.status, {
			message: postsResponse.statusText
		});
	}
	const postsData = await postsResponse.json();
	const { items: posts } = postsData.data.postCollection;
	posts.forEach((post) => {
		post.publishedAt = new Date(post.sys.publishedAt).toLocaleDateString('en-us', {
			weekday: 'long',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	});
	return posts;
}

export async function load({ params }) {
	const posts = await loadPosts(params.categorySlug);
	const category = posts[0].category;

	return {
		category,
		posts
	};
}
