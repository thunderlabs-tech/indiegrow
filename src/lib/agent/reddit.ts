// import fetch from 'fetch';
import * as dotenv from 'dotenv';

dotenv.config();

const clientId = 'l9MhhQIwuXdtQawVrG2nRw'; //process.env.CLIENT_ID;
const clientSecret = 'kH7LVk9XqUc0XAPU_tEaxG1eiztuBg'; //process.env.CLIENT_SECRET;
const username = 'eugen@thunderlabs.tech'; //process.env.REDDIT_USERNAME;
const password = 'NTF0auq*qxr@xqk8ekg'; //process.env.REDDIT_PASSWORD;
const userAgent = 'IndieGrowClient/0.1 by Lanky_Echo6094';

async function getToken() {
	const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
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

export async function searchSubReddits(query: string) {
	const token = await getToken();
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
	} catch (error) {
		console.error('Error searching subreddits:', error.message);
	}
}

export async function searchPostsInSubreddit(subreddit: string, query: string) {
	const token = await getToken();
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
	const response = await fetch(url, {
		headers: headers
	});

	if (!response.ok) {
		throw new Error(`Error searching posts in subreddit: ${response.statusText}`);
	}

	const responseData = await response.json();
	const posts = responseData.data.children;

	return posts.map((post: any) => {
		return {
			text: post.data.selftext,
			url: post.data.url
		};
	});
}

export async function getCommentsOfArticle(articleId: string) {
	const token = await getToken();
	const headers = {
		Authorization: `Bearer ${token}`,
		'User-Agent': userAgent
	};

	const url = `https://oauth.reddit.com/comments/${articleId}`;
	const response = await fetch(url, {
		headers: headers
	});

	if (!response.ok) {
		throw new Error(`Error searching posts in subreddit: ${response.statusText}`);
	}

	const responseData = await response.json();

	return comments.data.children;
}

// await searchSubReddits('neighbors');
// const posts = await searchPostsInSubreddit('berlin', 'Communicate with neighbors');

// https://www.reddit.com/r/berlin/comments/12ul8cd/how_do_you_communicate_with_neighbors_in_same/
const comments = await getCommentsOfArticle('12ul8cd');
console.log(comments);
