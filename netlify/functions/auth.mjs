/*
 * Étape 1 de la connexion au back-office : renvoie vers GitHub.
 * Le secret OAuth ne transite jamais ici — seulement l'identifiant public.
 */
export default async (req) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return new Response('OAUTH_CLIENT_ID manquant dans les variables Netlify.', { status: 500 });
  }

  const origin = new URL(req.url).origin;
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
};

export const config = { path: '/oauth/auth' };
