import { analyzetWithLLM, analysisPrompt } from '../src/lib/openai';
import { extractAppStoreContent } from '../src/lib/appstore';

const appstoreUrl =
	'https://apps.apple.com/us/app/solarwatch-sunrise-sunset-time/id1191365122?ign-itscg=30200&ign-itsct=apps_box_link';

const { content, screenshotUrl } = await extractAppStoreContent(appstoreUrl);

console.log('Analyzing app store content with LLM...');
const result = await analyzetWithLLM(analysisPrompt, content, screenshotUrl);
console.log('LLM result: ', result);
