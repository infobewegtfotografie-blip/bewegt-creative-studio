/**
 * Article-chrome strings, keyed by the ARTICLE's language (not the
 * visitor's) — a French article keeps "Par … · Lecture 7 min" even if the
 * site chrome is in German. Direct port of build-blog.js's MENTIONS
 * (lines 507-526).
 */
export interface ArticleMentions {
  par: string;
  lecture: (n: number) => string;
  sources: string;
  plusLoin: string;
  suite: string;
  serie: string;
  versLePilier: string;
  publie: string;
  auteur: string;
  temps: string;
  precedent: string;
  suivant: string;
  navigation: string;
  autour: string;
  projet: string;
  rendezVous: string;
  service: string;
  realisation: string;
  decouvrir: string;
  precedentPromo: string;
  suivantPromo: string;
}

export const MENTIONS: Record<'en' | 'fr' | 'de', ArticleMentions> = {
  fr: {
    par: 'Par', lecture: (n) => `Lecture ${n} min`, sources: 'Sources', plusLoin: 'Pour aller plus loin', suite: 'Dans le prochain article',
    serie: 'Dans cette série', versLePilier: 'Voir toute la série —', publie: 'Publié le', auteur: 'Auteur', temps: 'Lecture',
    precedent: 'Article précédent', suivant: 'Article suivant', navigation: 'Continuer la lecture', autour: 'Autour de cet article',
    projet: 'Votre prochain projet', rendezVous: 'Prenez rendez-vous avec le studio', service: 'Service BEWEGT', realisation: 'Réalisation', decouvrir: 'Découvrir BEWEGT', precedentPromo: 'Promotion précédente', suivantPromo: 'Promotion suivante',
  },
  en: {
    par: 'By', lecture: (n) => `${n} min read`, sources: 'Sources', plusLoin: 'Further reading', suite: 'In the next article',
    serie: 'In this series', versLePilier: 'See the full series —', publie: 'Published', auteur: 'Author', temps: 'Reading time',
    precedent: 'Previous article', suivant: 'Next article', navigation: 'Continue reading', autour: 'Around this article',
    projet: 'Your next project', rendezVous: 'Book a call with the studio', service: 'BEWEGT service', realisation: 'Selected work', decouvrir: 'Discover BEWEGT', precedentPromo: 'Previous promotion', suivantPromo: 'Next promotion',
  },
  de: {
    par: 'Von', lecture: (n) => `${n} Min. Lesezeit`, sources: 'Quellen', plusLoin: 'Zum Weiterlesen', suite: 'Im nächsten Beitrag',
    serie: 'In dieser Serie', versLePilier: 'Zur ganzen Serie —', publie: 'Veröffentlicht', auteur: 'Autor', temps: 'Lesezeit',
    precedent: 'Vorheriger Artikel', suivant: 'Nächster Artikel', navigation: 'Weiterlesen', autour: 'Rund um diesen Artikel',
    projet: 'Ihr nächstes Projekt', rendezVous: 'Termin mit dem Studio buchen', service: 'BEWEGT Leistung', realisation: 'Referenzprojekt', decouvrir: 'BEWEGT entdecken', precedentPromo: 'Vorherige Empfehlung', suivantPromo: 'Nächste Empfehlung',
  },
};

/** Cross-promo rail shown beside every article (build-blog.js:577-583). */
export function getPromotions(mentions: ArticleMentions) {
  return [
    { label: mentions.projet, title: mentions.rendezVous, url: '/index.html#contact', image: '/img/behind.webp' },
    { label: mentions.service, title: 'Photography', url: '/photography.html', image: '/img/craft-photography.webp' },
    { label: mentions.service, title: 'Video Production', url: '/video-production.html', image: '/img/craft-video.webp' },
    { label: mentions.service, title: 'Graphic Design', url: '/graphic-design.html', image: '/img/craft-design.webp' },
    { label: mentions.realisation, title: 'Un apôtre du développement', url: '/un-apotre-du-developpement.html', image: '/img/blog/chancy-brown-augustus-washington-liberia-1856.jpg' },
  ];
}

/** Journal ticker items shown above every article (build-blog.js:602-617). */
export function getTickerItems(mentions: ArticleMentions) {
  return [
    { label: 'Photography', url: '/photography.html' },
    { label: 'Video Production', url: '/video-production.html' },
    { label: 'Live Streaming', url: '/live-streaming.html' },
    { label: 'Graphic Design', url: '/graphic-design.html' },
    { label: 'Podcast Production', url: '/podcast-production.html' },
    { label: mentions.realisation, url: '/un-apotre-du-developpement.html' },
    { label: mentions.rendezVous, url: '/index.html#contact' },
  ];
}
