import { error } from '@sveltejs/kit';
import contentfulFetch from '$lib/contentful-fetch';

function categoriesQuery(preview: boolean) {
	return `
{
	categoryCollection(preview: ${preview}){
    items{
		slug
        title
    }
  }
}
`;
}

function postsQuery(preview: boolean) {
	return `
{
  postCollection( limit: 100, preview: ${preview}) {
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

async function loadCategories(preview: boolean) {
	const categoriesResponse = await contentfulFetch(categoriesQuery(preview), preview);
	if (!categoriesResponse.ok) {
		throw error(categoriesResponse.status, {
			message: categoriesResponse.statusText
		});
	}
	const categoriesData = await categoriesResponse.json();
	const { items: categories } = categoriesData.data.categoryCollection;
	return categories;
}

async function loadPosts(preview: boolean) {
	const postsResponse = await contentfulFetch(postsQuery(preview), preview);
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

export async function load({ url }) {
	const preview = url.searchParams.get('preview') == 'true';
	const categories = await loadCategories(preview);
	const posts = await loadPosts(preview);

	return {
		categories,
		posts
	};
}
