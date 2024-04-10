import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 1280 });
const website_url =
  "https://apps.apple.com/us/app/solarwatch-sunrise-sunset-time/id1191365122?ign-itscg=30200&ign-itsct=apps_box_link";
await page.goto(website_url, { waitUntil: "networkidle0" });
await page.screenshot({
  path: "screenshots/screenshot.jpg",
  fullPage: true,
});

const descriptionSelector =
  "body > div.ember-view > main > div.animation-wrapper.is-visible > section:nth-child(4) > div > div > div";
const element = await page.$(descriptionSelector);

const elementText = await page.evaluate((e) => e.textContent, element);
console.log("Extracted element:", elementText);

await browser.close();
