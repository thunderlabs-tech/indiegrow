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

export async function load() {
	const categoriesResponse = await contentfulFetch(categoriesQuery);
	if (!categoriesResponse.ok) {
		throw error(categoriesResponse.status, {
			message: categoriesResponse.statusText
		});
	}
	const categoriesData = await categoriesResponse.json();
	const { items: categories } = categoriesData.data.categoryCollection;

	return {
		categories
	};
}
