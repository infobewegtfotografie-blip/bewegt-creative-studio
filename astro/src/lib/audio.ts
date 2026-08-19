/**
 * Ambient soundscape track list + welcome-message paths. Ported verbatim
 * from script.js:711-723.
 */
export interface SoundTrack {
  src: string;
  title: string;
}

export const SOUND_TRACKS: SoundTrack[] = [
  { src: '/audio/relaxing1.mp3', title: 'BEWEGT Mood 01' },
  { src: '/audio/relaxing2.mp3', title: 'BEWEGT Mood 02' },
  { src: '/audio/relaxing3.mp3', title: 'BEWEGT Mood 03' },
  { src: '/audio/the-last-train-to-nowhere.mp3', title: 'The Last Train to Nowhere' },
  { src: '/audio/the-light-of-the-world.mp3', title: 'The Light of the World' },
  { src: '/audio/the-light-of-the-world-alt.mp3', title: 'The Light of the World II' },
];

export const WELCOME_TRACKS: Record<'en' | 'fr' | 'de', string> = {
  en: '/audio/welcome-en.m4a',
  fr: '/audio/welcome-fr.m4a',
  de: '/audio/welcome-de.m4a',
};
