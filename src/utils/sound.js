import { effectiveVolume } from './volumeStore';

// Click sounds respect the master volume slider. We scale a bit below the
// master so UI clicks don't overpower BGM at high volume levels.
export const playClick = () => {
  const audio = new Audio(new URL('../assets/click.mp3', import.meta.url).href);
  audio.volume = Math.min(1, effectiveVolume() * 1.25); // clicks read slightly louder
  audio.playbackRate = 1.5;
  audio.play().catch((err) => {
    if (import.meta.env.DEV) console.warn('[sound] click.mp3 playback failed:', err);
  });
};
