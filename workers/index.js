/*
 * Cloudflare Workers for OAuth authentication
 * Handles GitHub OAuth flow for the admin back-office
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/oauth/auth') {
      return handleAuth(request, env);
    } else if (path === '/oauth/callback') {
      return handleCallback(request, env);
    }

    return new Response('Not found', { status: 404 });
  }
};

/*
 * Étape 1 de la connexion au back-office : renvoie vers GitHub.
 * Le secret OAuth ne transite jamais ici — seulement l'identifiant public.
 */
async function handleAuth(request, env) {
  const clientId = env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return new Response('OAUTH_CLIENT_ID manquant dans les variables Cloudflare.', { status: 500 });
  }

  const origin = new URL(request.url).origin;
  // État anti-CSRF : GitHub nous le renvoie, on le compare au cookie.
  const state = crypto.randomUUID();

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', `${origin}/oauth/callback`);
  // 'public_repo' et non 'repo' : le dépôt du site est public, donc un jeton
  // qui fuiterait ne donnerait aucun accès aux dépôts privés du compte.
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
}

/*
 * Étape 2 : GitHub nous renvoie un code, on l'échange contre un jeton,
 * puis on le transmet à la fenêtre de l'éditeur et on se ferme.
 * Le jeton ne touche jamais le disque et n'est jamais journalisé.
 */
const closingPage = (status, payload, origin) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>Connexion…</title></head>
<body><p>Connexion en cours…</p>
<script>
(function () {
  var message = 'authorization:github:${status}:' + ${JSON.stringify(JSON.stringify(payload))};
  var target = ${JSON.stringify(origin)};
  if (!window.opener) { document.body.textContent = 'Fenêtre ouverte hors du back-office.'; return; }
  window.addEventListener('message', function () {
    window.opener.postMessage(message, target);
  }, { once: true });
  window.opener.postMessage('authorizing:github', target);
})();
</script></body></html>`;

const html = (body, status = 200) =>
  new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });

async function handleCallback(request, env) {
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
    return html(closingPage('error', { message: 'Requête de connexion invalide.' }, origin), 400);
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: env.OAUTH_CLIENT_ID,
      client_secret: env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!data.access_token) {
    return html(closingPage('error', { message: 'GitHub a refusé la connexion.' }, origin), 401);
  }

  return html(closingPage('success', { token: data.access_token, provider: 'github' }, origin));
}