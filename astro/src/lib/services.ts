/**
 * The 5 real BEWEGT services — used by the nav mega-menu, the homepage
 * service grid, and service landing pages. No categories are invented here:
 * this list is the exact set already present in the legacy site's nav.
 */
export interface Service {
  slug: 'photography' | 'video-production' | 'live-streaming' | 'graphic-design' | 'podcast-production';
  title: string;
  tagline: string;
  href: string;
  craftImage: string;
  craftImageSrcset: string;
  craftImageWidth: number;
  craftImageHeight: number;
}

export const SERVICES: Service[] = [
  {
    slug: 'photography',
    title: 'Photography',
    tagline: 'Portraits, weddings, events and visual stories with a cinematic eye.',
    href: '/photography.html',
    craftImage: '/img/craft-photography.webp',
    craftImageSrcset: '/img/craft-photography-240w.webp 240w, /img/craft-photography.webp 1536w',
    craftImageWidth: 1536,
    craftImageHeight: 1024,
  },
  {
    slug: 'video-production',
    title: 'Video Production',
    tagline: 'Films, documentaries, interviews and cinematic content for stories that matter.',
    href: '/video-production.html',
    craftImage: '/img/craft-video.webp',
    craftImageSrcset: '/img/craft-video-240w.webp 240w, /img/craft-video.webp 1376w',
    craftImageWidth: 1376,
    craftImageHeight: 768,
  },
  {
    slug: 'live-streaming',
    title: 'Live Streaming',
    tagline: 'Multi-camera streaming for churches, concerts, conferences and hybrid events.',
    href: '/live-streaming.html',
    craftImage: '/img/craft-live.webp',
    craftImageSrcset: '/img/craft-live-240w.webp 240w, /img/craft-live.webp 1535w',
    craftImageWidth: 1535,
    craftImageHeight: 1024,
  },
  {
    slug: 'graphic-design',
    title: 'Graphic Design',
    tagline: 'Posters, visual campaigns, brand identity and digital communication.',
    href: '/graphic-design.html',
    craftImage: '/img/craft-design.webp',
    craftImageSrcset: '/img/craft-design-240w.webp 240w, /img/craft-design.webp 1536w',
    craftImageWidth: 1536,
    craftImageHeight: 1024,
  },
  {
    slug: 'podcast-production',
    title: 'Podcast Production',
    tagline: 'Recording, editing, audio identity and podcast visuals for meaningful conversations.',
    href: '/podcast-production.html',
    craftImage: '/img/craft-podcast.webp',
    craftImageSrcset: '/img/craft-podcast-240w.webp 240w, /img/craft-podcast.webp 1672w',
    craftImageWidth: 1672,
    craftImageHeight: 941,
  },
];
