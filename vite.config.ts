import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// load the environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
	plugins: [sveltekit()]
});
