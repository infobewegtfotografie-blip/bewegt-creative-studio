/**
 * Per-service landing page content — SEO meta, hero copy, the 6 offer
 * items, pricing-engine key, and this service's portfolio picks. Ported
 * verbatim from the 5 legacy *.html service pages so photography.html,
 * video-production.html etc. become one typed data source consumed by a
 * single ServiceLayout, instead of 5 near-duplicate HTML files.
 */
import type { PortfolioItem } from './portfolio';
import type { ServiceKey } from './pricing';

export interface ServiceOfferItem {
  title: string;
  desc: string;
}

export interface ServiceContent {
  slug: 'photography' | 'video-production' | 'live-streaming' | 'graphic-design' | 'podcast-production';
  pricingKey: ServiceKey;
  title: string;
  /** Only "video-production" splits its H1 into two stacked lines in the legacy CSS (.video-production-title). */
  titleLines?: [string, string];
  tagline: string;
  metaDescription: string;
  metaKeywords: string;
  heroImage: string;
  heroImageWidth: number;
  heroImageHeight: number;
  intro: string;
  items: ServiceOfferItem[];
  workHeading: string;
  workItems: PortfolioItem[];
  ctaHeading: string;
  whatsappServiceLabel: string;
}

const WORK_ITEMS: Record<ServiceContent['slug'], PortfolioItem[]> = {
  photography: [
    { full: '/portfolio-designs/43-african-wedding-gold.webp', caption: 'African Wedding', src: '/portfolio-designs/43-african-wedding-gold.webp', srcset: '/portfolio-designs/43-african-wedding-gold-480w.webp 480w, /portfolio-designs/43-african-wedding-gold-800w.webp 800w, /portfolio-designs/43-african-wedding-gold.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 800, alt: 'African Wedding' },
    { full: '/portfolio-designs/44-african-wedding-ceremony.webp', caption: 'Wedding Ceremony', src: '/portfolio-designs/44-african-wedding-ceremony.webp', srcset: '/portfolio-designs/44-african-wedding-ceremony-480w.webp 480w, /portfolio-designs/44-african-wedding-ceremony-800w.webp 800w, /portfolio-designs/44-african-wedding-ceremony.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 800, alt: 'Wedding Ceremony' },
    { full: '/portfolio-designs/42-wedding-gold-detail.webp', caption: 'Wedding Detail', src: '/portfolio-designs/42-wedding-gold-detail.webp', srcset: '/portfolio-designs/42-wedding-gold-detail-480w.webp 480w, /portfolio-designs/42-wedding-gold-detail-800w.webp 800w, /portfolio-designs/42-wedding-gold-detail.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 800, alt: 'Wedding Detail' },
    { full: '/portfolio-designs/40-portrait-woman-braids.webp', caption: 'Portrait', src: '/portfolio-designs/40-portrait-woman-braids.webp', srcset: '/portfolio-designs/40-portrait-woman-braids-480w.webp 480w, /portfolio-designs/40-portrait-woman-braids-800w.webp 800w, /portfolio-designs/40-portrait-woman-braids.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 1200, alt: 'Portrait' },
    { full: '/portfolio-designs/41-portrait-man-premium.webp', caption: 'Premium Portrait', src: '/portfolio-designs/41-portrait-man-premium.webp', srcset: '/portfolio-designs/41-portrait-man-premium-480w.webp 480w, /portfolio-designs/41-portrait-man-premium-800w.webp 800w, /portfolio-designs/41-portrait-man-premium.webp 960w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 960, height: 1200, alt: 'Premium Portrait' },
    { full: '/portfolio-designs/37-marche-togo.webp', caption: 'Africa Story', src: '/portfolio-designs/37-marche-togo.webp', srcset: '/portfolio-designs/37-marche-togo-480w.webp 480w, /portfolio-designs/37-marche-togo-800w.webp 800w, /portfolio-designs/37-marche-togo.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 800, alt: 'Africa Story' },
  ],
  'video-production': [
    { full: '/portfolio-designs/30-video-production-set.webp', caption: 'Video Production Set', src: '/portfolio-designs/30-video-production-set.webp', srcset: '/portfolio-designs/30-video-production-set-480w.webp 480w, /portfolio-designs/30-video-production-set-800w.webp 800w, /portfolio-designs/30-video-production-set.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 801, alt: 'Video Production Set' },
    { full: '/portfolio-designs/36-production-equipment-grid.webp', caption: 'Production Workflow', src: '/portfolio-designs/36-production-equipment-grid.webp', srcset: '/portfolio-designs/36-production-equipment-grid-480w.webp 480w, /portfolio-designs/36-production-equipment-grid-800w.webp 800w, /portfolio-designs/36-production-equipment-grid.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 960, alt: 'Production Workflow' },
    { full: '/portfolio-designs/38-mali-street-story.webp', caption: 'Documentary Story', src: '/portfolio-designs/38-mali-street-story.webp', srcset: '/portfolio-designs/38-mali-street-story-480w.webp 480w, /portfolio-designs/38-mali-street-story-800w.webp 800w, /portfolio-designs/38-mali-street-story.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 800, alt: 'Documentary Story' },
    { full: '/portfolio-designs/37-marche-togo.webp', caption: 'Cultural Documentary', src: '/portfolio-designs/37-marche-togo.webp', srcset: '/portfolio-designs/37-marche-togo-480w.webp 480w, /portfolio-designs/37-marche-togo-800w.webp 800w, /portfolio-designs/37-marche-togo.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 800, alt: 'Cultural Documentary' },
    { full: '/portfolio-designs/39-business-meeting-africa.webp', caption: 'Corporate Film', src: '/portfolio-designs/39-business-meeting-africa.webp', srcset: '/portfolio-designs/39-business-meeting-africa-480w.webp 480w, /portfolio-designs/39-business-meeting-africa-800w.webp 800w, /portfolio-designs/39-business-meeting-africa.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 675, alt: 'Corporate Film' },
    { full: '/portfolio-designs/20-event-photographer-stage.webp', caption: 'Event Film', src: '/portfolio-designs/20-event-photographer-stage.webp', srcset: '/portfolio-designs/20-event-photographer-stage-480w.webp 480w, /portfolio-designs/20-event-photographer-stage-800w.webp 800w, /portfolio-designs/20-event-photographer-stage.webp 1024w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1024, height: 1024, alt: 'Event Film' },
  ],
  'live-streaming': [
    { full: '/portfolio-designs/45-concert-live-streaming.webp', caption: 'Concert Streaming', src: '/portfolio-designs/45-concert-live-streaming.webp', srcset: '/portfolio-designs/45-concert-live-streaming-480w.webp 480w, /portfolio-designs/45-concert-live-streaming-800w.webp 800w, /portfolio-designs/45-concert-live-streaming.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 800, alt: 'Concert Streaming' },
    { full: '/portfolio-designs/36-production-equipment-grid.webp', caption: 'Multicamera Control', src: '/portfolio-designs/36-production-equipment-grid.webp', srcset: '/portfolio-designs/36-production-equipment-grid-480w.webp 480w, /portfolio-designs/36-production-equipment-grid-800w.webp 800w, /portfolio-designs/36-production-equipment-grid.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 960, alt: 'Multicamera Control' },
    { full: '/portfolio-designs/20-event-photographer-stage.webp', caption: 'Live Event', src: '/portfolio-designs/20-event-photographer-stage.webp', srcset: '/portfolio-designs/20-event-photographer-stage-480w.webp 480w, /portfolio-designs/20-event-photographer-stage-800w.webp 800w, /portfolio-designs/20-event-photographer-stage.webp 1024w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1024, height: 1024, alt: 'Live Event' },
    { full: '/portfolio-designs/29-wedding-ceremony.webp', caption: 'Ceremony Coverage', src: '/portfolio-designs/29-wedding-ceremony.webp', srcset: '/portfolio-designs/29-wedding-ceremony-480w.webp 480w, /portfolio-designs/29-wedding-ceremony-800w.webp 800w, /portfolio-designs/29-wedding-ceremony.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 800, alt: 'Ceremony Coverage' },
    { full: '/portfolio-designs/44-african-wedding-ceremony.webp', caption: 'Hybrid Ceremony', src: '/portfolio-designs/44-african-wedding-ceremony.webp', srcset: '/portfolio-designs/44-african-wedding-ceremony-480w.webp 480w, /portfolio-designs/44-african-wedding-ceremony-800w.webp 800w, /portfolio-designs/44-african-wedding-ceremony.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 800, alt: 'Hybrid Ceremony' },
    { full: '/portfolio-designs/30-video-production-set.webp', caption: 'Broadcast Setup', src: '/portfolio-designs/30-video-production-set.webp', srcset: '/portfolio-designs/30-video-production-set-480w.webp 480w, /portfolio-designs/30-video-production-set-800w.webp 800w, /portfolio-designs/30-video-production-set.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 801, alt: 'Broadcast Setup' },
  ],
  'graphic-design': [
    { full: '/portfolio-designs/01-blessanniv12.webp', caption: 'Birthday Visual', src: '/portfolio-designs/01-blessanniv12.webp', srcset: '/portfolio-designs/01-blessanniv12-480w.webp 480w, /portfolio-designs/01-blessanniv12-800w.webp 800w, /portfolio-designs/01-blessanniv12.webp 959w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 959, height: 1200, alt: 'Birthday Visual' },
    { full: '/portfolio-designs/02-blessanniv14.webp', caption: 'Birthday Campaign', src: '/portfolio-designs/02-blessanniv14.webp', srcset: '/portfolio-designs/02-blessanniv14-480w.webp 480w, /portfolio-designs/02-blessanniv14-800w.webp 800w, /portfolio-designs/02-blessanniv14.webp 959w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 959, height: 1200, alt: 'Birthday Campaign' },
    { full: '/portfolio-designs/03-chatgpt-image-12-juin-2026-14-08-03.webp', caption: 'Creative Poster', src: '/portfolio-designs/03-chatgpt-image-12-juin-2026-14-08-03.webp', srcset: '/portfolio-designs/03-chatgpt-image-12-juin-2026-14-08-03-480w.webp 480w, /portfolio-designs/03-chatgpt-image-12-juin-2026-14-08-03-800w.webp 800w, /portfolio-designs/03-chatgpt-image-12-juin-2026-14-08-03.webp 1031w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1031, height: 1200, alt: 'Creative Poster' },
    { full: '/portfolio-designs/04-chatgpt-image-14-juin-2026-18-46-49.webp', caption: 'Event Flyer', src: '/portfolio-designs/04-chatgpt-image-14-juin-2026-18-46-49.webp', srcset: '/portfolio-designs/04-chatgpt-image-14-juin-2026-18-46-49-480w.webp 480w, /portfolio-designs/04-chatgpt-image-14-juin-2026-18-46-49-800w.webp 800w, /portfolio-designs/04-chatgpt-image-14-juin-2026-18-46-49.webp 900w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 900, height: 1200, alt: 'Event Flyer' },
    { full: '/portfolio-designs/05-chatgpt-image-14-juin-2026-19-04-40.webp', caption: 'Event Campaign', src: '/portfolio-designs/05-chatgpt-image-14-juin-2026-19-04-40.webp', srcset: '/portfolio-designs/05-chatgpt-image-14-juin-2026-19-04-40-480w.webp 480w, /portfolio-designs/05-chatgpt-image-14-juin-2026-19-04-40-800w.webp 800w, /portfolio-designs/05-chatgpt-image-14-juin-2026-19-04-40.webp 960w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 960, height: 1200, alt: 'Event Campaign' },
    { full: '/portfolio-designs/06-chatgpt-image-15-juin-2026-12-11-33.webp', caption: 'Creative Portrait', src: '/portfolio-designs/06-chatgpt-image-15-juin-2026-12-11-33.webp', srcset: '/portfolio-designs/06-chatgpt-image-15-juin-2026-12-11-33-480w.webp 480w, /portfolio-designs/06-chatgpt-image-15-juin-2026-12-11-33-800w.webp 800w, /portfolio-designs/06-chatgpt-image-15-juin-2026-12-11-33.webp 963w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 963, height: 1200, alt: 'Creative Portrait' },
    { full: '/portfolio-designs/07-chatgpt-image-16-juin-2026-23-43-15.webp', caption: 'Poster Design', src: '/portfolio-designs/07-chatgpt-image-16-juin-2026-23-43-15.webp', srcset: '/portfolio-designs/07-chatgpt-image-16-juin-2026-23-43-15-480w.webp 480w, /portfolio-designs/07-chatgpt-image-16-juin-2026-23-43-15-800w.webp 800w, /portfolio-designs/07-chatgpt-image-16-juin-2026-23-43-15.webp 960w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 960, height: 1200, alt: 'Poster Design' },
    { full: '/portfolio-designs/08-emefa2.webp', caption: 'Portrait Visual', src: '/portfolio-designs/08-emefa2.webp', srcset: '/portfolio-designs/08-emefa2-480w.webp 480w, /portfolio-designs/08-emefa2-800w.webp 800w, /portfolio-designs/08-emefa2.webp 959w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 959, height: 1200, alt: 'Portrait Visual' },
    { full: '/portfolio-designs/09-mg2.webp', caption: 'Masterclass Visual', src: '/portfolio-designs/09-mg2.webp', srcset: '/portfolio-designs/09-mg2-480w.webp 480w, /portfolio-designs/09-mg2-800w.webp 800w, /portfolio-designs/09-mg2.webp 959w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 959, height: 1200, alt: 'Masterclass Visual' },
    { full: '/portfolio-designs/10-miadenou9.webp', caption: 'Community Campaign', src: '/portfolio-designs/10-miadenou9.webp', srcset: '/portfolio-designs/10-miadenou9-480w.webp 480w, /portfolio-designs/10-miadenou9-800w.webp 800w, /portfolio-designs/10-miadenou9.webp 848w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 848, height: 1200, alt: 'Community Campaign' },
    { full: '/portfolio-designs/11-rom04.webp', caption: 'Storytelling Visual', src: '/portfolio-designs/11-rom04.webp', srcset: '/portfolio-designs/11-rom04-480w.webp 480w, /portfolio-designs/11-rom04-800w.webp 800w, /portfolio-designs/11-rom04.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 1200, alt: 'Storytelling Visual' },
    { full: '/portfolio-designs/12-rome-o2.webp', caption: 'Premium Portrait', src: '/portfolio-designs/12-rome-o2.webp', srcset: '/portfolio-designs/12-rome-o2-480w.webp 480w, /portfolio-designs/12-rome-o2-800w.webp 800w, /portfolio-designs/12-rome-o2.webp 959w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 959, height: 1200, alt: 'Premium Portrait' },
    { full: '/portfolio-designs/13-sans-titre.webp', caption: 'Creative Visual', src: '/portfolio-designs/13-sans-titre.webp', srcset: '/portfolio-designs/13-sans-titre-480w.webp 480w, /portfolio-designs/13-sans-titre-800w.webp 800w, /portfolio-designs/13-sans-titre.webp 959w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 959, height: 1200, alt: 'Creative Visual' },
    { full: '/portfolio-designs/14-vict2.webp', caption: 'Celebration Visual', src: '/portfolio-designs/14-vict2.webp', srcset: '/portfolio-designs/14-vict2-480w.webp 480w, /portfolio-designs/14-vict2-800w.webp 800w, /portfolio-designs/14-vict2.webp 959w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 959, height: 1200, alt: 'Celebration Visual' },
    { full: '/portfolio-designs/15-vict3.webp', caption: 'Premium Birthday', src: '/portfolio-designs/15-vict3.webp', srcset: '/portfolio-designs/15-vict3-480w.webp 480w, /portfolio-designs/15-vict3-800w.webp 800w, /portfolio-designs/15-vict3.webp 959w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 959, height: 1200, alt: 'Premium Birthday' },
    { full: '/portfolio-designs/32-graphic-design-blue-yellow.webp', caption: 'Graphic Design System', src: '/portfolio-designs/32-graphic-design-blue-yellow.webp', srcset: '/portfolio-designs/32-graphic-design-blue-yellow-480w.webp 480w, /portfolio-designs/32-graphic-design-blue-yellow-800w.webp 800w, /portfolio-designs/32-graphic-design-blue-yellow.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 675, alt: 'Graphic Design System' },
    { full: '/portfolio-designs/33-social-template-gradient.webp', caption: 'Social Template', src: '/portfolio-designs/33-social-template-gradient.webp', srcset: '/portfolio-designs/33-social-template-gradient-480w.webp 480w, /portfolio-designs/33-social-template-gradient-800w.webp 800w, /portfolio-designs/33-social-template-gradient.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 1200, alt: 'Social Template' },
    { full: '/portfolio-designs/34-event-poster-mockup.webp', caption: 'Event Poster', src: '/portfolio-designs/34-event-poster-mockup.webp', srcset: '/portfolio-designs/34-event-poster-mockup-480w.webp 480w, /portfolio-designs/34-event-poster-mockup-800w.webp 800w, /portfolio-designs/34-event-poster-mockup.webp 848w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 848, height: 1200, alt: 'Event Poster' },
  ],
  'podcast-production': [
    { full: '/portfolio-designs/35-podcast-roundtable.webp', caption: 'Podcast Roundtable', src: '/portfolio-designs/35-podcast-roundtable.webp', srcset: '/portfolio-designs/35-podcast-roundtable-480w.webp 480w, /portfolio-designs/35-podcast-roundtable-800w.webp 800w, /portfolio-designs/35-podcast-roundtable.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 670, alt: 'Podcast Roundtable' },
    { full: '/portfolio-designs/36-production-equipment-grid.webp', caption: 'Studio Setup', src: '/portfolio-designs/36-production-equipment-grid.webp', srcset: '/portfolio-designs/36-production-equipment-grid-480w.webp 480w, /portfolio-designs/36-production-equipment-grid-800w.webp 800w, /portfolio-designs/36-production-equipment-grid.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 960, alt: 'Studio Setup' },
    { full: '/portfolio-designs/39-business-meeting-africa.webp', caption: 'Interview Format', src: '/portfolio-designs/39-business-meeting-africa.webp', srcset: '/portfolio-designs/39-business-meeting-africa-480w.webp 480w, /portfolio-designs/39-business-meeting-africa-800w.webp 800w, /portfolio-designs/39-business-meeting-africa.webp 1200w', sizes: '(max-width: 780px) 90vw, (max-width: 1100px) 46vw, 30vw', width: 1200, height: 675, alt: 'Interview Format' },
  ],
};

export const SERVICE_CONTENT: Record<ServiceContent['slug'], ServiceContent> = {
  photography: {
    slug: 'photography',
    pricingKey: 'photo',
    title: 'Photography',
    tagline: 'Portraits, weddings, events and visual stories with a cinematic eye.',
    metaDescription: 'BEWEGT creates photography for people, brands, churches and communities who want images that feel honest, elegant and timeless.',
    metaKeywords: 'photography, portrait photography, wedding photography, event photography, church photography, corporate photography, personal branding',
    heroImage: '/img/craft-photography',
    heroImageWidth: 1536,
    heroImageHeight: 1024,
    intro: 'BEWEGT creates photography for people, brands, churches and communities who want images that feel honest, elegant and timeless.',
    items: [
      { title: 'Portraits', desc: 'Professional portrait photography for meaningful visual communication.' },
      { title: 'Weddings', desc: 'Professional wedding photography for meaningful visual communication.' },
      { title: 'Events', desc: 'Professional event photography for meaningful visual communication.' },
      { title: 'Churches', desc: 'Professional church photography for meaningful visual communication.' },
      { title: 'Corporate Photography', desc: 'Professional corporate photography for meaningful visual communication.' },
      { title: 'Personal Branding', desc: 'Professional personal branding for meaningful visual communication.' },
    ],
    workHeading: 'Selected photography',
    workItems: WORK_ITEMS.photography,
    ctaHeading: 'Start a Photography Project',
    whatsappServiceLabel: 'Photography',
  },
  'video-production': {
    slug: 'video-production',
    pricingKey: 'video',
    title: 'Video Production',
    titleLines: ['Video-', 'Production'],
    tagline: 'Films, documentaries, interviews and cinematic content for stories that matter.',
    metaDescription: 'From concept to final edit, BEWEGT produces videos with structure, emotion and a premium visual language.',
    metaKeywords: 'video production, wedding films, documentaries, music videos, corporate videos, interviews, social media content',
    heroImage: '/img/craft-video',
    heroImageWidth: 1376,
    heroImageHeight: 768,
    intro: 'From concept to final edit, BEWEGT produces videos with structure, emotion and a premium visual language.',
    items: [
      { title: 'Wedding Films', desc: 'Professional wedding films for meaningful visual communication.' },
      { title: 'Documentaries', desc: 'Professional documentary films for meaningful visual communication.' },
      { title: 'Music Videos', desc: 'Professional music videos for meaningful visual communication.' },
      { title: 'Corporate Videos', desc: 'Professional corporate videos for meaningful visual communication.' },
      { title: 'Interviews', desc: 'Professional interviews for meaningful visual communication.' },
      { title: 'Social Media Content', desc: 'Professional social media content for meaningful visual communication.' },
    ],
    workHeading: 'Selected video work',
    workItems: WORK_ITEMS['video-production'],
    ctaHeading: 'Start a Video Project',
    whatsappServiceLabel: 'Video Production',
  },
  'live-streaming': {
    slug: 'live-streaming',
    pricingKey: 'live',
    title: 'Live Streaming',
    tagline: 'Multi-camera streaming for churches, concerts, conferences and hybrid events.',
    metaDescription: 'BEWEGT supports live moments with reliable production workflows, clear sound and professional switching.',
    metaKeywords: 'live streaming, church streaming, conference streaming, concert streaming, hybrid events, multi-camera production',
    heroImage: '/img/craft-live',
    heroImageWidth: 1535,
    heroImageHeight: 1024,
    intro: 'BEWEGT supports live moments with reliable production workflows, clear sound and professional switching.',
    items: [
      { title: 'Church Live Streaming', desc: 'Professional church live streaming for meaningful visual communication.' },
      { title: 'Conference Streaming', desc: 'Professional conference streaming for meaningful visual communication.' },
      { title: 'Concert Streaming', desc: 'Professional concert streaming for meaningful visual communication.' },
      { title: 'Hybrid Events', desc: 'Professional hybrid events for meaningful visual communication.' },
      { title: 'Multi-Camera Production', desc: 'Professional multi-camera production for meaningful visual communication.' },
      { title: 'Broadcast Support', desc: 'Professional broadcast support for meaningful visual communication.' },
    ],
    workHeading: 'Selected live streaming work',
    workItems: WORK_ITEMS['live-streaming'],
    ctaHeading: 'Plan a Live Stream',
    whatsappServiceLabel: 'Live Streaming',
  },
  'graphic-design': {
    slug: 'graphic-design',
    pricingKey: 'design',
    title: 'Graphic Design',
    tagline: 'Posters, visual campaigns, brand identity and digital communication.',
    metaDescription: 'BEWEGT designs visual materials that help events, artists, ministries and brands communicate with impact.',
    metaKeywords: 'graphic design, posters, brand identity, social media design, campaigns, business materials',
    heroImage: '/img/craft-design',
    heroImageWidth: 1536,
    heroImageHeight: 1024,
    intro: 'BEWEGT designs visual materials that help events, artists, ministries and brands communicate with impact.',
    items: [
      { title: 'Posters', desc: 'Professional posters & flyers for meaningful visual communication.' },
      { title: 'Birthday Designs', desc: 'Professional birthday designs for meaningful visual communication.' },
      { title: 'Campaigns', desc: 'Professional event campaigns for meaningful visual communication.' },
      { title: 'Brand Identity', desc: 'Professional brand identity for meaningful visual communication.' },
      { title: 'Social Media', desc: 'Professional social media visuals for meaningful visual communication.' },
      { title: 'Business Materials', desc: 'Professional business materials for meaningful visual communication.' },
    ],
    workHeading: 'Selected design work',
    workItems: WORK_ITEMS['graphic-design'],
    ctaHeading: 'Start a Design Project',
    whatsappServiceLabel: 'Graphic Design',
  },
  'podcast-production': {
    slug: 'podcast-production',
    pricingKey: 'podcast',
    title: 'Podcast Production',
    tagline: 'Recording, editing, audio identity and podcast visuals for meaningful conversations.',
    metaDescription: 'BEWEGT helps creators, churches, businesses and communities produce podcasts with clarity, warmth and structure.',
    metaKeywords: 'podcast production, podcast recording, podcast editing, audio branding, voice recording, podcast distribution',
    heroImage: '/img/craft-podcast',
    heroImageWidth: 1672,
    heroImageHeight: 941,
    intro: 'BEWEGT helps creators, churches, businesses and communities produce podcasts with clarity, warmth and structure.',
    items: [
      { title: 'Recording', desc: 'Professional podcast recording for meaningful visual communication.' },
      { title: 'Editing', desc: 'Professional podcast editing for meaningful visual communication.' },
      { title: 'Audio Branding', desc: 'Professional audio branding for meaningful visual communication.' },
      { title: 'Voice Recording', desc: 'Professional voice recording for meaningful visual communication.' },
      { title: 'Visual Podcast Setup', desc: 'Professional visual podcast setup for meaningful visual communication.' },
      { title: 'Distribution', desc: 'Professional distribution support for meaningful visual communication.' },
    ],
    workHeading: 'Selected podcast work',
    workItems: WORK_ITEMS['podcast-production'],
    ctaHeading: 'Start a Podcast Project',
    whatsappServiceLabel: 'Podcast Production',
  },
};
