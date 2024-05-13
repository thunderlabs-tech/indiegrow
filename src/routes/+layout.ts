export const ssr = false;
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';
import type { Database, Tables } from '$lib/supabase';

import { dev } from '$app/environment';
import { inject } from '@vercel/analytics';
inject({ mode: dev ? 'development' : 'production' });

import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

injectSpeedInsights();

export const load: LayoutLoad = async ({ fetch, data, depends, params }) => {
	depends('supabase:auth');
	console.log('params:', params);

	const supabase = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
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
	});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (session?.user) {
		console.log('user already signed in:', session.user);
	} else {
		const { data, error } = await supabase.auth.signInAnonymously();
		console.log('created new anon user:', data, error);
	}

	let currentProject: Tables<'projects'> | null = null;

	if (params.projectId) {
		const { data: project, error } = await supabase
			.from('projects')
			.select('*')
			.eq('id', params.projectId)
			.single();
		console.log('setting current project:', project, error);
		currentProject = project;
	}

	return { supabase, session, user: session?.user, currentProject };
};
