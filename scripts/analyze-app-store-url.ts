import { analyzetWithLLM, prompt } from "../src/lib/openai";


const appstoreUrl =
  "https://apps.apple.com/us/app/solarwatch-sunrise-sunset-time/id1191365122?ign-itscg=30200&ign-itsct=apps_box_link";

const { content, screenShotPath } = await extractAppStoreContent(appstoreUrl);

console.log("Analyzing app store content with LLM...");
const result = await analyzetWithLLM(prompt, content, screenShotPath);
console.log("LLM result: ", result);
