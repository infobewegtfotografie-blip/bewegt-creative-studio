/**
 * Pricing/package engine — direct TypeScript port of script.js:650-702.
 * Swaps tier inclusions and CTA copy per selected service and current
 * language, persists the chosen service in localStorage, and re-renders on
 * the `bewegt:languagechange` event dispatched by the i18n island.
 */
import { safeStorage } from '../lib/storage';
import { PRICING_INCLUSIONS, PRICING_QUOTE_LABEL, PRICING_INCLUSIONS_ARIA_LABEL, type ServiceKey, type Lang } from '../lib/pricing';

function isLang(value: string): value is Lang {
  return value === 'en' || value === 'fr' || value === 'de';
}

export function initPricingEngine(): void {
  const root = document.querySelector<HTMLElement>('[data-pricing-engine]');
  if (!root) return;

  const serviceButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('.pricing-service-btn'));
  const tierCards = Array.from(root.querySelectorAll<HTMLElement>('[data-tier]'));
  const singleService = root.getAttribute('data-pricing-engine') !== 'index';
  const presetService = root.getAttribute('data-pricing-engine') as ServiceKey | null;
  let activeService: ServiceKey = singleService && presetService ? presetService : (safeStorage.get('bewegtService', 'photo') as ServiceKey);

  function currentLang(): Lang {
    const stored = safeStorage.get('bewegtLang', 'en');
    return isLang(stored) ? stored : 'en';
  }

  function render(): void {
    serviceButtons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset.service === activeService));

    tierCards.forEach((card) => {
      const tier = card.getAttribute('data-tier') as 'basic' | 'standard' | 'premium' | null;
      if (!tier) return;
      const priceEl = card.querySelector('.tier-price');
      if (!priceEl) return;
      const lang = currentLang();
      priceEl.textContent = PRICING_QUOTE_LABEL[lang];

      const list = card.querySelector('.tier-inclusions');
      if (list) {
        const items = PRICING_INCLUSIONS[lang][activeService][tier];
        list.replaceChildren(
          ...items.map((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            return li;
          }),
        );
        list.setAttribute('aria-label', PRICING_INCLUSIONS_ARIA_LABEL[lang]);
      }
    });
    safeStorage.set('bewegtService', activeService);
  }

  serviceButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeService = btn.dataset.service as ServiceKey;
      render();
    });
  });

  document.addEventListener('bewegt:languagechange', render);
  render();
}
