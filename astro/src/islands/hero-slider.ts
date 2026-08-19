/**
 * Homepage hero slider — direct TypeScript port of script.js:1047-1121.
 * Reads the same data attributes (kicker, title, copy, cta, href) the
 * legacy site used, now rendered by Hero.astro from typed data in
 * src/lib/hero-slides.ts, so behavior is unchanged: autoplay every 5s,
 * pauses on hover/focus/hidden tab, respects prefers-reduced-motion,
 * re-localizes on language change via the bewegt:languagechange event
 * dispatched by the i18n island (Phase C).
 */

function localized(slide: HTMLElement, key: string): string {
  const lang = document.documentElement.lang || 'en';
  const capitalized = lang.replace(/^./, (char) => char.toUpperCase());
  return slide.dataset[`${key}${capitalized}`] || slide.dataset[`${key}En`] || '';
}

export function initHeroSlider(): void {
  const homeHero = document.querySelector<HTMLElement>('[data-home-hero]');
  if (!homeHero) return;
  const hero = homeHero.closest<HTMLElement>('.hero');
  if (!hero) return;

  const slides = Array.from(homeHero.querySelectorAll<HTMLElement>('.hero-slide'));
  const kicker = hero.querySelector<HTMLElement>('[data-hero-kicker]');
  const title = hero.querySelector<HTMLElement>('[data-hero-title]');
  const copy = hero.querySelector<HTMLElement>('[data-hero-copy]');
  const cta = hero.querySelector<HTMLAnchorElement>('[data-hero-cta]');
  const status = hero.querySelector<HTMLElement>('[data-hero-status]');
  const dotsContainer = hero.querySelector<HTMLElement>('.hero-slider-dots');
  if (!kicker || !title || !copy || !cta || !status) return;

  slides.forEach((_, slideIndex) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', String(slideIndex === 0));
    dot.setAttribute('aria-label', `Slide ${slideIndex + 1}`);
    dot.dataset.heroDot = String(slideIndex);
    if (slideIndex === 0) dot.classList.add('is-active');
    dotsContainer?.appendChild(dot);
  });

  const dots = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-dot]'));
  const previous = hero.querySelector('[data-hero-prev]');
  const following = hero.querySelector('[data-hero-next]');
  let current = 0;
  let heroTimer: number | undefined;

  function displayHero(target: number): void {
    current = (target + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle('is-active', active);
      if (active && slide.classList.contains('hero-slide-motion')) {
        const motionImage = slide.querySelector('img');
        motionImage?.replaceWith(motionImage.cloneNode(true));
      }
      const video = slide.querySelector<HTMLVideoElement>('video');
      if (video) {
        if (active) video.play().catch(() => {});
        else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
    const slide = slides[current];
    kicker!.textContent = localized(slide, 'kicker');
    title!.textContent = localized(slide, 'title');
    copy!.textContent = localized(slide, 'copy');
    cta!.textContent = localized(slide, 'cta');
    cta!.href = slide.dataset.href ?? '#';
    status!.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }

  function stopHero(): void {
    window.clearInterval(heroTimer);
  }
  function startHero(): void {
    stopHero();
    if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroTimer = window.setInterval(() => displayHero(current + 1), 5000);
    }
  }

  previous?.addEventListener('click', () => {
    displayHero(current - 1);
    startHero();
  });
  following?.addEventListener('click', () => {
    displayHero(current + 1);
    startHero();
  });
  dots.forEach((dot, dotIndex) =>
    dot.addEventListener('click', () => {
      displayHero(dotIndex);
      startHero();
    }),
  );
  hero.addEventListener('mouseenter', stopHero);
  hero.addEventListener('mouseleave', startHero);
  hero.addEventListener('focusin', stopHero);
  hero.addEventListener('focusout', startHero);
  document.addEventListener('visibilitychange', () => (document.hidden ? stopHero() : startHero()));
  document.addEventListener('bewegt:languagechange', () => displayHero(current));
  displayHero(0);
  startHero();
}
