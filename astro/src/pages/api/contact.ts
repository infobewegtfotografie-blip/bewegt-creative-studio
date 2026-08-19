/**
 * Project-inquiry contact form endpoint — replaces Netlify Forms.
 * Flow: honeypot check → Turnstile verify → server validation → Resend.
 *
 * Required Cloudflare env vars (set in the Pages dashboard, never in git):
 *   TURNSTILE_SECRET_KEY, RESEND_API_KEY, CONTACT_TO_EMAIL (defaults below).
 * Required build-time public var (astro/.env or Pages build config):
 *   PUBLIC_TURNSTILE_SITE_KEY (rendered into ContactForm.astro's widget).
 */
import type { APIRoute } from 'astro';
import { verifyTurnstile } from '../../lib/turnstile';
import { sendEmail } from '../../lib/resend';
import { isValidEmail, cleanString, isBot } from '../../lib/form-validation';

export const prerender = false;

const SERVICE_OPTIONS = ['Photography', 'Video Production', 'Live Streaming', 'Graphic Design', 'Podcast Production'];

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse(400, { ok: false, error: 'Invalid form submission.' });
  }

  // Bots that fill the honeypot get a fake success — no error to learn from.
  if (isBot(formData)) {
    return jsonResponse(200, { ok: true });
  }

  const token = cleanString(formData.get('cf-turnstile-response'), 2048);
  const verified = await verifyTurnstile(token, process.env.TURNSTILE_SECRET_KEY, clientAddress);
  if (!verified) {
    return jsonResponse(400, { ok: false, error: 'Verification failed. Please try again.' });
  }

  const name = cleanString(formData.get('name'), 120);
  const email = cleanString(formData.get('email'), 254);
  const service = cleanString(formData.get('service'), 60);
  const message = cleanString(formData.get('message'), 5000);

  if (!name || !isValidEmail(email) || !SERVICE_OPTIONS.includes(service) || !message) {
    return jsonResponse(400, { ok: false, error: 'Please fill in every field correctly.' });
  }

  const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
  const result = await sendEmail(process.env.RESEND_API_KEY, {
    to: process.env.CONTACT_TO_EMAIL || 'contact@bewegtcreative.com',
    from: 'BEWEGT Website <noreply@bewegtcreative.com>',
    replyTo: email,
    subject: `New project inquiry — ${service}`,
    html: `<p><strong>Name:</strong> ${escape(name)}</p><p><strong>Email:</strong> ${escape(email)}</p><p><strong>Service:</strong> ${escape(service)}</p><p><strong>Message:</strong><br>${escape(message).replace(/\n/g, '<br>')}</p>`,
  });

  if (!result.ok) {
    console.error('contact form: failed to send email', result.error);
    return jsonResponse(502, { ok: false, error: 'Could not send your message right now. Please try WhatsApp or email instead.' });
  }

  return jsonResponse(200, { ok: true });
};
