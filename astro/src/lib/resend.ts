/**
 * Minimal Resend email sender — plain fetch against Resend's REST API, no
 * SDK dependency for two call sites. RESEND_API_KEY is a Cloudflare runtime
 * binding, set in the dashboard (never committed).
 */
export interface ResendEnv {
  RESEND_API_KEY?: string;
}

export interface SendEmailInput {
  to: string;
  from: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(apiKey: string | undefined, input: SendEmailInput): Promise<{ ok: boolean; error?: string }> {
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY is not configured' };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: input.to,
      from: input.from,
      subject: input.subject,
      html: input.html,
      reply_to: input.replyTo,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, error: `Resend ${res.status}: ${text.slice(0, 200)}` };
  }
  return { ok: true };
}
