/**
 * Centralized SEO data — site-wide JSON-LD nodes ported verbatim from
 * index.html:34-192, plus the typed props every page passes to SEO.astro.
 * Keeping Organization/ProfessionalService/WebSite as static objects here
 * (instead of duplicating them per page) is what "zero SEO regression"
 * requires: one source of truth, reused by every page's @graph.
 */

export const SITE_URL = 'https://bewegtcreative.com';

export interface SeoProps {
  title: string;
  description: string;
  /** Absolute-from-root path, e.g. "/photography.html". Used to build the canonical URL. */
  path: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  lang?: 'en' | 'fr' | 'de';
  /** Set to false on pages that must not be indexed (e.g. thank-you, admin). */
  index?: boolean;
}

export const ORGANIZATION_NODE = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'BEWEGT CREATIVE STUDIO',
  alternateName: ['BEWEGT', 'BEWEGT Creative', 'BEWEGT Studio'],
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/img/brand/bewegt-logo-full-black.png`,
    width: 956,
    height: 854,
  },
  email: 'contact@bewegtcreative.com',
  slogan: 'Visual experiences that move people.',
  areaServed: [
    { '@type': 'Country', name: 'Germany' },
    { '@type': 'Place', name: 'Europe' },
    { '@type': 'Place', name: 'Africa' },
    { '@type': 'Country', name: 'Togo' },
  ],
  sameAs: ['https://www.youtube.com/@bewegtcreativestudio'],
} as const;

export const PROFESSIONAL_SERVICE_NODE = {
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#professionalservice`,
  name: 'BEWEGT CREATIVE STUDIO',
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/img/og-image.jpg`,
  description:
    'International creative studio for photography, video production, live streaming, graphic design and podcast production between Germany, Europe and Africa.',
  email: 'contact@bewegtcreative.com',
  parentOrganization: { '@id': `${SITE_URL}/#organization` },
  areaServed: ['Germany', 'Europe', 'Africa', 'Togo'],
  availableLanguage: ['English', 'French', 'German'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Creative production services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Photography', description: 'Portraits, weddings, events, brands and personal branding photography with a cinematic eye.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Video Production', description: 'Films, documentaries, interviews and cinematic content for stories that matter.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Live Streaming', description: 'Multi-camera live streaming for churches, concerts, conferences and hybrid events.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Graphic Design', description: 'Posters, visual campaigns, brand identity and digital communication.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Podcast Production', description: 'Recording, editing, audio identity and podcast visuals for meaningful conversations.' } },
    ],
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contact@bewegtcreative.com',
    availableLanguage: ['English', 'French', 'German'],
  },
} as const;

export const WEBSITE_NODE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: 'BEWEGT CREATIVE STUDIO',
  alternateName: ['BEWEGT', 'BEWEGT Creative', 'BEWEGT Studio'],
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: ['en', 'fr', 'de'],
} as const;

/** Builds the per-page WebPage node + the shared @graph, matching index.html's JSON-LD shape. */
export function buildPageJsonLd(props: SeoProps) {
  const url = `${SITE_URL}${props.path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ORGANIZATION_NODE,
      PROFESSIONAL_SERVICE_NODE,
      WEBSITE_NODE,
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: props.title,
        description: props.description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#professionalservice` },
        inLanguage: props.lang ?? 'en',
      },
    ],
  };
}
