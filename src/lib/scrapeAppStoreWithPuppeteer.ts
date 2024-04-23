import type { AppStoreInfo } from './scraping';

// works locally on osx
// import puppeteer from "puppeteer";
// async function getBrowser() {
//   return puppeteer.launch({
//     headless: true,
//   });
// }

// works on heroku, but not vercel cloud
// needs buildpack: heroku buildpacks:remove  jontewks/puppeteer --app indiegrow
// import chromium  from '@sparticuz/chromium-min';
// import puppeteer from "puppeteer-core";
// async function getBrowser() {
//     return puppeteer.launch({
//       args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
//       defaultViewport: chromium.defaultViewport,
//       executablePath: await chromium.executablePath(
//         `https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar`
//       ),
//       headless: chromium.headless,
//       ignoreHTTPSErrors: true,
//     });
// }

// export async function extractAppStoreContentWithBrowser(appStoreUrl: string): Promise<AppStoreInfo> {
//   console.log("Analyzing App Store URL: ", appStoreUrl);
//   const browser = await getBrowser()

//   const page = await browser.newPage();
//   await page.setViewport({ width: 2560, height: 1280 });

//   await page.goto(appStoreUrl, { waitUntil: "networkidle0" });

//   const descriptionSelector =
//     "body > div.ember-view > main > div.animation-wrapper.is-visible > section:nth-child(4) > div > div > div";
//   const descriptionElement = await page.$(descriptionSelector);
//   if (!descriptionElement) {
//     throw new Error(
//       `Could not find description element with selector: ${descriptionSelector}`
//     );
//   }
//   let description = await page.evaluate((e) => e.textContent, descriptionElement);
//   if (!description) {
//     throw new Error(
//       `No description found for selector: ${descriptionSelector}`
//     );
//   }
//   description = description.trim();

//   console.log("Extracted content: ", description);

//   const screenShotsElement = await page.$(
//     "body > div.ember-view > main > div.animation-wrapper.is-visible > section:nth-child(3) > div:nth-child(2) > div"
//   );
//   if (!screenShotsElement) {
//     throw new Error(`Could not find screenshots element`);
//   }
//   const screenshot = await screenShotsElement.screenshot({
//     encoding: 'base64',
//   });

//   // close the browser so we don't leak memory
//   await browser.close();

//   const screenshotUrl = `data:image/png;base64,${screenshot}`

//   return { description, screenshot: [screenshotUrl]};
// }
