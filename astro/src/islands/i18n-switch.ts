/**
 * Site-wide language switch — direct TypeScript port of script.js's
 * applyLang() (lines 195-232) and the lang-btn click handler (415-437).
 * On an article page (data-translations present), clicking a flag
 * navigates to that language's URL instead of just re-skinning text —
 * same as the legacy site.
 */
import { TRANSLATIONS, HTML_ALLOWED_KEYS, type Lang } from '../lib/i18n';
import { safeStorage } from '../lib/storage';

function isLang(value: string): value is Lang {
  return value === 'en' || value === 'fr' || value === 'de';
}

function applyLang(lang: Lang): void {
  const dict = TRANSLATIONS[lang] ?? TRANSLATIONS.en;
  document.documentElement.lang = lang;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (!key || !dict[key]) return;
    if (HTML_ALLOWED_KEYS.includes(key)) el.innerHTML = dict[key];
    else el.textContent = dict[key];
  });

  // Blog index: only show cards written in the chosen language. Scoped to
  // .blog-section so "in this series" cluster cards (always the article's
  // own language) are never hidden by the visitor's site-wide choice.
  const blogCards = document.querySelectorAll<HTMLElement>('.blog-section .blog-card[data-lang]');
  if (blogCards.length) {
    let visible = 0;
    blogCards.forEach((card) => {
      const match = card.dataset.lang === lang;
      card.hidden = !match;
      if (match) visible += 1;
    });
    const empty = document.querySelector<HTMLElement>('.blog-empty');
    if (empty) empty.hidden = visible > 0;
  }

  document.querySelectorAll<HTMLElement>('.lang-btn').forEach((btn) => btn.classList.toggle('is-active', btn.dataset.lang === lang));
  safeStorage.set('bewegtLang', lang);
}

export function initI18nSwitch(): void {
  const stored = safeStorage.get('bewegtLang', 'en');
  const savedLang: Lang = isLang(stored) ? stored : 'en';
  applyLang(savedLang);

  const translationsEl = document.querySelector<HTMLElement>('[data-translations]');
  let articleVersions: Record<string, string> | null = null;
  if (translationsEl?.dataset.translations) {
    try {
      articleVersions = JSON.parse(translationsEl.dataset.translations);
    } catch {
      articleVersions = null;
    }
  }

  document.querySelectorAll<HTMLElement>('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (!lang || !isLang(lang)) return;

      if (articleVersions) {
        const target = articleVersions[lang];
        if (target && target !== location.pathname) {
          safeStorage.set('bewegtLang', lang);
          location.href = target;
          return;
        }
      }

      applyLang(lang);
      document.dispatchEvent(new CustomEvent('bewegt:languagechange'));
    });
  });
}
