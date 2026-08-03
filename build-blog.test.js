/* Vérification minimale du générateur : node build-blog.test.js */
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { readPosts, parsePost, renderPost, renderIndex, isoDate } = require('./build-blog');

// gray-matter rend un objet Date pour `date: 2026-08-03` — on doit retomber sur YYYY-MM-DD.
assert.strictEqual(isoDate(new Date('2026-08-03T00:00:00Z'), 'x'), '2026-08-03');
assert.strictEqual(isoDate('2026-08-03', 'x'), '2026-08-03');
assert.strictEqual(isoDate(undefined, '2026-01-01'), '2026-01-01');

// Les valeurs du front matter finissent dans des attributs HTML : elles doivent être échappées.
const nasty = parsePost(
  '2026-08-03-test.md',
  '---\ntitle: \'Fuji "X" & <b>co</b>\'\nsummary: a"b\n---\n\nBonjour.\n'
);
const html = renderPost(nasty);
assert.ok(html.includes('Fuji &quot;X&quot; &amp; &lt;b&gt;co&lt;/b&gt;'), 'titre non échappé');
assert.ok(!html.includes('content="a"b"'), 'guillemet non échappé dans une meta');
assert.ok(html.includes('<p>Bonjour.</p>'), 'le corps Markdown doit rester du HTML rendu');
assert.strictEqual(nasty.url, '/blog/2026-08-03-test.html');

// Les brouillons sont exclus, le reste est trié du plus récent au plus ancien.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-'));
fs.writeFileSync(path.join(dir, '2026-01-01-vieux.md'), '---\ntitle: Vieux\n---\nA\n');
fs.writeFileSync(path.join(dir, '2026-08-01-recent.md'), '---\ntitle: Recent\n---\nB\n');
fs.writeFileSync(path.join(dir, '2026-09-01-brouillon.md'), '---\ntitle: Draft\ndraft: true\n---\nC\n');
const posts = readPosts(dir);
assert.deepStrictEqual(posts.map((p) => p.title), ['Recent', 'Vieux']);

// Un blog vide doit produire une page valide, pas planter.
assert.ok(renderIndex([]).includes('No stories published yet'));

fs.rmSync(dir, { recursive: true, force: true });
console.log('build-blog: OK');
