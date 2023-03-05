import { SvelteKitAuth } from "@auth/sveltekit"
import { sequence } from '@sveltejs/kit/hooks';
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import { GITHUB_ID, GITHUB_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } from "$env/static/private"
import { redirect, type Handle } from "@sveltejs/kit";
import { isAuthenticated } from "$lib/server/auth";

export const authentiaction_handle = SvelteKitAuth({
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
    Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })
  ],
  secret: AUTH_SECRET,
})

export const autorization_handle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;
  if (isAuthenticated(await event.locals.getSession()) || pathname.startsWith("/welcome") || pathname.startsWith("/auth/login")) {
    return await resolve(event);
  }
  throw redirect(302, "/welcome")
}

export const handle: Handle = sequence(authentiaction_handle, autorization_handle);
