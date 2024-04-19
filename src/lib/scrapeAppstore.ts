import { load } from 'cheerio';

export type AppStoreInfo = {
	'@context': string;
	'@type': string;
	name: string;
	description: string;
	image: string;
	applicationCategory: string;
	datePublished: string;
	operatingSystem: string;
	author: {
		'@type': string;
		name: string;
		url: string;
	};
	screenshot: string[];
	offers: {
		'@type': string;
		price: number;
		priceCurrency: string;
		category: string;
	};
};

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

	//  info.screenshot = [info.screenshot[info.screenshot.length - 1]];

	return info;
}
