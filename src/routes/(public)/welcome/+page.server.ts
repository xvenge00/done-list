import { isAuthenticated } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (isAuthenticated(session)) {
		throw redirect(302, '/');
	}

	return {
		session
	};
};
