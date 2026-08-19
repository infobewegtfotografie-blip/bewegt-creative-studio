/**
 * Portfolio/article image lightbox — direct TypeScript port of
 * script.js:949-1008. Targets any image matching the same selector set the
 * legacy site used, so it keeps working across the portfolio grid, article
 * bodies and galleries without each page having to know about it.
 * Loaded as a client:visible island wherever a `.design-card`/`.post-body`
 * grid is on the page (see ProjectGrid.astro).
 */

const ZOOMABLE_SELECTOR = '.design-card img, .article-main img, .article-sidebar img, .post-body img, .post-gallery img';

export function initLightbox(): void {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg') as HTMLImageElement | null;
  const caption = document.getElementById('lightboxCaption');
  const close = document.getElementById('lightboxClose');
  const prev = document.getElementById('lightboxPrev');
  const next = document.getElementById('lightboxNext');
  if (!lightbox || !img || !caption) return;

  const zoomableImages = Array.from(document.querySelectorAll<HTMLImageElement>(ZOOMABLE_SELECTOR)).filter(
    (image) => !image.closest('.nav-service-link') && !image.closest('.lightbox'),
  );
  let index = 0;

  function openLightbox(i: number): void {
    if (!zoomableImages.length) return;
    index = (i + zoomableImages.length) % zoomableImages.length;
    const image = zoomableImages[index];
    img!.src = image.dataset.full || image.currentSrc || image.src;
    caption!.textContent = image.dataset.caption || image.alt || '';
    lightbox!.classList.add('is-open');
    document.body.classList.add('no-scroll');
    lightbox!.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox(): void {
    lightbox!.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    lightbox!.setAttribute('aria-hidden', 'true');
    img!.src = '';
  }

  function show(delta: number): void {
    openLightbox(index + delta);
  }

  zoomableImages.forEach((image, i) => {
    const fullSrc = image.dataset.full || image.currentSrc || image.src;
    image.dataset.full = fullSrc;
    image.dataset.caption =
      image.dataset.caption || image.alt || image.closest('figure')?.querySelector('figcaption')?.textContent || '';
    image.style.cursor = 'zoom-in';
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', 'Show full-size image');
    image.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openLightbox(i);
    });
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(i);
      }
    });
  });

  close?.addEventListener('click', closeLightbox);
  prev?.addEventListener('click', () => show(-1));
  next?.addEventListener('click', () => show(1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox!.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') show(-1);
    if (e.key === 'ArrowRight') show(1);
  });
}
