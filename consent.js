(function () {
  'use strict';

  var STORAGE_KEY = 'bewegtAnalyticsConsent';

  function loadAnalytics() {
    if (window.bewegtAnalyticsLoaded) return;
    window.bewegtAnalyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-RLSN7VEWBQ', { anonymize_ip: true });

    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-RLSN7VEWBQ';
    document.head.appendChild(ga);

    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    window.clarity('set', 'input-mask', true);
    var clarity = document.createElement('script');
    clarity.async = true;
    clarity.src = 'https://www.clarity.ms/tag/xcqct6l89z';
    document.head.appendChild(clarity);
  }

  function saveChoice(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (error) { /* storage unavailable */ }
  }

  function hideBanner(banner) {
    banner.hidden = true;
  }

  function createBanner() {
    var banner = document.createElement('aside');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Privacy choices');
    banner.innerHTML =
      '<div class="consent-copy">' +
        '<strong>Privacy · Confidentialité · Datenschutz</strong>' +
        '<p>We use optional analytics to improve the site. Essential functions work without them. · Nous utilisons des statistiques facultatives pour améliorer le site. · Optionale Analysen helfen uns, die Website zu verbessern.</p>' +
      '</div>' +
      '<div class="consent-actions">' +
        '<button class="btn btn-outline" type="button" data-consent="reject">Essential only</button>' +
        '<button class="btn btn-light" type="button" data-consent="accept">Accept analytics</button>' +
      '</div>';

    banner.querySelector('[data-consent="reject"]').addEventListener('click', function () {
      saveChoice('rejected');
      hideBanner(banner);
    });
    banner.querySelector('[data-consent="accept"]').addEventListener('click', function () {
      saveChoice('accepted');
      loadAnalytics();
      hideBanner(banner);
    });
    document.body.appendChild(banner);
  }

  var choice = null;
  try { choice = localStorage.getItem(STORAGE_KEY); } catch (error) { /* storage unavailable */ }
  if (choice === 'accepted') {
    loadAnalytics();
  } else if (choice !== 'rejected') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createBanner);
    else createBanner();
  }
})();
