/**
 * Cloudflare Turnstile server-side verification. The site key (public) is
 * read from PUBLIC_TURNSTILE_SITE_KEY at build time; the secret key is a
 * Cloudflare runtime binding (TURNSTILE_SECRET_KEY), never bundled client-
 * side. Both must be set in the Cloudflare Pages dashboard before the
 * contact/newsletter forms will actually work — see Phase F notes.
 */
export interface TurnstileEnv {
  TURNSTILE_SECRET_KEY?: string;
}

export async function verifyTurnstile(token: string | null, secretKey: string | undefined, remoteIp?: string): Promise<boolean> {
  if (!token || !secretKey) return false;

  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}
