/* Vérification minimale du générateur : node build-blog.test.js */
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { readPosts, parsePost, renderPost, renderIndex, videoEmbed, isoDate } = require('./build-blog');

// SÉCURITÉ — le champ vidéo devient une iframe : uniquement vers YouTube et Vimeo.
assert.ok(videoEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 't').includes('youtube-nocookie.com/embed/dQw4w9WgXcQ'));
assert.ok(videoEmbed('https://youtu.be/dQw4w9WgXcQ', 't').includes('youtube-nocookie.com/embed/'));
assert.ok(videoEmbed('https://vimeo.com/123456789', 't').includes('player.vimeo.com/video/123456789'));
for (const bad of [
  'https://evil.example/video',
  'javascript:alert(1)',
  'data:text/html,<script>alert(1)</script>',
  'https://youtube.com.evil.example/watch?v=abcdef',
  '"><script>alert(1)</script>',
  '',
  undefined,
]) {
  assert.strictEqual(videoEmbed(bad, 't'), '', `adresse vidéo acceptée à tort : ${bad}`);
}

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

// La langue de l'article : repli sur l'anglais, valeurs fantaisistes refusées.
assert.strictEqual(parsePost('a.md', '---\ntitle: T\n---\n').lang, 'en');
assert.strictEqual(parsePost('a.md', '---\ntitle: T\nlang: fr\n---\n').lang, 'fr');
assert.strictEqual(parsePost('a.md', '---\ntitle: T\nlang: klingon\n---\n').lang, 'en');

// La carte doit porter sa langue, sinon le filtrage du sélecteur ne peut pas fonctionner.
const idxFr = renderIndex([parsePost('b.md', '---\ntitle: Lomé\nlang: fr\n---\nTexte.\n')]);
assert.ok(idxFr.includes('data-lang="fr"'), 'la carte ne porte pas sa langue');
assert.ok(idxFr.includes('class="blog-empty" data-i18n="blog.empty" hidden'), 'message vide absent ou visible à tort');

// Les versions d'un même article ne sont reliées que par un groupe commun.
const enPost = parsePost('en.md', '---\ntitle: Hello\nlang: en\ngroup: ouverture\n---\nA\n');
const liee = renderPost(enPost, { fr: '/blog/bonjour.html', de: '/blog/hallo.html' });
assert.ok(liee.includes('data-translations='), 'table de traduction absente');
assert.ok(liee.includes('bonjour.html'), 'version française non reliée');
// Sans groupe, aucune table : le drapeau ne doit mener nulle part.
assert.ok(!renderPost(enPost, {}).includes('data-translations='), 'table présente à tort');
assert.strictEqual(parsePost('x.md', '---\ntitle: T\n---\n').group, '');

// Les images locales passent par le CDN Netlify, les adresses externes non.
const avecImages = parsePost('i.md', '---\ntitle: T\ncover: https://exemple.org/p.jpg\n---\n![a](/img/blog/photo.png)\n');
assert.strictEqual(avecImages.cover, 'https://exemple.org/p.jpg', 'adresse externe réécrite à tort');
assert.ok(avecImages.body.includes('/.netlify/images'), 'image locale non optimisée');
assert.ok(avecImages.body.includes('srcset='), 'srcset absent');
assert.ok(avecImages.body.includes('loading="lazy"'), 'chargement différé absent');

// Un blog vide doit produire une page valide, pas planter.
assert.ok(renderIndex([]).includes('No stories published yet'));

// SÉCURITÉ — un commentaire est écrit par un inconnu : il ne doit JAMAIS devenir du HTML.
const attack = parsePost(
  '2026-08-04-avis.md',
  `---
title: Avis
comments:
  - name: '<img src=x onerror=alert(1)>'
    date: 2026-08-04
    message: "Bravo !\\n<script>alert('xss')</script>"
---

Corps.
`
);
const page = renderPost(attack);
assert.strictEqual(attack.comments.length, 1);
assert.ok(!page.includes('<script>alert'), 'script injecté via un commentaire');
assert.ok(!page.includes('<img src=x'), 'balise img injectée via un nom');
assert.ok(page.includes('&lt;script&gt;'), 'le commentaire doit être affiché échappé');
assert.ok(page.includes('Bravo !<br>'), 'les retours à la ligne deviennent des <br>');

// Le formulaire doit rester lié au bon article et garder son piège à robots.
assert.ok(page.includes('name="post" value="2026-08-04-avis"'), 'slug absent du formulaire');
assert.ok(page.includes('netlify-honeypot="bot-field"'), 'honeypot absent');

// Un commentaire sans message est ignoré ; sans nom il devient Anonymous.
const partial = parsePost('x.md', '---\ntitle: T\ncomments:\n  - name: A\n  - message: Coucou\n---\n');
assert.deepStrictEqual(partial.comments, [{ name: 'Anonymous', date: '', message: 'Coucou' }]);

fs.rmSync(dir, { recursive: true, force: true });
console.log('build-blog: OK');
