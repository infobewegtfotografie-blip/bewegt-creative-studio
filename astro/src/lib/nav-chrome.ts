/*
 * Global chrome behavior: nav scroll state, back-to-top / to-content
 * scroll buttons, mobile menu toggle, services mega-menu dropdown.
 * Direct TypeScript port of script.js:37-186 (legacy site) — behavior
 * unchanged, only typed and modularized.
 */

const SCROLL_LABELS = {
  backToTop: { en: 'Back to top', fr: 'Retour en haut', de: 'Zurueck nach oben' },
  toContent: { en: 'Scroll to content', fr: 'Voir le contenu', de: 'Zum Inhalt scrollen' },
} as const;

function currentLangLabel(labels: Record<string, string>): string {
  return labels[document.documentElement.lang] ?? labels.en ?? '';
}

function animateScrollTo(targetY: number): void {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = Math.min(900, Math.max(420, Math.abs(distance) * 0.32));
  const startTime = performance.now();
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  function step(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, Math.round(startY + distance * easeOutCubic(progress)));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initNavScroll(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initBackToTop(): void {
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.innerHTML = '<span aria-hidden="true">↑</span>';
  document.body.appendChild(backToTop);

  const setLabel = () => backToTop.setAttribute('aria-label', currentLangLabel(SCROLL_LABELS.backToTop));
  const update = () => backToTop.classList.toggle('is-visible', window.scrollY > Math.min(720, window.innerHeight * 0.85));

  backToTop.addEventListener('click', () => animateScrollTo(0));
  window.addEventListener('scroll', update, { passive: true });
  document.addEventListener('bewegt:languagechange', setLabel);
  setLabel();
  update();
}

function initToContent(): void {
  const toContent = document.createElement('button');
  toContent.className = 'to-content';
  toContent.type = 'button';
  toContent.innerHTML = '<span aria-hidden="true">↓</span>';
  document.body.appendChild(toContent);

  const setLabel = () => toContent.setAttribute('aria-label', currentLangLabel(SCROLL_LABELS.toContent));
  const update = () => {
    const nearTop = window.scrollY < Math.min(280, window.innerHeight * 0.35);
    const pastHero = document.body.scrollHeight > window.innerHeight * 1.4;
    toContent.classList.toggle('is-visible', nearTop && pastHero);
  };

  toContent.addEventListener('click', () => {
    const target = Math.min(window.innerHeight * 0.92, document.body.scrollHeight - window.innerHeight);
    animateScrollTo(target);
  });
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  document.addEventListener('bewegt:languagechange', setLabel);
  setLabel();
  update();
}

function initMobileMenu(): void {
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    nav?.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      nav?.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }),
  );
}

function initServiceDropdown(): void {
  document.querySelectorAll<HTMLElement>('.nav-dropdown').forEach((dropdown) => {
    const button = dropdown.querySelector<HTMLButtonElement>('button');
    const links = dropdown.querySelectorAll('a');
    if (!button) return;

    const setOpen = (isOpen: boolean) => {
      dropdown.classList.toggle('is-open', isOpen);
      button.setAttribute('aria-expanded', String(isOpen));
    };

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(!dropdown.classList.contains('is-open'));
    });
    links.forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target as Node)) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  });
}

export function initNavChrome(): void {
  initNavScroll();
  initBackToTop();
  initToContent();
  initMobileMenu();
  initServiceDropdown();
}
