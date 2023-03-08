import * as SentrySvelte from "@sentry/svelte"
import type { HandleClientError } from "@sveltejs/kit"
import {PUBLIC_SENTRY_DSN} from "$env/static/public"

SentrySvelte.init({
    dsn: PUBLIC_SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    tracesSampleRate: 1.0,
})

export const handleError: HandleClientError = ({ error, event }) => {
    const errorId = crypto.randomUUID()
    SentrySvelte.captureException(error, {
        contexts: { sveltekit: { event, errorId } }
    })

    return {
        message: "Unexpected error",
        errorId,
    }
}
