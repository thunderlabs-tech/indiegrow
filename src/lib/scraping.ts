import { load } from 'cheerio';
import type { AppStoreInfo, WebsiteInfo } from './types';
import unfluff from 'unfluff';

export const exampleUrl =
	'https://apps.apple.com/tt/app/connected-living-messenger/id1543400123?platform=iphone';

export const exampleAppStoreInfo = {
	'@context': 'http://schema.org',
	'@type': 'SoftwareApplication',
	name: 'Connected Living Messenger',
	description:
		"Connected Living Messenger is a chat app for neighbors who live in the same apartment building or complex. Start group chats shared with everyone in your community or send private direct messages. New members join your community by invite only, keeping it safe and secure.\n\nWith Connected Living Messenger, you can:\n\n- Message your neighbors without sharing your phone number\n- Join group channels for public discussions\n- Automatically translate messages into your preferred language (German or English)\n- Create a user profile that is only visible to people in your building\n- Use the building directory in the app to find someone by name or floor\n\nGETTING STARTED\n\nTo get started simply install the app and you'll be prompted for an invite code to join an existing community. Otherwise you can create a new community and we'll help you get your neighbors on board!\n\nTake a look at our founder page for more information on starting a new community: https://connectedliving.chat/founder\n\nMISSION\n\nOur mission is to make urban life sustainable. By connecting people who live together we can make our lives a little bit more sustainable by:\n\n1. AVOIDING UNNECESSARY PURCHASES\n   Asking to borrow something instead of buying it reduces emissions and saves you money and space at home\n\n2. REDUCING FOOD WASTE\n   Sharing food when you have more than you need reduces waste\n\n3. FIGHTING ISOLATION\n   Loneliness is a growing health epidemic. People who are connected, however, report lower levels of anxiety and depression\n\n4. BUILDING RESILIENT COMMUNITIES\n   The smallest step we can take towards building a community is being able to talk to each other. If we can build that first connection, we can help transform a group of people in the same place into a community making us all more resilient in crises\n\nLearn more on our mission page https://connectedliving.chat/mission\n\nQUESTIONS, COMMENTS?\n\nIf you have any questions or you get stuck on anything, don't hesitate to reach out to us at support@connectedliving.chat. We're happy to help!",
	screenshot: [
		'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/59/97/17/59971761-64a1-53c8-e942-3a4aba1d22c4/6cf19a79-0601-41b2-94a1-d8767333bfb8_screenshot1.jpeg/300x0w.jpg',
		'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/80/91/b0/8091b0eb-030f-c895-dd4c-ceeac21c5758/a4305911-59cd-4943-84a1-633e747158f7_screenshot2.jpeg/300x0w.jpg',
		'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/39/be/d8/39bed8a0-bcd0-43f5-c166-7caf04aae242/292d5a1f-f926-4a1e-9017-9b1f98f4aed0_screenshot3.jpeg/300x0w.jpg',
		'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource116/v4/4e/a7/2c/4ea72cdb-0b28-5687-27f4-d9119af35edf/bcf3711a-3ae5-4d7a-a669-133b9c0d05a9_screenshot4.jpeg/300x0w.jpg',
		'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource116/v4/15/4c/98/154c9815-7f9c-8f12-0d0f-52896a8b11c3/ae5fb58f-65df-4efb-bddf-8cc94f0ad0e0_screenshot5.jpeg/300x0w.jpg',
		'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/72/25/9f/72259fad-a76e-69b3-5d96-72220a7804e6/058d3d51-e959-4561-a572-55a1a4c63211_screenshot6.jpeg/300x0w.jpg'
	],
	image:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/35/43/ba/3543ba37-6e39-6f10-5527-4611f6295f93/AppIcon-1x_U007epad-85-220.png/1200x630wa.png',
	applicationCategory: 'Social Networking',
	datePublished: '2 Apr 2021',
	operatingSystem: 'Requires iOS 13.0 or later. Compatible with iPhone, iPad and iPod touch.',
	author: {
		'@type': 'Person',
		name: 'Thunder Labs GmbH',
		url: 'https://apps.apple.com/tt/developer/thunder-labs-gmbh/id1543400125'
	},
	offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'free' }
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

import ogs from 'open-graph-scraper';

export async function scrapeWebsite(url: string): Promise<WebsiteInfo> {
	const fetchResponse = await fetch(url);
	const fetchHtml = await fetchResponse.text();

	const { error, html, result, response } = await ogs({ html: fetchHtml });

	const data = unfluff(html);
	console.log(data);

	const info: WebsiteInfo = {
		html: fetchHtml,
		text: data.text,
		ogObject: result
	};

	console.log(info);

	// const $ = load(fetchHtml);
	// const title = $('[property=og:title]').text();
	// const title = $('head > meta:nth-child(5)').text();
	// return { title };
	return info;
}
