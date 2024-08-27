import { createBrowserClient, createServerClient, isBrowser, parse } from '@supabase/ssr';
import {
	PUBLIC_POSTHOG_API_KEY,
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_URL
} from '$env/static/public';
import type { LayoutLoad } from './$types';
import type { Database, Tables } from '$lib/supabase';
import posthog from 'posthog-js';

export const ssr = true;
export const load: LayoutLoad = async ({ data, depends, fetch, params }) => {
	/**
	 * Declare a dependency so the layout can be invalidated, for example, on
	 * session refresh.
	 */
	depends('supabase:auth');

	if (isBrowser()) {
		posthog.init(PUBLIC_POSTHOG_API_KEY, {
			api_host: 'https://eu.i.posthog.com',
			person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
			capture_pageview: false,
			capture_pageleave: false
		});
	}

	const supabase = isBrowser()
		? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					get(key) {
						if (!isBrowser()) {
							return JSON.stringify(data.session);
						}

						const cookie = parse(document.cookie);
						return cookie[key];
					}
				}
			})
		: createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	const { data: projects, error } = await supabase.from('projects').select('*');
	if (error) {
		console.error('Error getting projects:', error);
	}

	let currentProject: Tables<'projects'> | null = null;

	if (params.projectId) {
		const { data: project, error } = await supabase
			.from('projects')
			.select('*')
			.eq('id', params.projectId)
			.single();
		if (error) {
			console.error('Error getting project:', error);
		} else {
			currentProject = project;
		}
	}

	return { supabase, session, user: session?.user, currentProject, projects };
};
