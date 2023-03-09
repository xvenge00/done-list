import { isAuthenticated } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (isAuthenticated(await locals.getSession())) {
		throw redirect(302, '/');
	}
};
