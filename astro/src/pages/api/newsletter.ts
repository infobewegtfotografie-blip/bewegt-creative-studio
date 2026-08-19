/**
 * Newsletter signup endpoint — replaces Netlify Forms. Kept deliberately
 * simple (send a notification email via Resend) rather than wiring a
 * specific ESP now — the brief asks for an architecture that can plug in
 * Resend Audiences / Brevo / Mailchimp later without touching the form
 * markup or this route's request/response contract. Swap the body of
 * `subscribe()` when a provider is chosen.
 */
import type { APIRoute } from 'astro';
import { verifyTurnstile } from '../../lib/turnstile';
import { sendEmail } from '../../lib/resend';
import { isValidEmail, cleanString, isBot } from '../../lib/form-validation';

export const prerender = false;

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

async function subscribe(email: string): Promise<{ ok: boolean; error?: string }> {
  // ponytail: no ESP wired yet — notify the studio inbox so signups aren't
  // lost. Replace with a Resend Audience / Brevo / Mailchimp API call when
  // a provider is chosen; the endpoint's contract (POST email -> {ok}) stays the same.
  return sendEmail(process.env.RESEND_API_KEY, {
    to: process.env.CONTACT_TO_EMAIL || 'contact@bewegtcreative.com',
    from: 'BEWEGT Website <noreply@bewegtcreative.com>',
    subject: 'New newsletter signup',
    html: `<p>New newsletter signup: ${email}</p>`,
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse(400, { ok: false, error: 'Invalid form submission.' });
  }

  if (isBot(formData, 'bot-nl-field')) {
    return jsonResponse(200, { ok: true });
  }

  const token = cleanString(formData.get('cf-turnstile-response'), 2048);
  const verified = await verifyTurnstile(token, process.env.TURNSTILE_SECRET_KEY, clientAddress);
  if (!verified) {
    return jsonResponse(400, { ok: false, error: 'Verification failed. Please try again.' });
  }

  const email = cleanString(formData.get('email'), 254);
  if (!isValidEmail(email)) {
    return jsonResponse(400, { ok: false, error: 'Please enter a valid email address.' });
  }

  const result = await subscribe(email);
  if (!result.ok) {
    console.error('newsletter: failed to subscribe', result.error);
    return jsonResponse(502, { ok: false, error: 'Something went wrong. Please try again.' });
  }

  return jsonResponse(200, { ok: true });
};
