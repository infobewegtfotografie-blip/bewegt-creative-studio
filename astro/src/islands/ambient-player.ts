/**
 * Ambient soundscape player — direct TypeScript port of script.js:705-947.
 * Plays a per-language welcome message once per session, then loops through
 * mood tracks; remembers play state, track, volume and playback position
 * across page loads via localStorage/sessionStorage (safeStorage/safeSession).
 */
import { safeStorage, safeSession } from '../lib/storage';
import { SOUND_TRACKS, WELCOME_TRACKS } from '../lib/audio';

function currentLang(): 'en' | 'fr' | 'de' {
  const lang = document.documentElement.lang;
  return lang === 'fr' || lang === 'de' ? lang : 'en';
}

export function initAmbientPlayer(): void {
  const soundToggle = document.getElementById('soundToggle');
  const soundPrev = document.getElementById('soundPrev');
  const soundNext = document.getElementById('soundNext');
  const soundControl = document.getElementById('soundControl');
  const soundVolume = document.getElementById('soundVolume') as HTMLInputElement | null;
  const siteSound = document.getElementById('siteSound') as HTMLAudioElement | null;
  if (!siteSound) return;

  let isSoundPlaying = false;
  let isWelcomeIntro = false;
  let welcomeResumeTime = 0;
  let soundVolumeValue = Number(safeStorage.get('bewegtSoundVolume', '45')) / 100;
  let currentSoundTrack = Number(safeStorage.get('bewegtSoundTrack', '0'));
  const soundResumeIntent = safeStorage.get('bewegtSoundResume', '0') === '1';
  const savedSoundTime = Number(safeStorage.get('bewegtSoundTime', '0'));
  if (!Number.isInteger(currentSoundTrack) || currentSoundTrack < 0 || currentSoundTrack >= SOUND_TRACKS.length) {
    currentSoundTrack = 0;
  }

  if (soundPrev) soundPrev.style.opacity = '1';
  if (soundNext) soundNext.style.opacity = '1';

  function setSoundLabel(): void {
    if (!soundToggle) return;
    const labels = {
      en: { play: 'Play', pause: 'Pause', playLabel: 'Play site mood', pauseLabel: 'Pause site mood' },
      fr: { play: 'Play', pause: 'Pause', playLabel: 'Activer l’ambiance sonore', pauseLabel: 'Mettre l’ambiance sonore en pause' },
      de: { play: 'Play', pause: 'Pause', playLabel: 'Sound des Studios abspielen', pauseLabel: 'Sound des Studios pausieren' },
    };
    const label = labels[currentLang()];
    const copy = soundToggle.querySelector('.sound-copy');
    if (copy) copy.textContent = isSoundPlaying ? label.pause : label.play;
    if (soundControl) {
      soundControl.classList.toggle('is-playing', isSoundPlaying);
      SOUND_TRACKS.forEach((_, i) => soundControl.classList.toggle(`sound-dance-${i}`, i === currentSoundTrack));
    }
    soundToggle.setAttribute('aria-pressed', String(isSoundPlaying));
    soundToggle.setAttribute('aria-label', isSoundPlaying ? label.pauseLabel : label.playLabel);
    if (soundVolume) {
      const volumeLabels = { en: 'Sound volume', fr: 'Volume sonore', de: 'Lautstärke' };
      soundVolume.setAttribute('aria-label', volumeLabels[currentLang()]);
    }
    if (soundPrev && soundNext && soundControl) {
      const track = SOUND_TRACKS[currentSoundTrack] ?? SOUND_TRACKS[0];
      const skipLabels = {
        en: { previous: 'Previous track', next: 'Next track' },
        fr: { previous: 'Mélodie précédente', next: 'Mélodie suivante' },
        de: { previous: 'Vorheriger Titel', next: 'Nächster Titel' },
      };
      const skipLabel = skipLabels[currentLang()];
      soundPrev.setAttribute('aria-label', `${skipLabel.previous}: ${track.title}`);
      soundNext.setAttribute('aria-label', `${skipLabel.next}: ${track.title}`);
      soundControl.setAttribute('data-track', String(currentSoundTrack + 1));
    }
  }

  function applySoundVolume(): void {
    if (soundVolume) soundVolume.value = String(Math.round(soundVolumeValue * 100));
    siteSound!.volume = soundVolumeValue;
  }

  function stopWelcomeMessage(): void {
    isWelcomeIntro = false;
    welcomeResumeTime = 0;
  }

  function saveSoundState(shouldResume: boolean = isSoundPlaying): void {
    safeStorage.set('bewegtSoundResume', shouldResume ? '1' : '0');
    safeStorage.set('bewegtSoundTrack', String(currentSoundTrack));
    if (Number.isFinite(siteSound!.currentTime)) {
      safeStorage.set('bewegtSoundTime', String(Math.max(0, siteSound!.currentTime)));
    }
  }

  function playMusicTrack(resumeTime = 0): void {
    isWelcomeIntro = false;
    const track = SOUND_TRACKS[currentSoundTrack] ?? SOUND_TRACKS[0];
    if (!siteSound!.src.includes(track.src)) {
      siteSound!.src = track.src;
      siteSound!.load();
    }
    applySoundVolume();
    if (resumeTime > 0) {
      const restoreTime = () => {
        if (Number.isFinite(siteSound!.duration) && resumeTime < siteSound!.duration) {
          siteSound!.currentTime = resumeTime;
        }
      };
      if (siteSound!.readyState >= 1) restoreTime();
      else siteSound!.addEventListener('loadedmetadata', restoreTime, { once: true });
    }
    siteSound!
      .play()
      .then(() => {
        isSoundPlaying = true;
        saveSoundState(true);
        setSoundLabel();
      })
      .catch(() => {
        isSoundPlaying = false;
        setSoundLabel();
      });
  }

  function playWelcomeMessage(force = false): void {
    const lang = currentLang();
    const welcomeTrack = WELCOME_TRACKS[lang];
    const welcomeKey = `bewegtWelcomeHeard-${lang}`;
    if (!force && safeSession.get(welcomeKey, '0') === '1') {
      playMusicTrack();
      return;
    }

    const track = SOUND_TRACKS[currentSoundTrack] ?? SOUND_TRACKS[0];
    const wasOnMusicTrack = siteSound!.src.includes(track.src);
    welcomeResumeTime = wasOnMusicTrack && Number.isFinite(siteSound!.currentTime) ? siteSound!.currentTime : 0;
    isWelcomeIntro = true;
    isSoundPlaying = true;
    saveSoundState(false);
    setSoundLabel();
    siteSound!.src = welcomeTrack;
    siteSound!.load();
    applySoundVolume();
    siteSound!.play().catch(() => {
      safeSession.set(welcomeKey, '1');
      playMusicTrack();
    });
  }

  function setSoundTrack(index: number, shouldResume: boolean = isSoundPlaying): void {
    stopWelcomeMessage();
    currentSoundTrack = (index + SOUND_TRACKS.length) % SOUND_TRACKS.length;
    const track = SOUND_TRACKS[currentSoundTrack];
    siteSound!.src = track.src;
    siteSound!.load();
    safeStorage.set('bewegtSoundTrack', String(currentSoundTrack));
    safeStorage.set('bewegtSoundTime', '0');
    setSoundLabel();
    if (shouldResume) {
      siteSound!
        .play()
        .then(() => {
          isSoundPlaying = true;
          saveSoundState(true);
          setSoundLabel();
        })
        .catch(() => {
          isSoundPlaying = false;
          setSoundLabel();
        });
    }
  }

  function startSoundscape(): void {
    if (isSoundPlaying || !soundToggle) return;
    playWelcomeMessage();
  }

  function stopSoundscape(): void {
    if (!isSoundPlaying || !soundToggle) return;
    stopWelcomeMessage();
    siteSound!.pause();
    isSoundPlaying = false;
    saveSoundState(false);
    setSoundLabel();
  }

  if (soundToggle) {
    setSoundLabel();
    applySoundVolume();
    soundToggle.addEventListener('click', () => (isSoundPlaying ? stopSoundscape() : startSoundscape()));
  }

  soundPrev?.addEventListener('click', () => setSoundTrack(currentSoundTrack - 1));
  soundNext?.addEventListener('click', () => setSoundTrack(currentSoundTrack + 1));

  // ponytail: legacy also replayed the welcome message on language change
  // while already playing (script.js:436) — simplified to a label refresh
  // only; re-triggering the welcome audio mid-playback is a minor UX nicety,
  // add back via playWelcomeMessage(true) if it's missed.
  document.addEventListener('bewegt:languagechange', setSoundLabel);

  siteSound.loop = false;
  siteSound.addEventListener(
    'loadedmetadata',
    () => {
      if (soundResumeIntent && savedSoundTime > 0 && savedSoundTime < siteSound.duration) {
        siteSound.currentTime = savedSoundTime;
      }
    },
    { once: true },
  );
  siteSound.addEventListener('timeupdate', () => {
    if (isSoundPlaying && !isWelcomeIntro) saveSoundState(true);
  });
  siteSound.addEventListener('ended', () => {
    if (isWelcomeIntro) {
      safeSession.set(`bewegtWelcomeHeard-${currentLang()}`, '1');
      isWelcomeIntro = false;
      playMusicTrack(welcomeResumeTime);
      welcomeResumeTime = 0;
      return;
    }
    setSoundTrack(currentSoundTrack + 1, true);
  });

  window.addEventListener('beforeunload', () => saveSoundState(isSoundPlaying && !isWelcomeIntro));

  if (soundResumeIntent) {
    applySoundVolume();
    siteSound
      .play()
      .then(() => {
        isSoundPlaying = true;
        setSoundLabel();
      })
      .catch(() => {
        isSoundPlaying = false;
        setSoundLabel();
      });
  }

  if (soundVolume) {
    soundVolume.value = String(Math.round(soundVolumeValue * 100));
    soundVolume.addEventListener('input', () => {
      soundVolumeValue = Number(soundVolume.value) / 100;
      safeStorage.set('bewegtSoundVolume', String(Math.round(soundVolumeValue * 100)));
      applySoundVolume();
    });
  }
}
