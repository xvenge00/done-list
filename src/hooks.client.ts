import * as SentrySvelte from '@sentry/svelte';
import type { HandleClientError } from '@sveltejs/kit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { dev } from "$app/environment"

SentrySvelte.init({
	dsn: PUBLIC_SENTRY_DSN,

	// Set tracesSampleRate to 1.0 to capture 100%
	tracesSampleRate: 1.0
});

export const handleError: HandleClientError = ({ error, event }) => {
	if (dev) {
		return {
			message: 'Unexpected error',
			errorId: 'err1'
		}
	}
	

	const errorId = crypto.randomUUID();
	SentrySvelte.captureException(error, {
		contexts: { sveltekit: { event, errorId } }
	});

	return {
		message: 'Unexpected error',
		errorId
	};
};
