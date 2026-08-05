/* Vérification minimale du générateur : node build-blog.test.js */
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { readPosts, parsePost, renderPost, renderIndex, renderMarkdown, renderEditorialMedia, videoEmbed, isoDate } = require('./build-blog');

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

// SÉCURITÉ — le Markdown du CMS est du contenu, jamais du code exécutable.
const hostileMarkdown = renderMarkdown(`
# Titre sûr

<script>alert('script')</script>
<img src="/img/blog/photo.png" alt="Photo" onerror="alert('event')">
[Lien piégé](javascript:alert('url'))
<svg onload="alert('svg')"><circle></circle></svg>

[Lien légitime](https://bewegtcreative.com/blog/)
`);
assert.ok(hostileMarkdown.includes('<h1>Titre sûr</h1>'), 'titre Markdown supprimé');
assert.ok(hostileMarkdown.includes('href="https://bewegtcreative.com/blog/"'), 'lien HTTPS légitime supprimé');
assert.ok(hostileMarkdown.includes('alt="Photo"'), 'attribut alt légitime supprimé');
assert.ok(hostileMarkdown.includes('/.netlify/images'), 'optimisation des images locales perdue');
assert.ok(!hostileMarkdown.includes('<script'), 'balise script conservée');
assert.ok(!hostileMarkdown.includes('onerror'), 'gestionnaire événementiel conservé');
assert.ok(!/href=["']\s*javascript:/i.test(hostileMarkdown), 'lien javascript actif conservé');
assert.ok(!hostileMarkdown.includes('<svg'), 'SVG actif conservé');

// Les médias éditoriaux sont guidés et limités aux fichiers téléversés dans le blog.
const richPost = parsePost('media.md', `---
title: Article riche
gallery:
  - image: /img/blog/photo.webp
    alt: Équipe en tournage
    caption: Coulisses
localVideo: /img/blog/showreel.mp4
videoPoster: /img/blog/poster.jpg
localAudio: /img/blog/interview.mp3
mediaTitle: Dans les coulisses
documents:
  - title: Dossier de presse
    file: /img/blog/presse.pdf
cta:
  label: Parlons de votre projet
  url: /index.html#contact
---
Texte ✨
`);
const richMedia = renderEditorialMedia(richPost);
assert.ok(richMedia.includes('class="post-gallery"'), 'galerie absente');
assert.ok(richMedia.includes('<video controls'), 'vidéo locale absente');
assert.ok(richMedia.includes('<audio controls'), 'audio local absent');
assert.ok(richMedia.includes('presse.pdf'), 'PDF absent');
assert.ok(richMedia.includes('/index.html#contact'), 'CTA interne absent');
assert.ok(richPost.body.includes('✨'), 'emoji supprimé');
assert.ok(renderPost(richPost).includes('BEWEGT CREATIVE STUDIO'), 'auteur par défaut absent');
const rejectedMedia = parsePost('bad.md', `---
title: Mauvais média
localVideo: https://evil.example/payload.mp4
documents:
  - title: Piège
    file: /img/blog/../secret.pdf
cta:
  label: Piège
  url: javascript:alert(1)
---
Texte
`);
assert.strictEqual(renderEditorialMedia(rejectedMedia), '', 'média ou lien non fiable accepté');

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

// La galerie doit être branchée sur la visionneuse du site, sinon les photos ne s'agrandissent pas.
const avecGalerie = parsePost('g.md', [
  '---', 'title: G',
  'gallery:',
  '  - image: /img/blog/a.jpg',
  '    alt: Alt seul',
  '  - image: /img/blog/b.jpg',
  '    caption: Avec légende',
  '  - image: /evil/ailleurs.jpg',
  '    alt: Hors dossier autorisé',
  '---', '',
].join('\n'));
const media = renderEditorialMedia(avecGalerie);
assert.strictEqual(avecGalerie.gallery.length, 2, 'image hors /img/blog non rejetée');
assert.strictEqual((media.match(/design-card/g) || []).length, 2, 'photos non cliquables');
assert.ok(media.includes('id="lightbox"'), 'conteneur de visionneuse absent');
assert.ok(media.includes('data-caption="Alt seul"'), 'repli sur le texte alternatif absent');
// Sans galerie, pas de conteneur inutile sur la page.
assert.ok(!renderEditorialMedia(parsePost('v.md', '---\ntitle: V\n---\n')).includes('id="lightbox"'));

// Les emojis doivent traverser la chaîne sans être abîmés (teintes, drapeaux, familles).
const emoji = parsePost('e.md', '---\ntitle: Été 🌞\n---\nSalut 👋🏾 ❤️ 🇹🇬 👨‍👩‍👧‍👦\n');
assert.strictEqual(emoji.title, 'Été 🌞');
for (const e of ['👋🏾', '❤️', '🇹🇬', '👨‍👩‍👧‍👦']) assert.ok(emoji.body.includes(e), `emoji abîmé : ${e}`);

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
