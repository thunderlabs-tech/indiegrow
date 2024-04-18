// import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import { OPENAI_API_KEY } from '$env/static/private';

// load the environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/llm/v1': {
				target: 'https://api.openai.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/llm/, ''),
				headers: {
					Authorization: 'Bearer ' + process.env.OPENAI_API_KEY
				}
			}
		}
	}
});
