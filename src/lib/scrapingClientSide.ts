import type { AppStoreInfo, WebsiteInfo } from './types';

export async function scrapeAppStoreInfo(appStoreUrl: string): Promise<AppStoreInfo> {
	const response = await fetch('/api/scrape/appstore', {
		method: 'POST',
		body: JSON.stringify({ url: appStoreUrl }),
		headers: { 'content-type': 'application/json' }
	});
	return (await response.json()) as AppStoreInfo;
}

export async function scrapeWebsiteInfo(websiteUrl: string): Promise<WebsiteInfo> {
	const response = await fetch('/api/scrape/website', {
		method: 'POST',
		body: JSON.stringify({ url: websiteUrl }),
		headers: { 'content-type': 'application/json' }
	});
	return (await response.json()) as WebsiteInfo;
}
