import { load } from 'cheerio';
import type { AppStoreInfo, WebsiteInfo } from './types';
import unfluff from 'unfluff';

export async function scrapeAppstore(appStoreUrl: string): Promise<AppStoreInfo> {
	const response = await fetch(appStoreUrl);
	const html = await response.text();
	const $ = load(html);
	const metaDataJson = $(`[name=schema:software-application]`).html();

	if (!metaDataJson) {
		throw new Error('Could not find metadata json');
	}

	const info = JSON.parse(metaDataJson.toString()) as AppStoreInfo;

	// filter for iPhone screenshots only
	info.screenshot = info.screenshot.filter((url: string) => {
		return url.match(/300x0w/);
	});

	return info;
}

import ogs from 'open-graph-scraper';

export async function scrapeWebsite(url: string): Promise<WebsiteInfo> {
	const fetchResponse = await fetch(url);
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
