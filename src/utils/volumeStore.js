// ─── Central master volume store ──────────────────────────────────────────────
// Persists a single "master volume" (0..1) + muted state to localStorage and
// lets any audio consumer (BGM, click SFX) subscribe to changes so they can
// update their live <Audio> instances immediately when the user drags a slider.
//
// Design: tiny observable — no React dependency, usable from any .js file.

const STORAGE_KEY = 'cs_volume_v1';
const DEFAULT_VOLUME = 0.4;

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { volume: DEFAULT_VOLUME, muted: false };
    const parsed = JSON.parse(raw);
    const v = typeof parsed.volume === 'number' ? parsed.volume : DEFAULT_VOLUME;
    const m = typeof parsed.muted  === 'boolean' ? parsed.muted  : false;
    return {
      volume: Math.max(0, Math.min(1, v)),
      muted:  m,
    };
  } catch {
    return { volume: DEFAULT_VOLUME, muted: false };
  }
}

function writeStored(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage can fail in private mode / quota — volume still works in-session
  }
}

let state = readStored();
const listeners = new Set();

function emit() {
  listeners.forEach(fn => {
    try { fn(state); } catch { /* a bad listener shouldn't break others */ }
  });
}

export function getVolume() { return state.volume; }
export function getMuted()  { return state.muted;  }

// effectiveVolume: what actually reaches the Audio element
export function effectiveVolume() {
  return state.muted ? 0 : state.volume;
}

export function setVolume(v) {
  const clamped = Math.max(0, Math.min(1, Number(v) || 0));
  if (clamped === state.volume) return;
  state = { ...state, volume: clamped };
  writeStored(state);
  emit();
}

export function setMuted(m) {
  const bool = Boolean(m);
  if (bool === state.muted) return;
  state = { ...state, muted: bool };
  writeStored(state);
  emit();
}

export function toggleMuted() { setMuted(!state.muted); }

// Subscribe to changes. Returns an unsubscribe fn.
// The listener is called immediately once so the subscriber can initialize.
export function subscribe(fn) {
  listeners.add(fn);
  try { fn(state); } catch { /* ignore */ }
  return () => listeners.delete(fn);
}
