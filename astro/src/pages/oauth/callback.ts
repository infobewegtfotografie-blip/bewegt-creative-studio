/**
 * Decap CMS OAuth — step 2: exchange the GitHub code for a token and hand
 * it to the editor window via postMessage. Direct port of
 * netlify/functions/callback.mjs. Same CSRF protection (state cookie must
 * match the query param), same behavior: the token never touches disk or
 * logs, only relayed to window.opener.
 */
import type { APIRoute } from 'astro';

function closingPage(status: 'success' | 'error', payload: Record<string, string>, origin: string): string {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Connecting…</title></head>
<body><p>Connecting…</p>
<script>
(function () {
  var message = ${JSON.stringify(message)};
  var target = ${JSON.stringify(origin)};
  if (!window.opener) { document.body.textContent = 'Window opened outside the back-office.'; return; }
  window.addEventListener('message', function () {
    window.opener.postMessage(message, target);
  }, { once: true });
  window.opener.postMessage('authorizing:github', target);
})();
</script></body></html>`;
}

function html(body: string, status = 200): Response {
  return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookieState = (request.headers.get('cookie') || '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('bewegt_oauth_state='))
    ?.slice('bewegt_oauth_state='.length);

  if (!code || !state || !cookieState || state !== cookieState) {
    return html(closingPage('error', { message: 'Invalid connection request.' }, origin), 400);
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as { access_token?: string };
  if (!data.access_token) {
    return html(closingPage('error', { message: 'GitHub refused the connection.' }, origin), 401);
  }

  return html(closingPage('success', { token: data.access_token, provider: 'github' }, origin));
};
