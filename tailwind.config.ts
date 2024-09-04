import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';

import { indiegrowTheme } from './indiegrowTheme';

export default {
	darkMode: 'selector',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		// purgeCss, // doesn't work for some reason
		forms,
		typography,
		// fontawesome({
		// 	version: 6
		// }),
		skeleton({
			themes: {
				custom: [indiegrowTheme],
				preset: [
					{
						name: 'skeleton',
						enhancements: false
					}
				]
			}
		})
	]
} satisfies Config;
