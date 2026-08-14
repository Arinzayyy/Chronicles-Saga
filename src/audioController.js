// Singleton audio controller — persists across all screen transitions.
// This is the SINGLE source of truth for background music. Previously,
// MainMenu.jsx also created its own <Audio> instance, which caused two
// copies of bgm.mp3 to play simultaneously. That has been consolidated here.
//
// Volume is always driven from utils/volumeStore.js so dragging the
// settings slider takes effect live.
import bgm from './assets/bgm.mp3';
import { effectiveVolume, subscribe } from './utils/volumeStore';

const audio = new Audio(bgm);
audio.loop   = true;
audio.volume = effectiveVolume();

let started = false;

// Any change to master volume/muted state is applied live to the BGM element.
subscribe(() => {
  audio.volume = effectiveVolume();
});

export function tryPlay() {
  if (started) return;
  // Set flag before play() resolves to prevent concurrent calls from
  // racing — each fires play() before any .then() runs otherwise.
  started = true;
  audio.play()
    .catch(() => {
      // Autoplay blocked — reset so next interaction can retry.
      started = false;
    });
}

/** Fade to silence over `ms` milliseconds, then pause. */
export function fadeOut(ms = 800) {
  if (audio.paused) return;
  const startVol = audio.volume;
  if (startVol <= 0) { audio.pause(); return; }
  const step  = startVol / (ms / 50);
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

/** Hard stop + reset (used when leaving into gameplay cleanly). */
export function stopBGM() {
  audio.pause();
  audio.currentTime = 0;
  started = false;
}

/** Expose the raw element for advanced callers (e.g. Prologue fade). */
export function getBGMElement() { return audio; }

/** Whether BGM has actually started playing (past autoplay-block). */
export function isStarted() { return started; }
