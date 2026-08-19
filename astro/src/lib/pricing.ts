/**
 * Pricing engine data — per-language, per-service, per-tier inclusion
 * lists. Ported verbatim from script.js:566-648 (PRICING_INCLUSIONS).
 * The legacy PRICING_DATA object (photo:{}, video:{}, ...) was dead/empty
 * in the source and is intentionally not carried over.
 */
export type ServiceKey = 'photo' | 'video' | 'live' | 'design' | 'podcast';
export type TierKey = 'basic' | 'standard' | 'premium';
export type Lang = 'en' | 'fr' | 'de';

export const PRICING_INCLUSIONS: Record<Lang, Record<ServiceKey, Record<TierKey, string[]>>> = {
  en: {
    photo: {
      basic: ['Up to 2 hours of coverage', '20 professionally edited images'],
      standard: ['Up to 5 hours of coverage', 'Two operators and 60 edited images'],
      premium: ['Full-day coverage', 'Two operators and 120 edited images'],
    },
    video: {
      basic: ['Half-day single-camera shoot', 'One edited film up to 90 seconds'],
      standard: ['Full-day two-camera production', 'Hero film and 3 social cutdowns'],
      premium: ['Multi-day crew production', 'Campaign film and 6 social cutdowns'],
    },
    live: {
      basic: ['One-camera stream up to 2 hours', 'Stream setup and event recording'],
      standard: ['Up to 3 cameras and 4 hours', 'Live switching, titles and recording'],
      premium: ['Full multi-camera event coverage', 'Redundant stream, recording and technical crew'],
    },
    design: {
      basic: ['One key visual', 'Two revisions and 2 formats'],
      standard: ['Campaign system with 4 visuals', 'Three revisions and 6 formats'],
      premium: ['Complete identity or campaign suite', 'Guidelines and production-ready files'],
    },
    podcast: {
      basic: ['One audio episode', 'Editing, mastering and delivery'],
      standard: ['One two-camera video episode', 'Audio master and 3 social clips'],
      premium: ['Three-episode production package', 'Branding, video, audio and distribution support'],
    },
  },
  fr: {
    photo: {
      basic: ["Jusqu'à 2 heures de couverture", '20 images retouchées professionnellement'],
      standard: ["Jusqu'à 5 heures de couverture", 'Deux opérateurs et 60 images retouchées'],
      premium: ["Couverture d'une journée complète", 'Deux opérateurs et 120 images retouchées'],
    },
    video: {
      basic: ['Tournage monocaméra en demi-journée', "Un film monté jusqu'à 90 secondes"],
      standard: ['Production bicaméra sur une journée', 'Film principal et 3 formats réseaux sociaux'],
      premium: ['Production en équipe sur plusieurs jours', 'Film de campagne et 6 formats réseaux sociaux'],
    },
    live: {
      basic: ["Diffusion à une caméra jusqu'à 2 heures", "Installation du stream et enregistrement de l'événement"],
      standard: ["Jusqu'à 3 caméras et 4 heures", 'Régie en direct, titrage et enregistrement'],
      premium: ["Couverture multicaméra complète de l'événement", 'Diffusion redondante, enregistrement et équipe technique'],
    },
    design: {
      basic: ['Un visuel principal', 'Deux révisions et 2 formats'],
      standard: ['Système de campagne avec 4 visuels', 'Trois révisions et 6 formats'],
      premium: ['Identité complète ou suite de campagne', 'Charte et fichiers prêts pour la production'],
    },
    podcast: {
      basic: ['Un épisode audio', 'Montage, mastering et livraison'],
      standard: ['Un épisode vidéo à deux caméras', 'Master audio et 3 extraits réseaux sociaux'],
      premium: ['Production de trois épisodes', 'Identité, vidéo, audio et accompagnement à la diffusion'],
    },
  },
  de: {
    photo: {
      basic: ['Bis zu 2 Stunden Begleitung', '20 professionell bearbeitete Bilder'],
      standard: ['Bis zu 5 Stunden Begleitung', 'Zwei Operatoren und 60 bearbeitete Bilder'],
      premium: ['Ganztägige Begleitung', 'Zwei Operatoren und 120 bearbeitete Bilder'],
    },
    video: {
      basic: ['Halbtägiger Ein-Kamera-Dreh', 'Ein geschnittener Film bis 90 Sekunden'],
      standard: ['Ganztägige Zwei-Kamera-Produktion', 'Hauptfilm und 3 Social-Media-Versionen'],
      premium: ['Mehrtagige Teamproduktion', 'Kampagnenfilm und 6 Social-Media-Versionen'],
    },
    live: {
      basic: ['Ein-Kamera-Stream bis 2 Stunden', 'Stream-Einrichtung und Event-Aufzeichnung'],
      standard: ['Bis zu 3 Kameras und 4 Stunden', 'Live-Regie, Titel und Aufzeichnung'],
      premium: ['Komplette Multikamera-Eventbegleitung', 'Redundanter Stream, Aufzeichnung und Technikteam'],
    },
    design: {
      basic: ['Ein Key Visual', 'Zwei Korrekturrunden und 2 Formate'],
      standard: ['Kampagnensystem mit 4 Visuals', 'Drei Korrekturrunden und 6 Formate'],
      premium: ['Komplette Identität oder Kampagnen-Suite', 'Guidelines und produktionsfertige Dateien'],
    },
    podcast: {
      basic: ['Eine Audio-Episode', 'Schnitt, Mastering und Lieferung'],
      standard: ['Eine Video-Episode mit zwei Kameras', 'Audio-Master und 3 Social-Media-Clips'],
      premium: ['Produktion von drei Episoden', 'Branding, Video, Audio und Distributions-Support'],
    },
  },
};

export const PRICING_QUOTE_LABEL: Record<Lang, string> = {
  en: 'On request',
  fr: 'Sur demande',
  de: 'Auf Anfrage',
};

export const PRICING_INCLUSIONS_ARIA_LABEL: Record<Lang, string> = {
  en: 'Package includes',
  fr: 'Inclus dans la formule',
  de: 'Im Paket enthalten',
};
