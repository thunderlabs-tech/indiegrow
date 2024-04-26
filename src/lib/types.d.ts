import type { OgObject } from 'open-graph-scraper/dist/lib/types';

export type WebsiteInfo = {
	html: string;
	ogObject: OgObject;
};

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

export type ProductMarketingAnalysis = {
	brandName: string;
	oneLinePitch: string;
	productType: string;
	targetAudience: string;
	keyFeatures: string[];
	keyBenefits: string[];
	positioning: string;
};

export type Competitor = {
	websiteUrl: string;
	websiteInfo: WebsiteInfo | undefined;

	appStoreUrl: string | undefined;
	appStoreInfo: AppStoreInfo | undefined;

	productMarketingAnalysis: ProductMarketingAnalysis | undefined;
};

export interface ImprovementSuggestion {
	suggestion: string;
	explanation: string;
}
export interface ImprovementSuggestions {
	name: ImprovementSuggestion;
	description: ImprovementSuggestion;
	category: ImprovementSuggestion;
	screenshots: ImprovementSuggestion;
}

export interface Project {
	name: string | undefined;
	description: string | undefined;

	websiteUrl: string | undefined;
	websiteInfo: WebsiteInfo | undefined;

	appStoreUrl: string | undefined;
	appStoreInfo: AppStoreInfo | undefined;

	competitors: Competitor[] | undefined;

	suggestions: ImprovementSuggestions | undefined;
}

export const emptyProject: Project = {
	name: undefined,
	description: undefined,
	url: undefined,
	appStoreInfo: undefined,
	suggestions: undefined
};

export interface Competitor {
	url: string;
	appStoreInfo: AppStoreInfo;
}
