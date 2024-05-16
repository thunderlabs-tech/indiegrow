import { load } from 'cheerio';
import type { AppStoreInfo } from '$lib/types';

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
