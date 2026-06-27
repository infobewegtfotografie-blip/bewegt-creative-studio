// Netlify Build Plugin — met à jour automatiquement les lastmod du sitemap
// Exécuté à chaque déploiement avant la mise en ligne

const fs   = require('fs');
const path = require('path');

module.exports = {
  onPreBuild: async ({ utils }) => {
    const sitemapPath = path.join(process.cwd(), 'sitemap.xml');

    if (!fs.existsSync(sitemapPath)) {
      utils.build.failBuild('sitemap.xml introuvable');
      return;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let xml = fs.readFileSync(sitemapPath, 'utf8');

    // Remplace toutes les dates lastmod par la date du jour
    const updated = xml.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`);

    if (xml === updated) {
      console.log(`[BEWEGT] sitemap.xml — dates déjà à jour (${today})`);
    } else {
      fs.writeFileSync(sitemapPath, updated, 'utf8');
      console.log(`[BEWEGT] sitemap.xml — ${updated.match(/<lastmod>/g).length} dates mises à jour → ${today}`);
    }
  }
};
