import type { SupabaseClient } from '@supabase/supabase-js';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import type { Database } from './supabase';

export function dbclient() {
	return get(page).data.supabase as SupabaseClient<Database>;
}
