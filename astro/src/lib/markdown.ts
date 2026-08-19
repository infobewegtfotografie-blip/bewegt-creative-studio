/**
 * Blog markdown rendering pipeline — direct TypeScript port of
 * build-blog.js's renderMarkdown/extraireNotes/extraireEncarts/
 * optimiseImages/tempsLecture/nombreMots (lines 55-125). Kept as a
 * standalone module (instead of Astro's built-in markdown renderer) so the
 * CMS's exact security posture — sanitize-html allowlist, footnote syntax
 * `[^1]`, `:::encart` callouts — carries over unchanged, already covered by
 * the legacy build-blog.test.js assertions this collection's tests mirror.
 * No Netlify Image CDN here (see the Cloudflare migration audit) — inline
 * article images just get lazy-loading; real responsive variants are a
 * Phase I concern.
 */
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export interface MarkdownNote {
  numero: number;
  contenu: string;
}

export interface RenderedMarkdown {
  html: string;
  notes: MarkdownNote[];
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s: unknown): string => String(s ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

// No Netlify Image CDN on Cloudflare (see the migration audit) — real
// multi-width variants are a Phase I concern (astro:assets / Cloudflare
// Images). A srcset naming the same file at several widths would be
// misleading, so this only adds lazy-loading, not a fake srcset.
function optimiseImages(html: string): string {
  return html.replace(/<img([^>]*?)src="(\/img\/[^"]+)"([^>]*?)>/g, (balise, avant, src, apres) => {
    const lazy = /loading=/.test(balise) ? '' : ' loading="lazy"';
    return `<img${avant}src="${esc(src)}"${apres}${lazy}>`;
  });
}

const SVG_TAGS = ['svg', 'defs', 'marker', 'g', 'path', 'line', 'circle', 'rect', 'text'];
const SVG_GEOMETRY_ATTRS = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'opacity', 'transform'];

const MARKDOWN_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption'], SVG_TAGS),
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel', 'title'],
    img: ['src', 'srcset', 'sizes', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
    svg: ['viewbox', 'xmlns', 'width', 'height', 'role', 'aria-label', ...SVG_GEOMETRY_ATTRS],
    defs: [],
    marker: ['id', 'viewbox', 'refx', 'refy', 'markerwidth', 'markerheight', 'orient', ...SVG_GEOMETRY_ATTRS],
    g: ['transform'],
    path: ['d', ...SVG_GEOMETRY_ATTRS],
    line: ['x1', 'y1', 'x2', 'y2', 'marker-end', 'marker-start', ...SVG_GEOMETRY_ATTRS],
    circle: ['cx', 'cy', 'r', ...SVG_GEOMETRY_ATTRS],
    rect: ['x', 'y', 'width', 'height', 'rx', 'ry', ...SVG_GEOMETRY_ATTRS],
    text: ['x', 'y', 'text-anchor', 'font-family', 'font-size', 'font-weight', 'font-style', ...SVG_GEOMETRY_ATTRS],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
  allowProtocolRelative: false,
};

function extraireNotes(html: string): RenderedMarkdown {
  const notes: MarkdownNote[] = [];
  html = html.replace(/<p>\s*\[\^(\d+)\]:\s*([\s\S]*?)<\/p>/g, (_, numero, contenu) => {
    notes.push({ numero: Number(numero), contenu: contenu.trim() });
    return '';
  });
  html = html.replace(/\[\^(\d+)\]/g, (appel, numero) => {
    const note = notes.find((n) => n.numero === Number(numero));
    if (!note) return appel;
    const bulle = note.contenu.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return `<a class="note" href="#note-${numero}" id="appel-${numero}">${numero}<span class="bulle">${esc(bulle)}</span></a>`;
  });
  notes.sort((a, b) => a.numero - b.numero);
  return { html, notes };
}

const extraireEncarts = (html: string): string =>
  html.replace(
    /<p>:::encart\s*([\s\S]*?)<\/p>([\s\S]*?)<p>:::<\/p>/g,
    (_, titre, contenu) => `<aside class="encart">${titre.trim() ? `<h3>${titre.trim()}</h3>` : ''}${contenu}</aside>`,
  );

export const tempsLecture = (markdown: string): number =>
  Math.max(1, Math.round(String(markdown ?? '').split(/\s+/).filter(Boolean).length / 200));

export const nombreMots = (markdown: string): number => String(markdown ?? '').split(/\s+/).filter(Boolean).length;

export function renderMarkdown(markdown: string): RenderedMarkdown {
  const propre = sanitizeHtml(marked.parse(String(markdown ?? ''), { async: false }), MARKDOWN_SANITIZE_OPTIONS);
  const { html, notes } = extraireNotes(extraireEncarts(propre));
  return { html: optimiseImages(html), notes };
}

/** Only YouTube/Vimeo embed — any other URL produces no iframe. Port of build-blog.js's videoEmbed(). */
export function videoEmbed(url: string | undefined, title: string): string {
  const raw = String(url ?? '').trim();
  const yt = raw.match(/^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([\w-]{6,20})/);
  const vimeo = raw.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(?:video\/)?(\d{6,12})/);
  const src = yt
    ? `https://www.youtube-nocookie.com/embed/${yt[1]}`
    : vimeo
      ? `https://player.vimeo.com/video/${vimeo[1]}`
      : '';
  if (!src) return '';
  return `<div class="post-video"><iframe src="${esc(src)}" title="${esc(title)}" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
}
