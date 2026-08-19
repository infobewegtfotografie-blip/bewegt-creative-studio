#!/usr/bin/env node
/*
 * Astro's `build.format: "file"` (needed so every other route matches the
 * legacy site's flat *.html URLs) flattens `src/pages/blog/index.astro`
 * into `dist/blog.html` instead of `dist/blog/index.html` — see
 * https://github.com/withastro/astro/blob/main/packages/astro/src/core/build/common.ts.
 * Cloudflare Pages (like Netlify) auto-serves `<dir>/index.html` for a
 * `/<dir>/` request, so this moves the file to where that convention
 * expects it, keeping the canonical `/blog/` URL working with no rewrite
 * rule needed.
 */
import { existsSync, mkdirSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'client');
const flatFile = join(distDir, 'blog.html');
const targetDir = join(distDir, 'blog');
const targetFile = join(targetDir, 'index.html');

if (!existsSync(flatFile)) {
  console.error('fix-blog-index: dist/blog.html not found — did the Astro output shape change?');
  process.exit(1);
}

mkdirSync(targetDir, { recursive: true });
renameSync(flatFile, targetFile);
console.log('fix-blog-index: moved blog.html -> blog/index.html');
