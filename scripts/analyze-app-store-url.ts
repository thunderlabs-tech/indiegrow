import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 2560, height: 1280 });
const appstoreUrl =
  "https://apps.apple.com/us/app/solarwatch-sunrise-sunset-time/id1191365122?ign-itscg=30200&ign-itsct=apps_box_link";
const localPath = appstoreUrl.replace(/\W/g, "-");
const screenShotPath = `screenshots/${localPath}.png`;

console.log("Analyzing App Store URL: ", appstoreUrl);
await page.goto(appstoreUrl, { waitUntil: "networkidle0" });

const descriptionSelector =
  "body > div.ember-view > main > div.animation-wrapper.is-visible > section:nth-child(4) > div > div > div";
const descriptionElement = await page.$(descriptionSelector);
if (!descriptionElement) {
  throw new Error(
    `Could not find description element with selector: ${descriptionSelector}`
  );
}
const description = await page.evaluate(
  (e) => e.textContent,
  descriptionElement
);

console.log("Extracted description: ", description);

// await page.screenshot({
//   path: screenShotPath,
//   fullPage: true,
// });

const screenShotsElement = await page.$(
  "body > div.ember-view > main > div.animation-wrapper.is-visible > section:nth-child(3) > div:nth-child(2) > div"
);
if (!screenShotsElement) {
  throw new Error(`Could not find screenshots element`);
}
await screenShotsElement.screenshot({
  path: screenShotPath,
});
console.log("Screenshot saved at: ", screenShotPath);

await browser.close();
