
import puppeteer from "puppeteer";

export type ExtractionResult = {
  content: string;
  screenshotUrl: string
};

export async function extractAppStoreContent(appStoreUrl: string): Promise<ExtractionResult> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 2560, height: 1280 });
  const localPath = appStoreUrl.replace(/\W/g, "-");

  console.log("Analyzing App Store URL: ", appStoreUrl);
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


  const screenshotUrl = `data:image/png;base64,${screenshot}`

  return { content, screenshotUrl};
}
