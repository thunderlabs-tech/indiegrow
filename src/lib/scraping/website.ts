import ogs from 'open-graph-scraper';
import unfluff from 'unfluff';

import type { WebsiteInfo } from '$lib/types';
export async function scrapeWebsite(url: string): Promise<WebsiteInfo> {
	const fetchResponse = await fetch(url, {
		headers: {
			accept:
				'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
			'accept-language': 'en-US,en;q=0.9',
			'cache-control': 'no-cache',
			pragma: 'no-cache',
			'upgrade-insecure-requests': '1',
			'User-Agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
		},
		referrerPolicy: 'strict-origin-when-cross-origin',
		body: null,
		method: 'GET',
		mode: 'cors',
		credentials: 'omit'
	});

	const fetchHtml = await fetchResponse.text();

	const { error, html, result, response } = await ogs({ html: fetchHtml });

	const data = unfluff(html);

	const info: WebsiteInfo = {
		html: fetchHtml,
		text: data.text,
		ogObject: result
	};

	return info;
}
