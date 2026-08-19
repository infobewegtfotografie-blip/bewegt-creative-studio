import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Legal pages (Impressum, Datenschutz) — same frontmatter fields the
// legacy build-blog.js's renderLegal() read (title/eyebrow/summary),
// content copied verbatim from content/legal/*.md.
const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    summary: z.string().optional(),
  }),
});

// Blog posts — schema mirrors build-blog.js's parsePost() frontmatter
// reading (lines 145-214) field-for-field, so nothing the CMS (Decap) can
// write goes unrecognized. Markdown body is rendered separately via
// src/lib/markdown.ts (not Astro's built-in renderer) to keep the exact
// same footnote/encart/sanitization pipeline the legacy site tested.
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().default(''),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
    lang: z.enum(['en', 'fr', 'de']).default('en'),
    group: z.string().default(''),
    cluster: z.string().default(''),
    pillar: z.boolean().default(false),
    video: z.string().default(''),
    author: z.string().default('BEWEGT CREATIVE STUDIO'),
    category: z.string().default(''),
    gallery: z
      .array(z.object({ image: z.string(), alt: z.string().default(''), caption: z.string().default('') }))
      .default([]),
    localVideo: z.string().default(''),
    videoPoster: z.string().default(''),
    localAudio: z.string().default(''),
    mediaTitle: z.string().default(''),
    documents: z
      .array(z.object({ file: z.string(), title: z.string().default('Document PDF'), description: z.string().default('') }))
      .default([]),
    cta: z.object({ label: z.string().default(''), url: z.string().default('') }).default({ label: '', url: '' }),
    comments: z
      .array(z.object({ name: z.string().default('Anonymous'), date: z.union([z.coerce.date(), z.string()]).optional(), message: z.string() }))
      .default([]),
    next: z.string().default(''),
    readMore: z.array(z.string()).default([]),
  }),
});

export const collections = { legal, blog };
