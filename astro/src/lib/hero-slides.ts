/**
 * Homepage hero slider content. Ported verbatim from index.html's 12
 * `.hero-slide` picture elements (their data-kicker, data-title, data-copy
 * and data-cta attributes) — same copy, same images, same per-language
 * text, now typed instead of inlined as HTML data attributes.
 */
export interface HeroSlide {
  id: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  /** CSS background-position equivalent, applied as --hero-position custom property. */
  position?: string;
  loading?: 'eager' | 'lazy';
  fetchpriority?: 'high' | 'auto';
  href: string;
  en: { kicker: string; title: string; copy: string; cta: string };
  fr: { kicker: string; title: string; copy: string; cta: string };
  de: { kicker: string; title: string; copy: string; cta: string };
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'showreel',
    image: '/media/brand/bewegt-motion-showreel.webp',
    imageWidth: 1280,
    imageHeight: 720,
    fetchpriority: 'high',
    href: '#contact',
    en: { kicker: 'BEWEGT — The Showreel', title: 'Stories that move.', copy: 'A creative studio connecting Germany, Europe and Africa.', cta: 'Start a Project' },
    fr: { kicker: 'BEWEGT — Le film du studio', title: 'Des histoires qui touchent.', copy: 'Un studio créatif entre l’Allemagne, l’Europe et l’Afrique.', cta: 'Démarrer un projet' },
    de: { kicker: 'BEWEGT — Der Studiofilm', title: 'Geschichten, die bewegen.', copy: 'Ein Kreativstudio zwischen Deutschland, Europa und Afrika.', cta: 'Projekt starten' },
  },
  {
    id: 'studio',
    image: '/img/hero.webp',
    imageWidth: 1376,
    imageHeight: 768,
    position: '50% 45%',
    fetchpriority: 'high',
    href: '#studio',
    en: { kicker: 'Studio', title: 'Ideas, made visible.', copy: 'Creative direction and production from concept to delivery.', cta: 'Discover the Studio' },
    fr: { kicker: 'Studio', title: 'Vos idées deviennent visibles.', copy: 'Direction créative et production, du concept à la livraison.', cta: 'Découvrir le studio' },
    de: { kicker: 'Studio', title: 'Ideen werden sichtbar.', copy: 'Kreativdirektion und Produktion von der Idee bis zur Umsetzung.', cta: 'Studio entdecken' },
  },
  {
    id: 'wedding-photography',
    image: '/portfolio-designs/43-african-wedding-gold.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    position: '50% 34%',
    loading: 'eager',
    href: '/photography.html',
    en: { kicker: 'Wedding Photography', title: 'Emotion, beautifully preserved.', copy: 'Elegant visual stories for celebrations that matter.', cta: 'Explore Photography' },
    fr: { kicker: 'Photographie de mariage', title: 'L’émotion, magnifiquement préservée.', copy: 'Des récits visuels élégants pour les moments qui comptent.', cta: 'Découvrir la photographie' },
    de: { kicker: 'Hochzeitsfotografie', title: 'Emotionen, wunderschön bewahrt.', copy: 'Elegante Bildgeschichten für besondere Momente.', cta: 'Fotografie entdecken' },
  },
  {
    id: 'portrait',
    image: '/portfolio-designs/40-portrait-woman-braids.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    position: '50% 28%',
    loading: 'lazy',
    href: '/photography.html',
    en: { kicker: 'Portrait', title: 'Every face tells a story.', copy: 'Authentic portraits with character, light and presence.', cta: 'Book a Portrait' },
    fr: { kicker: 'Portrait', title: 'Chaque visage raconte une histoire.', copy: 'Des portraits authentiques, lumineux et pleins de présence.', cta: 'Réserver un portrait' },
    de: { kicker: 'Porträt', title: 'Jedes Gesicht erzählt.', copy: 'Authentische Porträts mit Charakter, Licht und Präsenz.', cta: 'Porträt buchen' },
  },
  {
    id: 'video-production',
    image: '/portfolio-designs/30-video-production-set.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    position: '50% 48%',
    loading: 'lazy',
    href: '/video-production.html',
    en: { kicker: 'Video Production', title: 'Stories that leave no one untouched.', copy: 'Films, documentaries and interviews built around stories that matter.', cta: 'Explore Video' },
    fr: { kicker: 'Production vidéo', title: 'Des histoires qui ne laissent personne indifférent.', copy: 'Films, documentaires et interviews autour d’histoires qui comptent.', cta: 'Découvrir la vidéo' },
    de: { kicker: 'Videoproduktion', title: 'Geschichten, die niemanden unberührt lassen.', copy: 'Filme, Dokumentationen und Interviews für Geschichten, die zählen.', cta: 'Video entdecken' },
  },
  {
    id: 'live-streaming',
    image: '/portfolio-designs/45-concert-live-streaming.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    position: '50% 42%',
    loading: 'lazy',
    href: '/live-streaming.html',
    en: { kicker: 'Live Streaming', title: 'Make the moment live.', copy: 'Reliable multi-camera production for events and conferences.', cta: 'Plan a Live Stream' },
    fr: { kicker: 'Diffusion en direct', title: 'Faites vivre le moment.', copy: 'Une réalisation multicaméra fiable pour événements et conférences.', cta: 'Planifier un direct' },
    de: { kicker: 'Live Streaming', title: 'Den Moment live erleben.', copy: 'Zuverlässige Multikamera-Produktion für Events und Konferenzen.', cta: 'Live Stream planen' },
  },
  {
    id: 'podcast-production',
    image: '/portfolio-designs/31-podcast-production-studio.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    position: '50% 52%',
    loading: 'lazy',
    href: '/podcast-production.html',
    en: { kicker: 'Podcast Production', title: 'Conversations worth hearing.', copy: 'Recording, editing and a complete visual identity for your podcast.', cta: 'Create a Podcast' },
    fr: { kicker: 'Production podcast', title: 'Des conversations qui méritent d’être entendues.', copy: 'Enregistrement, montage et identité visuelle complète pour votre podcast.', cta: 'Créer un podcast' },
    de: { kicker: 'Podcast-Produktion', title: 'Gespräche, die gehört werden.', copy: 'Aufnahme, Schnitt und visuelle Identität für Ihren Podcast.', cta: 'Podcast starten' },
  },
  {
    id: 'personal-branding',
    image: '/portfolio-designs/23-corporate-portrait-woman.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    position: '50% 30%',
    loading: 'lazy',
    href: '/photography.html',
    en: { kicker: 'Personal Branding', title: 'Presence with purpose.', copy: 'Portraits that communicate confidence, identity and ambition.', cta: 'Build Your Image' },
    fr: { kicker: 'Image de marque personnelle', title: 'Une présence qui a du sens.', copy: 'Des portraits qui expriment confiance, identité et ambition.', cta: 'Construire votre image' },
    de: { kicker: 'Personal Branding', title: 'Präsenz mit Haltung.', copy: 'Porträts, die Vertrauen, Identität und Ambition zeigen.', cta: 'Image entwickeln' },
  },
  {
    id: 'documentary',
    image: '/portfolio-designs/38-mali-street-story.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    position: '50% 50%',
    loading: 'lazy',
    href: '/video-production.html',
    en: { kicker: 'Documentary', title: 'Real places. Human stories.', copy: 'A sensitive visual approach between Europe and Africa.', cta: 'See Our Films' },
    fr: { kicker: 'Documentaire', title: 'Des lieux réels. Des histoires humaines.', copy: 'Un regard visuel sensible entre l’Europe et l’Afrique.', cta: 'Voir nos films' },
    de: { kicker: 'Dokumentarfilm', title: 'Echte Orte. Menschliche Geschichten.', copy: 'Ein sensibler visueller Blick zwischen Europa und Afrika.', cta: 'Filme ansehen' },
  },
  {
    id: 'celebrations',
    image: '/portfolio-designs/26-wedding-emotion.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    position: '50% 38%',
    loading: 'lazy',
    href: '/photography.html',
    en: { kicker: 'Celebrations', title: 'The moments between moments.', copy: 'Natural, intimate photography with a cinematic finish.', cta: 'Tell Your Story' },
    fr: { kicker: 'Célébrations', title: 'Ces instants entre les instants.', copy: 'Une photographie naturelle et intime au rendu cinématographique.', cta: 'Raconter votre histoire' },
    de: { kicker: 'Feierlichkeiten', title: 'Die Momente dazwischen.', copy: 'Natürliche, intime Fotografie mit filmischer Ästhetik.', cta: 'Geschichte erzählen' },
  },
  {
    id: 'events',
    image: '/portfolio-designs/20-event-photographer-stage.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    position: '50% 44%',
    loading: 'lazy',
    href: '/event-coverage.html',
    en: { kicker: 'Events', title: 'Energy, captured live.', copy: 'Dynamic coverage for stages, brands and public events.', cta: 'Cover an Event' },
    fr: { kicker: 'Événementiel', title: 'L’énergie saisie sur le vif.', copy: 'Une couverture dynamique pour scènes, marques et événements publics.', cta: 'Couvrir un événement' },
    de: { kicker: 'Events', title: 'Energie, live eingefangen.', copy: 'Dynamische Begleitung für Bühnen, Marken und öffentliche Events.', cta: 'Event anfragen' },
  },
  {
    id: 'international-production',
    image: '/portfolio-designs/39-business-meeting-africa.webp',
    imageWidth: 1600,
    imageHeight: 1067,
    position: '50% 46%',
    loading: 'lazy',
    href: '#contact',
    en: { kicker: 'International Production', title: 'One vision. Across borders.', copy: 'Creative production for organisations working across Europe and Africa.', cta: 'Work With Us' },
    fr: { kicker: 'Production internationale', title: 'Une vision. Au-delà des frontières.', copy: 'Production créative pour les organisations actives en Europe et en Afrique.', cta: 'Travailler avec nous' },
    de: { kicker: 'Internationale Produktion', title: 'Eine Vision. Über Grenzen hinweg.', copy: 'Kreativproduktion für Organisationen in Europa und Afrika.', cta: 'Mit uns arbeiten' },
  },
];
