import { error } from '@sveltejs/kit';
import contentfulFetch from '$lib/contentful-fetch';

const categoriesQuery = `
{
	categoryCollection{
    items{
		slug
        title
    }
  }
}
`;

const postsQuery = `
{
  postCollection( limit: 100) {
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

async function loadCategories() {
	const categoriesResponse = await contentfulFetch(categoriesQuery);
	if (!categoriesResponse.ok) {
		throw error(categoriesResponse.status, {
			message: categoriesResponse.statusText
		});
	}
	const categoriesData = await categoriesResponse.json();
	const { items: categories } = categoriesData.data.categoryCollection;
	return categories;
}

async function loadPosts() {
	const postsResponse = await contentfulFetch(postsQuery);
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

export async function load() {
	const categories = await loadCategories();
	const posts = await loadPosts();

	return {
		categories,
		posts
	};
}
