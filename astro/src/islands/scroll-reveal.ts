/**
 * Scroll-reveal — a single IntersectionObserver tags common section-level
 * elements (section headings, card grids, testimonials) with `data-reveal`
 * and toggles `.is-visible` once each scrolls into view, staggered by DOM
 * order within its own container. New functionality (the legacy site had
 * no generic reveal system — see motion.css). Deliberately narrow: whole
 * page sections, not every paragraph or button, per the brief's
 * "static first, dynamic where valuable" instruction. No-ops entirely
 * under prefers-reduced-motion (the CSS already neutralizes the animation,
 * this additionally skips the observer/stagger bookkeeping).
 */
const REVEAL_SELECTOR = [
  '.section-head',
  '.tier-card',
  '.visual-service',
  '.service-list article',
  '.testimonial-card',
  '.blog-card',
  '.featured-story',
  '.design-card',
].join(', ');

export function initScrollReveal(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const groups = new Map<Element | null, Element[]>();
  document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
    el.setAttribute('data-reveal', '');
    const parent = el.parentElement;
    const list = groups.get(parent) ?? [];
    list.push(el);
    groups.set(parent, list);
  });

  const delayFor = new WeakMap<Element, number>();
  groups.forEach((siblings) => {
    siblings.forEach((el, i) => delayFor.set(el, Math.min(i, 6) * 60));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const delay = delayFor.get(el) ?? 0;
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
}
