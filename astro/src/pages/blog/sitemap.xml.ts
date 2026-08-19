// Blog-only sitemap, declared separately in robots.txt (root sitemap.xml
// stays hand-maintained for the rest of the site). Port of build-blog.js's
// renderSitemap() (lines 703-712).
import type { APIRoute } from 'astro';
import { getAllPosts } from '../../lib/blog';
import { SITE_URL } from '../../lib/seo';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const urls = [{ loc: `${SITE_URL}/blog/`, lastmod: posts[0]?.date }, ...posts.map((p) => ({ loc: `${SITE_URL}${p.url}`, lastmod: p.date }))];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}\n  </url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
