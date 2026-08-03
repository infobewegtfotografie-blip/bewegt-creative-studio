#!/usr/bin/env node
/*
 * Copie l'éditeur dans /admin/cms au lieu de le charger depuis un CDN :
 * la CSP peut rester en 'self' et personne d'autre ne décide de son contenu.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'node_modules', 'decap-cms', 'dist');
const OUT = path.join(__dirname, 'admin', 'cms');

if (!fs.existsSync(SRC)) {
  console.error("admin: decap-cms absent — lance 'npm install' d'abord.");
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, {
  recursive: true,
  // Ni sources maps ni build ESM : inutiles en production, ~20 Mo de moins.
  filter: (src) => !src.endsWith('.map') && !src.includes(`${path.sep}esm`),
});

const files = fs.readdirSync(OUT).length;
console.log(`admin: éditeur copié dans /admin/cms (${files} fichiers)`);
