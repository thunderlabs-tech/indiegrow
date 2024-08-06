import { error } from '@sveltejs/kit';
import contentfulFetch from '$lib/contentful-fetch';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

// const query = `
// {
// 	blogPage{
//     items{
//       name,
//       jobTitle
//       startDate
//       photo {
//         url(transform: {
//           format: AVIF
//         })
//         description
//       }
//     }
//   }
// }
// `

const query = `
{
	postCollection{
    items{
        title
        content {
            json
        }
    }
  }
}
`;
export async function load() {
	const response = await contentfulFetch(query);

	console.log(response);
	if (!response.ok) {
		throw error(response.status, {
			message: response.statusText
		});
	}

	const { data } = await response.json();

	const { items: posts } = data.postCollection;
	console.log(posts[0].content.json);

	return {
		posts: posts.map((e) => {
			// const options = { month: 'long', year: 'numeric' };
			// const date = new Date(e.startDate);
			// const formattedStartDate = new Intl.DateTimeFormat('en-US', options).format(date);

			return {
				...e,
				content: documentToHtmlString(e.content.json)
				// startDate: formattedStartDate
			};
		})
	};
}
