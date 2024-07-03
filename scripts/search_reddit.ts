// import fetch from 'fetch';
import * as dotenv from 'dotenv';

dotenv.config();

const clientId = 'l9MhhQIwuXdtQawVrG2nRw'; //process.env.CLIENT_ID;
const clientSecret = 'kH7LVk9XqUc0XAPU_tEaxG1eiztuBg'; //process.env.CLIENT_SECRET;
const username = 'eugen@thunderlabs.tech'; //process.env.REDDIT_USERNAME;
const password = 'NTF0auq*qxr@xqk8ekg'; //process.env.REDDIT_PASSWORD;
const userAgent = 'IndieGrowClient/0.1 by Lanky_Echo6094';

// import RedditClient from 'reddit-client-api';

// const config = {
// 	apiKey: `${clientId}`,
// 	apiSecret: `${clientSecret}`,
// 	userAgent: `${userAgent}`
// };
// const myRedditClient = new RedditClient(config);

// await myRedditClient.auth({
// 	username: `${username}`,
// 	password: `${password}`
// });

async function getToken() {
	const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
	// const auth = `${clientId}:${clientSecret}`;
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		Authorization: `Basic ${auth}`
	};
	const data = `grant_type=client_credentials&username=${username}&password=${password}`;

	try {
		const response = await fetch('https://www.reddit.com/api/v1/access_token', {
			method: 'POST',
			headers: headers,
			body: data
		});

		if (!response.ok) {
			throw new Error(`Error getting token: ${response.statusText}`);
		}

		const responseData = await response.json();
		return responseData.access_token;
	} catch (error) {
		console.error('Error getting token:', error.message);
	}
}

async function getUserInfo(token: string) {
	const headers = {
		Authorization: `Bearer ${token}`,
		'User-Agent': userAgent
	};

	try {
		const response = await fetch('https://oauth.reddit.com/api/v1/me', {
			headers: headers
		});

		if (!response.ok) {
			throw new Error(`Error getting user info: ${response.statusText}`);
		}

		const responseData = await response.json();
		console.log(responseData);
	} catch (error) {
		console.error('Error getting user info:', error.message);
	}
}

async function searchSubReddits(token: string, query: string) {
	const headers = {
		Authorization: `Bearer ${token}`,
		'User-Agent': userAgent
		// 'Content-Type': 'application/json'
	};

	try {
		const formData = new FormData();
		formData.append('query', query);

		const url = `https://oauth.reddit.com/api/search_subreddits`;
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: formData
		});

		if (!response.ok) {
			throw new Error(`Error searching subreddits: ${response.statusText}`);
		}

		const responseData = await response.json();
		console.log(responseData);
	} catch (error) {
		console.error('Error searching subreddits:', error.message);
	}
}

async function searchPostsInSubreddit(token: string, subreddit: string, query: string) {
	const headers = {
		Authorization: `Bearer ${token}`,
		'User-Agent': userAgent
	};

	const params = new URLSearchParams({
		q: query,
		type: 'link',
		limit: '5'
	});

	const url = `https://oauth.reddit.com/r/${subreddit}/search?${params.toString()}`;
	console.log('url: ', url);
	const response = await fetch(url, {
		headers: headers
	});

	if (!response.ok) {
		throw new Error(`Error searching posts in subreddit: ${response.statusText}`);
	}

	const responseData = await response.json();
	const posts = responseData.data.children;

	console.log(
		posts.map((post: any) => {
			return post;
			return {
				text: post.data.selftext,
				url: post.data.url,
				type: post.data.type,
				category: post.data.category
			};
		})
	);
	return posts;
}
// https://www.reddit.com/dev/api#GET_comments_{article}
async function getCommentsOfArticle(token: string, articleId: string) {
	const headers = {
		Authorization: `Bearer ${token}`,
		'User-Agent': userAgent
	};

	// const params = new URLSearchParams({
	// 	q: query,
	// 	type: 'link',
	// 	limit: '5'
	// });

	const url = `https://oauth.reddit.com/comments/${articleId}`;
	console.log('url: ', url);
	const response = await fetch(url, {
		headers: headers
	});

	if (!response.ok) {
		throw new Error(`Error searching posts in subreddit: ${response.statusText}`);
	}

	const responseData = await response.json();
	console.log(responseData);

	for (const comment of responseData) {
		console.log(comment.data.children);
	}
}

const token = await getToken();
if (token) {
	// await getUserInfo(token);
	// await searchSubReddits(token, 'neighbors');
	// await searchPostsInSubreddit(token, 'berlin', 'Communicate with neighbors');

	// https://www.reddit.com/r/berlin/comments/12ul8cd/how_do_you_communicate_with_neighbors_in_same/
	await getCommentsOfArticle(token, '12ul8cd');
}
