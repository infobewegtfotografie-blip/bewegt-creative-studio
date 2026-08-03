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

export default async (req) => {
  const url = new URL(req.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookieState = (req.headers.get('cookie') || '')
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
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!data.access_token) {
    return html(closingPage('error', { message: 'GitHub a refusé la connexion.' }, origin), 401);
  }

  return html(closingPage('success', { token: data.access_token, provider: 'github' }, origin));
};

export const config = { path: '/oauth/callback' };
