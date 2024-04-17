import { load } from "cheerio";

export type AppStoreInfo = {
  name: string;
  description: string;
  image: string;
  applicationCategory: string;
  datePublished: string;
  operatingSystem: string;
    author: {
        "@type": string;
        name: string;
        url: string;
    }
  screenshot: string[];
  offers: {
    "@type": string;
    price: string;
    priceCurrency: string;
  }
};

export async function scrapeAppstore(appStoreUrl: string): Promise<AppStoreInfo> {
  const response = await fetch(appStoreUrl, {mode: 'no-cors'});
  const html = await response.text()
  const $ = load(html);
  const metaDataJson = $(`[name=schema:software-application]`).html();

 if(!metaDataJson) {
    throw new Error("Could not find metadata json");
 }

 const info = JSON.parse(metaDataJson.toString()) as AppStoreInfo;


return info;
}
