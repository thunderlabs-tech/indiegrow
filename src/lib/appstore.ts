
// import puppeteer from "puppeteer";
// async function getBrowser() {
//   return puppeteer.launch({
//     headless: true,
//   });
// }


import chromium  from '@sparticuz/chromium-min';
import puppeteer from "puppeteer-core";
async function getBrowser() {
    return puppeteer.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar`
      ),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
}


export type ExtractionResult = {
  content: string;
  screenshotUrl: string
};

export async function extractAppStoreContent(appStoreUrl: string): Promise<ExtractionResult> {
  console.log("Analyzing App Store URL: ", appStoreUrl);
  const browser = await getBrowser()


  const page = await browser.newPage();
  await page.setViewport({ width: 2560, height: 1280 });

  await page.goto(appStoreUrl, { waitUntil: "networkidle0" });

  const descriptionSelector =
    "body > div.ember-view > main > div.animation-wrapper.is-visible > section:nth-child(4) > div > div > div";
  const descriptionElement = await page.$(descriptionSelector);
  if (!descriptionElement) {
    throw new Error(
      `Could not find description element with selector: ${descriptionSelector}`
    );
  }
  let content = await page.evaluate((e) => e.textContent, descriptionElement);
  if (!content) {
    throw new Error(
      `No description found for selector: ${descriptionSelector}`
    );
  }
  content = content.trim();

  console.log("Extracted content: ", content);

  const screenShotsElement = await page.$(
    "body > div.ember-view > main > div.animation-wrapper.is-visible > section:nth-child(3) > div:nth-child(2) > div"
  );
  if (!screenShotsElement) {
    throw new Error(`Could not find screenshots element`);
  }
  const screenshot = await screenShotsElement.screenshot({
    encoding: 'base64',
  });


  // close the browser so we don't leak memory
  await browser.close();


  const screenshotUrl = `data:image/png;base64,${screenshot}`

  return { content, screenshotUrl};
}
