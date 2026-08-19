/**
 * GA4 click-tracking for WhatsApp links, mailto links, and the project
 * inquiry form submit. Direct port of index.html's inline script
 * (lines 778-814). Consent-gated: gtag only exists after the consent
 * banner's "Accept analytics" fires (see src/lib/consent.ts), so these
 * calls are harmless no-ops until then.
 */
export function initClickTracking(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"]').forEach((link) => {
    link.addEventListener('click', () => {
      window.gtag?.('event', 'whatsapp_click', { event_category: 'contact', event_label: link.href });
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', () => {
      window.gtag?.('event', 'email_click', { event_category: 'contact', event_label: link.href });
    });
  });

  const form = document.getElementById('projectInquiryForm');
  form?.addEventListener('submit', () => {
    window.gtag?.('event', 'project_inquiry_submit', { event_category: 'lead', event_label: 'contact form' });
  });
}
