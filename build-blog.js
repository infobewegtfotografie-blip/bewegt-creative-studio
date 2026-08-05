#!/usr/bin/env node
/*
 * Génère /blog (index + une page par article) depuis content/blog/*.md.
 * Lancé par Netlify à chaque déploiement — le dossier blog/ n'est pas versionné.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'content', 'blog');
const OUT = path.join(ROOT, 'blog');
const LEGAL_SRC = path.join(ROOT, 'content', 'legal');
const LEGAL_OUT = path.join(ROOT, 'legal');
const SITE = 'https://bewegtcreative.com';
const FALLBACK_COVER = '/img/hero.jpg';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

// gray-matter transforme `date: 2026-08-03` en objet Date ; on veut YYYY-MM-DD.
function isoDate(value, fallback) {
  if (value instanceof Date && !isNaN(value)) return value.toISOString().slice(0, 10);
  const s = String(value ?? '');
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : fallback;
}

// Seuls YouTube et Vimeo sont acceptés : une adresse quelconque ne produit aucune iframe.
function videoEmbed(url, title) {
  const raw = String(url ?? '').trim();
  const yt = raw.match(/^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([\w-]{6,20})/);
  const vimeo = raw.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(?:video\/)?(\d{6,12})/);
  const src = yt
    ? `https://www.youtube-nocookie.com/embed/${yt[1]}`
    : vimeo
      ? `https://player.vimeo.com/video/${vimeo[1]}`
      : '';
  if (!src) return '';
  return `  <div class="post-video"><iframe src="${esc(src)}" title="${esc(title)}" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>\n`;
}


// Netlify redimensionne et convertit en WebP à la volée : rien à installer,
// rien à stocker, et l'original reste intact dans le dépôt.
const cdn = (src, w) =>
  /^\/(img|portfolio-designs)\//.test(String(src))
    ? `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&fm=webp&q=80`
    : src;

const srcset = (src, widths) => widths.map((w) => `${cdn(src, w)} ${w}w`).join(', ');

// Les photos insérées dans le texte passent aussi par le CDN.
function optimiseImages(html) {
  return html.replace(/<img([^>]*?)src="(\/img\/[^"]+)"([^>]*?)>/g, (balise, avant, src, apres) => {
    if (/srcset=/.test(balise)) return balise;
    const lazy = /loading=/.test(balise) ? '' : ' loading="lazy"';
    return `<img${avant}src="${esc(cdn(src, 1200))}" srcset="${esc(srcset(src, [480, 800, 1200]))}" sizes="(max-width: 780px) 90vw, 760px"${lazy}${apres}>`;
  });
}

// Le CMS autorise le Markdown, pas du code exécutable. `marked` accepte aussi
// le HTML brut ; on impose donc une frontière de contenu avant publication.
const MARKDOWN_SANITIZE_OPTIONS = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel', 'title'],
    img: ['src', 'srcset', 'sizes', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
  allowProtocolRelative: false,
};

const renderMarkdown = (markdown) =>
  optimiseImages(sanitizeHtml(marked.parse(String(markdown ?? '')), MARKDOWN_SANITIZE_OPTIONS));

const safeMediaPath = (value, extensions) => {
  const raw = String(value ?? '').trim();
  if (!raw.startsWith('/img/blog/') || raw.includes('..') || !extensions.test(raw.split(/[?#]/)[0])) return '';
  return raw;
};

const safeLink = (value) => {
  const raw = String(value ?? '').trim();
  if (/^\/(?!\/)/.test(raw) || /^https:\/\//i.test(raw) || /^mailto:/i.test(raw)) return raw;
  return '';
};

const humanDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });

function parsePost(filename, raw) {
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.md$/, '');
  const title = data.title || slug;
  return {
    slug,
    url: `/blog/${slug}.html`,
    title,
    date: isoDate(data.date, filename.slice(0, 10)),
    summary: data.summary || '',
    cover: data.cover || FALLBACK_COVER,
    coverAlt: data.coverAlt || title,
    draft: data.draft === true,
    lang: ['en', 'fr', 'de'].includes(data.lang) ? data.lang : 'en',
    // Relie les versions d'un même article entre elles.
    group: data.group || '',
    video: data.video || '',
    author: String(data.author || 'BEWEGT CREATIVE STUDIO'),
    category: String(data.category || ''),
    gallery: (Array.isArray(data.gallery) ? data.gallery : [])
      .map((item) => ({
        image: safeMediaPath(item?.image, /\.(?:avif|gif|jpe?g|png|webp)$/i),
        alt: String(item?.alt || ''),
        caption: String(item?.caption || ''),
      }))
      .filter((item) => item.image),
    localVideo: safeMediaPath(data.localVideo, /\.(?:mp4|webm)$/i),
    videoPoster: safeMediaPath(data.videoPoster, /\.(?:avif|jpe?g|png|webp)$/i),
    localAudio: safeMediaPath(data.localAudio, /\.(?:m4a|mp3|ogg|wav)$/i),
    mediaTitle: String(data.mediaTitle || ''),
    documents: (Array.isArray(data.documents) ? data.documents : [])
      .map((item) => ({
        file: safeMediaPath(item?.file, /\.pdf$/i),
        title: String(item?.title || 'Document PDF'),
        description: String(item?.description || ''),
      }))
      .filter((item) => item.file),
    cta: data.cta && typeof data.cta === 'object'
      ? { label: String(data.cta.label || ''), url: safeLink(data.cta.url) }
      : { label: '', url: '' },
    // Écrits par des lecteurs : jamais interprétés comme du Markdown ou du HTML.
    comments: (Array.isArray(data.comments) ? data.comments : [])
      .filter((c) => c && c.message)
      .map((c) => ({
        name: String(c.name || 'Anonymous'),
        date: isoDate(c.date, ''),
        message: String(c.message),
      })),
    body: renderMarkdown(content),
  };
}

function readPosts(dir = SRC) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parsePost(f, fs.readFileSync(path.join(dir, f), 'utf8')))
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

const NAV = `
<header class="nav" id="nav">
  <a class="brand brand-logo" href="/index.html" aria-label="BEWEGT CREATIVE STUDIO"><img class="brand-mark brand-mark-light" src="/img/brand/bewegt-logo-horizontal-ivory.png" width="1188" height="285" alt="BEWEGT CREATIVE STUDIO"><img class="brand-mark brand-mark-dark" src="/img/brand/bewegt-logo-horizontal-black.png" width="1188" height="285" alt="" aria-hidden="true"></a>
  <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
  <nav class="nav-links" id="navLinks">
    <a href="/index.html#studio" data-i18n="nav.studio">Studio</a>
    <div class="nav-dropdown">
      <button type="button" aria-haspopup="true" aria-expanded="false" data-i18n="nav.services">Services</button>
      <div class="nav-dropdown-menu service-mega-menu">
        <a class="nav-service-link" href="/photography.html">
          <img src="/img/craft-photography.webp" srcset="/img/craft-photography-240w.webp 240w, /img/craft-photography.webp 1536w" sizes="(max-width: 780px) 74px, 112px" width="1536" height="1024" alt="Photography" loading="lazy">
          <span><strong data-i18n="service.photography.title">Photography</strong><small data-i18n="service.photography.tagline">Portraits, weddings, events and visual stories with a cinematic eye.</small></span>
        </a>
        <a class="nav-service-link" href="/video-production.html">
          <img src="/img/craft-video.webp" srcset="/img/craft-video-240w.webp 240w, /img/craft-video.webp 1376w" sizes="(max-width: 780px) 74px, 112px" width="1376" height="768" alt="Video Production" loading="lazy">
          <span><strong data-i18n="service.video-production.title">Video Production</strong><small data-i18n="service.video-production.tagline">Films, documentaries, interviews and cinematic content for stories that matter.</small></span>
        </a>
        <a class="nav-service-link" href="/live-streaming.html">
          <img src="/img/craft-live.webp" srcset="/img/craft-live-240w.webp 240w, /img/craft-live.webp 1535w" sizes="(max-width: 780px) 74px, 112px" width="1535" height="1024" alt="Live Streaming" loading="lazy">
          <span><strong data-i18n="service.live-streaming.title">Live Streaming</strong><small data-i18n="service.live-streaming.tagline">Multi-camera streaming for churches, concerts, conferences and hybrid events.</small></span>
        </a>
        <a class="nav-service-link" href="/graphic-design.html">
          <img src="/img/craft-design.webp" srcset="/img/craft-design-240w.webp 240w, /img/craft-design.webp 1536w" sizes="(max-width: 780px) 74px, 112px" width="1536" height="1024" alt="Graphic Design" loading="lazy">
          <span><strong data-i18n="service.graphic-design.title">Graphic Design</strong><small data-i18n="service.graphic-design.tagline">Posters, visual campaigns, brand identity and digital communication.</small></span>
        </a>
        <a class="nav-service-link" href="/podcast-production.html">
          <img src="/img/craft-podcast.webp" srcset="/img/craft-podcast-240w.webp 240w, /img/craft-podcast.webp 1672w" sizes="(max-width: 780px) 74px, 112px" width="1672" height="941" alt="Podcast Production" loading="lazy">
          <span><strong data-i18n="service.podcast-production.title">Podcast Production</strong><small data-i18n="service.podcast-production.tagline">Recording, editing, audio identity and podcast visuals for meaningful conversations.</small></span>
        </a>
      </div>
    </div>
    <a href="/index.html#work" data-i18n="nav.work">Work</a>
    <a href="/blog/" data-i18n="nav.blog">Blog</a>
    <a href="/index.html#faq" data-i18n="nav.faq">FAQ</a>
    <a class="nav-cta" href="/index.html#contact" data-i18n="nav.start">Start a Project</a>
  </nav>
  <div class="lang-switcher">
    <button type="button" class="lang-btn is-active" data-lang="en" aria-label="English">🇬🇧</button>
    <button type="button" class="lang-btn" data-lang="fr" aria-label="Français">🇫🇷</button>
    <button type="button" class="lang-btn" data-lang="de" aria-label="Deutsch">🇩🇪</button>
  </div>
</header>`;

const FOOTER = `
<footer class="footer">
  <div class="footer-grid">
    <div>
      <strong>BEWEGT CREATIVE STUDIO</strong>
      <p data-i18n="footer.tagline">Visual experiences that move people.</p>
      <p>Germany ↔ Europe ↔ Africa</p>
    </div>
    <div>
      <span data-i18n="footer.contact">Contact</span>
      <a href="https://wa.me/4917670064700?text=Hello%20BEWEGT%20CREATIVE%20STUDIO%2C%20I%20would%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener">WhatsApp</a>
      <a href="mailto:contact@bewegtcreative.com">contact@bewegtcreative.com</a>
    </div>
    <div>
      <span data-i18n="footer.social">Social</span>
      <a href="https://www.youtube.com/@bewegtcreativestudio" target="_blank" rel="noopener">YouTube</a>
    </div>
  </div>
  <p class="legal-links"><a href="/legal/impressum.html">Impressum</a><a href="/legal/datenschutz.html">Datenschutz</a></p>
  <p class="copyright" data-i18n="footer.legal">© 2026 BEWEGT CREATIVE STUDIO. All Rights Reserved.</p>
</footer>

<a class="whatsapp-float" href="https://wa.me/4917670064700?text=Hello%20BEWEGT%20CREATIVE%20STUDIO%2C%20I%20would%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener">
  <span class="whatsapp-pulse"></span>
  <span>WhatsApp</span>
</a>
<script src="/consent.js" defer></script>
<script src="/script.js" defer></script>`;

function shell({ title, description, url, image, main, bodyClass = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <meta name="theme-color" content="#0a0a0a">
<title>${esc(title)} — BEWEGT CREATIVE STUDIO</title>
<meta name="description" content="${esc(description)}">
  <meta name="author" content="BEWEGT CREATIVE STUDIO">
  <link rel="canonical" href="${esc(SITE + url)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(title)} — BEWEGT CREATIVE STUDIO">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(SITE + url)}">
  <meta property="og:site_name" content="BEWEGT CREATIVE STUDIO">
  <meta property="og:image" content="${esc(SITE + image)}">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)} — BEWEGT CREATIVE STUDIO">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(SITE + image)}">
<link rel="stylesheet" href="/style.css">
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${NAV}

<main>
${main}
</main>
${FOOTER}
</body>
</html>
`;
}

function renderIndex(posts) {
  const cards = posts.length
    ? posts
        .map(
          (p) => `      <a class="blog-card" data-lang="${esc(p.lang)}" lang="${esc(p.lang)}" href="${esc(p.url)}">
        <img src="${esc(cdn(p.cover, 800))}" srcset="${esc(srcset(p.cover, [480, 800, 1200]))}" sizes="(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw" alt="${esc(p.coverAlt)}" width="1200" height="800" loading="lazy">
        <div class="blog-card-body">
          <time datetime="${esc(p.date)}">${esc(humanDate(p.date))}</time>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.summary)}</p>
        </div>
      </a>`
        )
        .join('\n')
    : '';

  return shell({
    title: 'Journal',
    description: 'Stories, behind the scenes and visual work from BEWEGT CREATIVE STUDIO.',
    url: '/blog/',
    image: '/img/og-image.jpg',
    main: `  <section class="page-hero">
    <picture><source srcset="/img/behind.webp" type="image/webp"><img src="/img/behind.jpg" width="1600" height="1067" alt="BEWEGT behind the scenes"></picture>
    <div class="hero-overlay"></div>
    <div class="page-hero-content">
      <p class="eyebrow" data-i18n="blog.eyebrow">Journal</p>
      <h1 data-i18n="blog.title">Stories</h1>
      <p data-i18n="blog.sub">Behind the scenes, projects and thoughts from the studio.</p>
    </div>
  </section>

  <section class="blog-section">
    <div class="blog-grid">
${cards}
    </div>
    <p class="blog-empty" data-i18n="blog.empty"${posts.length ? ' hidden' : ''}>No stories published yet. Come back soon.</p>
  </section>`,
  });
}

// Les commentaires sont du texte brut échappé : ni Markdown, ni HTML, ni lien cliquable.
function renderComments(post) {
  const list = post.comments
    .map(
      (c) => `      <li class="comment">
        <p class="comment-head"><strong>${esc(c.name)}</strong>${c.date ? ` <time datetime="${esc(c.date)}">${esc(humanDate(c.date))}</time>` : ''}</p>
        <p class="comment-text">${esc(c.message).replace(/\r?\n/g, '<br>')}</p>
      </li>`
    )
    .join('\n');

  return `  <section class="comments" id="comments">
    <div class="comments-inner">
      <p class="eyebrow" data-i18n="comments.eyebrow">Comments</p>
      <h2 data-i18n="${post.comments.length ? 'comments.some' : 'comments.none'}">${post.comments.length ? 'What readers said' : 'Be the first to comment'}</h2>
${post.comments.length ? `      <ul class="comment-list">\n${list}\n      </ul>` : ''}

      <form class="comment-form" name="comment" method="POST" action="/comment-received.html" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="comment">
        <input type="hidden" name="post" value="${esc(post.slug)}">
        <p class="comment-hp"><label>Leave this field empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <label for="c-name" data-i18n="comments.name">Your name</label>
        <input id="c-name" name="name" type="text" required maxlength="80" autocomplete="name">
        <label for="c-email"><span data-i18n="comments.email">Your email</span> <span class="note" data-i18n="comments.emailNote">— not published, only so we can reply</span></label>
        <input id="c-email" name="email" type="email" maxlength="120" autocomplete="email">
        <label for="c-message" data-i18n="comments.message">Your comment</label>
        <textarea id="c-message" name="message" rows="5" required maxlength="2000"></textarea>
        <label class="comment-consent"><input type="checkbox" name="consent" required> <span data-i18n="comments.consent">I agree that my name and comment may be published on this page.</span></label>
        <button class="btn btn-dark" type="submit" data-i18n="comments.send">Send comment</button>
        <p class="comment-note" data-i18n="comments.note">Comments are reviewed before they appear. We never publish your email address.</p>
      </form>
    </div>
  </section>`;
}

function renderEditorialMedia(post) {
  const gallery = post.gallery.length
    ? `<section class="post-gallery" aria-label="Galerie photo">${post.gallery.map((item) => `
      <figure class="design-card" data-full="${esc(cdn(item.image, 2000))}" data-caption="${esc(item.caption || item.alt)}"><img src="${esc(cdn(item.image, 1200))}" srcset="${esc(srcset(item.image, [480, 800, 1200]))}" sizes="(max-width: 780px) 90vw, 46vw" alt="${esc(item.alt)}" loading="lazy" decoding="async">${item.caption ? `<figcaption>${esc(item.caption)}</figcaption>` : ''}</figure>`).join('')}
    </section>`
    : '';
  const localVideo = post.localVideo
    ? `<figure class="post-media post-media-video">${post.mediaTitle ? `<figcaption>${esc(post.mediaTitle)}</figcaption>` : ''}<video controls preload="metadata" playsinline${post.videoPoster ? ` poster="${esc(cdn(post.videoPoster, 1200))}"` : ''}><source src="${esc(post.localVideo)}">Votre navigateur ne peut pas lire cette vidéo.</video><a class="media-download" href="${esc(post.localVideo)}" download>Télécharger la vidéo</a></figure>`
    : '';
  const audio = post.localAudio
    ? `<figure class="post-media post-media-audio"><figcaption>${esc(post.mediaTitle || 'Écouter')}</figcaption><audio controls preload="metadata" src="${esc(post.localAudio)}">Votre navigateur ne peut pas lire cet audio.</audio></figure>`
    : '';
  const documents = post.documents.length
    ? `<section class="post-documents" aria-label="Documents à télécharger"><h2>Documents</h2>${post.documents.map((document) => `<a class="post-document" href="${esc(document.file)}" download><span aria-hidden="true">PDF</span><strong>${esc(document.title)}</strong>${document.description ? `<small>${esc(document.description)}</small>` : ''}<b aria-hidden="true">↓</b></a>`).join('')}</section>`
    : '';
  const cta = post.cta.label && post.cta.url
    ? `<aside class="post-cta"><p>${esc(post.cta.label)}</p><a href="${esc(post.cta.url)}"${post.cta.url.startsWith('https://') ? ' target="_blank" rel="noopener"' : ''}>Découvrir <span aria-hidden="true">→</span></a></aside>`
    : '';
  // La visionneuse du site s'accroche à .design-card ; son conteneur doit être sur la page.
  const lightbox = post.gallery.length
    ? `<div class="lightbox" id="lightbox" aria-hidden="true">
    <button class="lightbox-close" id="lightboxClose" type="button" aria-label="Fermer">&times;</button>
    <button class="lightbox-nav lightbox-prev" id="lightboxPrev" type="button" aria-label="Photo précédente">&#10094;</button>
    <img id="lightboxImg" src="" alt="">
    <button class="lightbox-nav lightbox-next" id="lightboxNext" type="button" aria-label="Photo suivante">&#10095;</button>
    <p id="lightboxCaption"></p>
  </div>`
    : '';
  return gallery + localVideo + audio + documents + cta + lightbox;
}

function renderPost(post, versions = {}) {
  return shell({
    title: post.title,
    description: post.summary,
    url: post.url,
    image: post.cover,
    main: `  <section class="page-hero post-hero">
    <img src="${esc(cdn(post.cover, 1600))}" srcset="${esc(srcset(post.cover, [800, 1200, 1600, 2000]))}" sizes="100vw" width="1600" height="1067" alt="${esc(post.coverAlt)}">
    <div class="hero-overlay"></div>
    <div class="page-hero-content">
      <p class="eyebrow">${post.category ? `${esc(post.category)} · ` : ''}<time datetime="${esc(post.date)}">${esc(humanDate(post.date))}</time> · ${esc(post.author)}</p>
      <h1 lang="${esc(post.lang)}">${esc(post.title)}</h1>
      ${post.summary ? `<p lang="${esc(post.lang)}">${esc(post.summary)}</p>` : ''}
    </div>
  </section>

  <article class="post-body" lang="${esc(post.lang)}"${
      Object.keys(versions).length ? ` data-translations="${esc(JSON.stringify(versions))}"` : ''
    }>
${videoEmbed(post.video, post.title)}${post.body}${renderEditorialMedia(post)}
  </article>

${renderComments(post)}

  <section class="next-services">
    <p class="eyebrow" data-i18n="blog.eyebrow">Journal</p>
    <div><a href="/blog/" data-i18n="blog.all">All stories</a><a href="/index.html#contact">Start a Project</a></div>
  </section>`,
  });
}

// Sitemap séparé pour le blog, déclaré dans robots.txt : sitemap.xml reste inchangé.
function renderSitemap(posts) {
  const urls = [{ loc: `${SITE}/blog/`, lastmod: posts[0]?.date }, ...posts.map((p) => ({ loc: SITE + p.url, lastmod: p.date }))];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url>\n    <loc>${esc(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${esc(u.lastmod)}</lastmod>` : ''}\n  </url>`)
  .join('\n')}
</urlset>
`;
}

// Pages légales : même gabarit que le reste du site, éditables dans le back-office.
function renderLegal(page) {
  return shell({
    title: page.title,
    description: page.summary,
    url: `/legal/${page.slug}.html`,
    image: '/img/og-image.jpg',
    bodyClass: 'legal-page',
    main: `  <section class="legal-head">
    <p class="eyebrow">${esc(page.eyebrow || 'Rechtliches')}</p>
    <h1>${esc(page.title)}</h1>
  </section>

  <article class="post-body" lang="de">
${page.body}
  </article>`,
  });
}

function buildLegal() {
  if (!fs.existsSync(LEGAL_SRC)) return [];
  const pages = fs
    .readdirSync(LEGAL_SRC)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(LEGAL_SRC, f), 'utf8'));
      return {
        slug: f.replace(/\.md$/, ''),
        title: data.title || f,
        summary: data.summary || '',
        eyebrow: data.eyebrow || '',
        body: renderMarkdown(content),
      };
    });

  fs.rmSync(LEGAL_OUT, { recursive: true, force: true });
  fs.mkdirSync(LEGAL_OUT, { recursive: true });
  for (const page of pages) {
    fs.writeFileSync(path.join(LEGAL_OUT, `${page.slug}.html`), renderLegal(page));
  }
  return pages;
}

function build() {
  const posts = readPosts();
  // On repart d'un dossier vide : un article supprimé ne doit pas laisser sa page.
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'index.html'), renderIndex(posts));
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), renderSitemap(posts));
  const byGroup = {};
  for (const post of posts) {
    if (!post.group) continue;
    (byGroup[post.group] = byGroup[post.group] || {})[post.lang] = post.url;
  }
  for (const post of posts) {
    fs.writeFileSync(path.join(OUT, `${post.slug}.html`), renderPost(post, byGroup[post.group] || {}));
  }
  const legal = buildLegal();
  console.log(`blog: ${posts.length} article(s) généré(s) dans /blog`);
  console.log(`legal: ${legal.length} page(s) générée(s) dans /legal`);
  return posts;
}

if (require.main === module) build();

module.exports = { build, readPosts, parsePost, renderIndex, renderPost, renderComments, renderMarkdown, renderEditorialMedia, videoEmbed, isoDate, esc };
