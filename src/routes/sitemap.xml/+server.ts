import { error } from '@sveltejs/kit';
import contentfulFetch from '$lib/contentful-fetch';

function postsQuery() {
	return `
{
  postCollection( limit: 100) {
    items {
      slug

      category {
        slug
      }

  	  sys {
        publishedAt
      }
    }
  }
}
`;
}

async function loadPosts() {
	const postsResponse = await contentfulFetch(postsQuery(), false);
	if (!postsResponse.ok) {
		throw error(postsResponse.status, {
			message: postsResponse.statusText
		});
	}
	const postsData = await postsResponse.json();
	const { items: posts } = postsData.data.postCollection;
	return posts;
}

export async function GET() {
	const today = new Date().toISOString();
	const pagesArr = [
		{
			url: 'https://indiegrow.dev/',
			frequency: 'weekly',
			lastmod: today
		},
		{
			url: 'https://indiegrow.dev/content/blog',
			frequency: 'weekly',
			lastmod: today
		}
	];

	const posts = await loadPosts();
	posts.forEach((post) => {
		pagesArr.push({
			url: `https://indiegrow.dev/content/${post.category.slug}/${post.slug}`,
			lastmod: new Date(post.sys.publishedAt).toISOString(),
			frequency: 'never'
		});
	});

	return new Response(
		`
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>
${pagesArr
	.map(
		(page) =>
			`
      <url>
        <loc>${page.url}</loc>
        <changefreq>${page.frequency}</changefreq>
        <lastmod>${page.lastmod}</lastmod>
      </url>
    `
	)
	.join('')}
		</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
