/**
 * Blog post derivation + grouping — port of build-blog.js's parsePost()
 * safety filters (safeMediaPath/safeLink) and build()'s byGroup/byCluster
 * grouping (lines 128-138, 764-780). Turns a raw content-collection entry
 * into everything a page needs: rendered HTML, reading time, hreflang
 * siblings, cluster neighbors.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { renderMarkdown, tempsLecture, nombreMots } from './markdown';

const FALLBACK_COVER = '/img/hero.jpg';

export type BlogEntry = CollectionEntry<'blog'>;

export interface Post {
  slug: string;
  url: string;
  title: string;
  date: string;
  summary: string;
  cover: string;
  aCouverture: boolean;
  coverAlt: string;
  lang: 'en' | 'fr' | 'de';
  group: string;
  cluster: string;
  pillar: boolean;
  video: string;
  author: string;
  category: string;
  gallery: { image: string; alt: string; caption: string }[];
  localVideo: string;
  videoPoster: string;
  localAudio: string;
  mediaTitle: string;
  documents: { file: string; title: string; description: string }[];
  cta: { label: string; url: string };
  comments: { name: string; date: string; message: string }[];
  next: string;
  readMore: string[];
  tempsLecture: number;
  nombreMots: number;
  body: string;
  notes: { numero: number; contenu: string }[];
  partage: string;
}

const safeMediaPath = (value: string | undefined, extensions: RegExp): string => {
  const raw = String(value ?? '').trim();
  if (!raw.startsWith('/img/blog/') || raw.includes('..') || !extensions.test(raw.split(/[?#]/)[0])) return '';
  return raw;
};

const safeLink = (value: string | undefined): string => {
  const raw = String(value ?? '').trim();
  if (/^\/(?!\/)/.test(raw) || /^https:\/\//i.test(raw) || /^mailto:/i.test(raw)) return raw;
  return '';
};

export const humanDate = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function toPost(entry: BlogEntry): Post {
  const d = entry.data;
  const isoDate = d.date.toISOString().slice(0, 10);
  const gallery = d.gallery
    .map((item) => ({ image: safeMediaPath(item.image, /\.(?:avif|gif|jpe?g|png|webp)$/i), alt: item.alt, caption: item.caption }))
    .filter((item) => item.image);
  const documents = d.documents
    .map((doc) => ({ file: safeMediaPath(doc.file, /\.pdf$/i), title: doc.title, description: doc.description }))
    .filter((doc) => doc.file);
  const cta = { label: d.cta.label, url: safeLink(d.cta.url) };
  const rendered = renderMarkdown(entry.body ?? '');
  const premiere = /<img[^>]+src="([^"]+)"/.exec(rendered.html)?.[1];

  return {
    slug: entry.id,
    url: `/blog/${entry.id}.html`,
    title: d.title,
    date: isoDate,
    summary: d.summary,
    cover: d.cover || FALLBACK_COVER,
    aCouverture: Boolean(d.cover),
    coverAlt: d.coverAlt || d.title,
    lang: d.lang,
    group: d.group,
    cluster: d.cluster,
    pillar: d.pillar,
    video: d.video,
    author: d.author,
    category: d.category,
    gallery,
    localVideo: safeMediaPath(d.localVideo, /\.(?:mp4|webm)$/i),
    videoPoster: safeMediaPath(d.videoPoster, /\.(?:avif|jpe?g|png|webp)$/i),
    localAudio: safeMediaPath(d.localAudio, /\.(?:m4a|mp3|ogg|wav)$/i),
    mediaTitle: d.mediaTitle,
    documents,
    cta,
    comments: d.comments.map((c) => ({
      name: c.name,
      date: c.date instanceof Date ? c.date.toISOString().slice(0, 10) : (c.date ?? ''),
      message: c.message,
    })),
    next: d.next,
    readMore: d.readMore,
    tempsLecture: tempsLecture(entry.body ?? ''),
    nombreMots: nombreMots(entry.body ?? ''),
    body: rendered.html,
    notes: rendered.notes,
    partage: d.cover || premiere || FALLBACK_COVER,
  };
}

let cachedPosts: Post[] | null = null;

/** All published posts, newest first — mirrors build-blog.js's readPosts() sort/draft filter. */
export async function getAllPosts(): Promise<Post[]> {
  if (cachedPosts) return cachedPosts;
  const entries = await getCollection('blog', ({ data }) => !data.draft);
  cachedPosts = entries.map(toPost).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  return cachedPosts;
}

/** Sibling-language URLs keyed by lang code, for hreflang + the article language switcher. */
export async function getGroupVersions(post: Post): Promise<Record<string, string>> {
  if (!post.group) return {};
  const posts = await getAllPosts();
  const versions: Record<string, string> = {};
  for (const p of posts) {
    if (p.group === post.group) versions[p.lang] = p.url;
  }
  return versions;
}

/** Same-cluster, same-language posts (excluding drafts), matching build-blog.js's byCluster scoping. */
export async function getClusterPosts(post: Post): Promise<Post[]> {
  if (!post.cluster) return [];
  const posts = await getAllPosts();
  return posts.filter((p) => p.cluster === post.cluster && p.lang === post.lang);
}
