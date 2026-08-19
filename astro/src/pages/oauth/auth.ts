/**
 * Decap CMS OAuth — step 1: redirect to GitHub. Direct port of
 * netlify/functions/auth.mjs to an Astro API route on Cloudflare. Same
 * behavior: the OAuth secret never appears here, only the public client
 * ID; state cookie is HttpOnly/Secure/SameSite=Lax with a 10-minute TTL.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return new Response('OAUTH_CLIENT_ID missing from Cloudflare environment variables.', { status: 500 });
  }

  const origin = new URL(request.url).origin;
  const state = crypto.randomUUID();

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', `${origin}/oauth/callback`);
  // 'public_repo', not 'repo': the site repo is public, so a leaked token
  // still grants no access to any private repos on the account.
  authorize.searchParams.set('scope', 'public_repo');
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': `bewegt_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
};
