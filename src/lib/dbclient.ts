import type { SupabaseClient } from '@supabase/supabase-js';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import type { Database } from './supabase';
import type { SearchResult } from './multiSearch';
import type { CommunityPost } from './types';

export function dbclient() {
	return get(page).data.supabase as SupabaseClient<Database>;
}

export async function saveCommunityPostsSearchResults(
	db: SupabaseClient<Database>,
	projectId: string,
	results: SearchResult[]
): Promise<CommunityPost[]> {
	const inserts = results.map((result) => ({
		project_id: projectId,
		url: result.url,
		title: result.title,
		content: result.content,
		score: result.score
	}));

	const { data: posts, error } = await db.from('community_posts').insert(inserts).select();
	if (error) {
		console.error('Error saving community posts', error);
		throw error;
	}

	return posts;
}
