/**
 * Cookie-consent banner (GA4 + Microsoft Clarity, loaded only on accept).
 * Direct TypeScript port of consent.js — same storage key, same copy,
 * same behavior, so no re-consent is forced on returning visitors during
 * the migration.
 */

const STORAGE_KEY = 'bewegtAnalyticsConsent';

declare global {
  interface Window {
    bewegtAnalyticsLoaded?: boolean;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: { (...args: unknown[]): void; q?: unknown[] };
  }
}

function loadAnalytics(): void {
  if (window.bewegtAnalyticsLoaded) return;
  window.bewegtAnalyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) { window.dataLayer!.push(args); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-RLSN7VEWBQ', { anonymize_ip: true });

  const ga = document.createElement('script');
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-RLSN7VEWBQ';
  document.head.appendChild(ga);

  window.clarity = window.clarity || function clarity(...args: unknown[]) {
    (window.clarity!.q = window.clarity!.q || []).push(args);
  };
  window.clarity('set', 'input-mask', true);
  const clarity = document.createElement('script');
  clarity.async = true;
  clarity.src = 'https://www.clarity.ms/tag/xcqct6l89z';
  document.head.appendChild(clarity);
}

function saveChoice(value: 'accepted' | 'rejected'): void {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // storage unavailable
  }
}

function hideBanner(banner: HTMLElement): void {
  banner.hidden = true;
}

function createBanner(): void {
  const banner = document.createElement('aside');
  banner.className = 'consent-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Privacy choices');
  banner.innerHTML = `
    <div class="consent-copy">
      <strong>Privacy · Confidentialité · Datenschutz</strong>
      <p>We use optional analytics to improve the site. Essential functions work without them. · Nous utilisons des statistiques facultatives pour améliorer le site. · Optionale Analysen helfen uns, die Website zu verbessern.</p>
    </div>
    <div class="consent-actions">
      <button class="btn btn-outline" type="button" data-consent="reject">Essential only</button>
      <button class="btn btn-light" type="button" data-consent="accept">Accept analytics</button>
    </div>
  `;

  banner.querySelector('[data-consent="reject"]')?.addEventListener('click', () => {
    saveChoice('rejected');
    hideBanner(banner);
  });
  banner.querySelector('[data-consent="accept"]')?.addEventListener('click', () => {
    saveChoice('accepted');
    loadAnalytics();
    hideBanner(banner);
  });
  document.body.appendChild(banner);
}

export function initConsent(): void {
  let choice: string | null = null;
  try {
    choice = localStorage.getItem(STORAGE_KEY);
  } catch {
    // storage unavailable
  }

  if (choice === 'accepted') {
    loadAnalytics();
  } else if (choice !== 'rejected') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }
}
