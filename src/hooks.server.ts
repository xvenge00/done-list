import { SvelteKitAuth } from '@auth/sveltekit';
import { dev } from '$app/environment';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import {
	AUTH_GITHUB_ID,
	AUTH_GITHUB_SECRET,
	AUTH_GOOGLE_CLIENT_ID,
	AUTH_GOOGLE_CLIENT_SECRET,
	AUTH_SECRET
} from '$env/static/private';
import type { HandleServerError } from '@sveltejs/kit';
import crypto from 'crypto';
import * as SentryNode from '@sentry/node';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';
import type { Provider } from '@auth/core/providers';

export const handle: Handle = SvelteKitAuth({
	providers: [
		GitHub({ clientId: AUTH_GITHUB_ID, clientSecret: AUTH_GITHUB_SECRET }) as Provider,
		Google({ clientId: AUTH_GOOGLE_CLIENT_ID, clientSecret: AUTH_GOOGLE_CLIENT_SECRET }) as Provider
	],
	secret: AUTH_SECRET
});

SentryNode.init({
	dsn: PUBLIC_SENTRY_DSN,

	// Set tracesSampleRate to 1.0 to capture 100%
	tracesSampleRate: 1.0
});

export const handleError: HandleServerError = ({ error, event }) => {
	if (dev) {
		return {
			message: 'Unexpected error',
			errorId: 'err1'
		};
	}

	const errorId = crypto.randomUUID();
	SentryNode.captureException(error, {
		contexts: { sveltekit: { event, errorId } }
	});

	return {
		message: 'Unexpected error',
		errorId
	};
};
