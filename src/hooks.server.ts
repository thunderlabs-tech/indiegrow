import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const llmProxy = express();
// Configuration
const PORT = 2910;
const HOST = '127.0.0.1';
const API_SERVICE_URL = 'https://api.openai.com';

llmProxy.use(
	'/llm',
	createProxyMiddleware({
		target: API_SERVICE_URL,
		changeOrigin: true,
		pathRewrite: {
			[`^/llm`]: ''
		},
		headers: {
			Authorization: 'Bearer ' + process.env.PUBLIC_OPENAI_API_KEY
		}
	})
);

console.log('Starting Proxy at ${HOST}:${PORT}');
llmProxy.listen(PORT, () => {
	console.log(`Started Proxy at ${HOST}:${PORT}`);
});
