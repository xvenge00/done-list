import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import {
	GITHUB_ID,
	GITHUB_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	AUTH_SECRET
} from '$env/static/private';
import type { HandleServerError } from '@sveltejs/kit';
import crypto from 'crypto';
import * as SentryNode from '@sentry/node';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';

export const handle = SvelteKitAuth({
	providers: [
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
		Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })
	],
	secret: AUTH_SECRET
});

SentryNode.init({
	dsn: PUBLIC_SENTRY_DSN,

	// Set tracesSampleRate to 1.0 to capture 100%
	tracesSampleRate: 1.0
});

export const handleError: HandleServerError = ({ error, event }) => {
	const errorId = crypto.randomUUID();
	SentryNode.captureException(error, {
		contexts: { sveltekit: { event, errorId } }
	});

	return {
		message: 'Unexpected error',
		errorId
	};
};
