// Singleton audio controller — persists across all screen transitions.
// Import and call tryPlay() on first user interaction; stop() when music ends.
import bgm from './assets/bgm.mp3';

const audio = new Audio(bgm);
audio.loop   = true;
audio.volume = 0.4;

let started = false;

export function tryPlay() {
  if (started) return;
  audio.play()
    .then(() => { started = true; })
    .catch(() => {/* autoplay blocked — will retry on next interaction */});
}

/** Fade to silence over `ms` milliseconds, then pause. */
export function fadeOut(ms = 800) {
  if (audio.paused) return;
  const step  = audio.volume / (ms / 50);
  const timer = setInterval(() => {
    if (audio.volume > step) {
      audio.volume -= step;
    } else {
      audio.volume = 0;
      audio.pause();
      clearInterval(timer);
    }
  }, 50);
}

export function setMuted(val) { audio.muted = val; }
export function getMuted()    { return audio.muted; }
