export const playClick = () => {
  const audio = new Audio(new URL('../assets/click.mp3', import.meta.url).href);
  audio.volume = 0.5;
  audio.playbackRate = 1.5;
  audio.play().catch(() => {});
};
