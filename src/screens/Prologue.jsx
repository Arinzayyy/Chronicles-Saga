import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { playClick } from '../utils/sound';
import { fadeOut as fadeOutBGM } from '../audioController';

const MONO = "'Courier New', 'Consolas', 'Liberation Mono', monospace";

// ─── Text lines (nulls are blank-pause-only rows, never rendered) ─────────────
const LINES = [
  "One moment you're living your same old boring life.",
  "The next, you're the one making the big choices.",
  "And the little ones.",
  "You're not supposed to be a part of this.",
  "But you are now. Somehow.",
  "The air feels heavier. The silence feels wrong.",
  "Like the world itself is waiting. Watching.",
  "Well. You watch too.",
  "Because whatever this place is —",
  "it chose you.",
  "And somewhere, someone is being lost. Quietly. Gradually.",
  "You might be the only one who notices.",
];

// ─── Absolute timestamps (ms from mount) for each line to appear ──────────────
//
// Calculation per line:
//   next_start = this_start + fade(800) + gap(900|1100|1800)
//
//   Line  0 →      0   (start)
//   Line  1 →  1 700   (800 fade + 900 gap)
//   Line  2 →  3 400   (800 + 900)
//   [blank 1100ms pause]
//   Line  3 →  5 300   (800 fade + 1100 blank)
//   Line  4 →  7 000   (800 + 900)
//   [blank 1100ms pause]
//   Line  5 →  8 900   (800 fade + 1100 blank)
//   Line  6 → 10 600   (800 + 900)
//   [blank 1100ms pause]
//   Line  7 → 12 500   (800 fade + 1100 blank)
//   [blank 1100ms pause]
//   Line  8 → 14 400   (800 fade + 1100 blank)
//   [longer 1800ms pause — "Because whatever…" hangs]
//   Line  9 → 17 000   (800 fade + 1800 gap)
//   [blank 1100ms pause]
//   Line 10 → 18 900   (800 fade + 1100 blank)
//   [blank 1100ms pause]
//   Line 11 → 20 800   (800 fade + 1100 blank)
//   [line 11 fades 800ms, then 2000ms wait → continue prompt at 23 600]
//
const SCHEDULE = [0, 1700, 3400, 5300, 7000, 8900, 10600, 12500, 14400, 17000, 18900, 20800];
const CONTINUE_AT = 23600; // 20800 + 800 fade + 2000 wait

export default function Prologue() {
  const { completePrologue } = useGame();

  const [visibleCount,  setVisibleCount]  = useState(0);
  const [showContinue,  setShowContinue]  = useState(false);
  const [fadingOut,     setFadingOut]     = useState(false);

  const timersRef   = useRef([]);
  const navigatedRef = useRef(false);

  const allShown = visibleCount >= LINES.length;

  // ── Schedule all line reveals and the continue prompt ─────────────────────
  useEffect(() => {
    SCHEDULE.forEach((at, i) => {
      const t = setTimeout(() => setVisibleCount(i + 1), at);
      timersRef.current.push(t);
    });

    const tc = setTimeout(() => setShowContinue(true), CONTINUE_AT);
    timersRef.current.push(tc);

    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // ── Click handler ──────────────────────────────────────────────────────────
  function handleClick() {
    if (navigatedRef.current) return;
    playClick();

    if (!allShown) {
      // Skip — cancel pending timers, show everything immediately
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      setVisibleCount(LINES.length);
      setShowContinue(true);
      return;
    }

    // All lines shown — fade music out over 800ms, then transition.
    // Audio is owned by audioController (single source of truth); AudioManager
    // in App.jsx also triggers its own fadeOut on prologue→playing transition,
    // but fadeOut is idempotent-safe so calling it here is fine.
    navigatedRef.current = true;
    setFadingOut(true);

    fadeOutBGM(800);

    setTimeout(() => completePrologue(), 800);
  }

  return (
    <div style={{ ...s.root, opacity: fadingOut ? 0 : 1 }} onClick={handleClick}>
      <div style={s.textWrap}>
        {LINES.map((line, i) => (
          <p
            key={i}
            style={{
              ...s.line,
              opacity:   i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            {line}
          </p>
        ))}
      </div>

      <div style={{ ...s.continueWrap, opacity: showContinue ? 1 : 0 }}>
        <span style={s.continueText}>[ press anywhere to continue ]</span>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    position:       'fixed',
    inset:          0,
    background:     '#000000',
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    cursor:         'default',
    transition:     'opacity 0.52s ease',
    userSelect:     'none',
  },

  textWrap: {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    gap:           '22px',
    maxWidth:      '600px',
    width:         '100%',
    padding:       '0 32px',
  },

  line: {
    fontFamily:    MONO,
    fontSize:      '17px',
    lineHeight:    1.65,
    color:         '#ffffff',
    textAlign:     'center',
    margin:        0,
    // transition drives both the fade-in and the subtle upward drift
    transition:    'opacity 0.8s ease, transform 0.8s ease',
  },

  continueWrap: {
    position:   'absolute',
    bottom:     '52px',
    left:       0,
    right:      0,
    display:    'flex',
    justifyContent: 'center',
    transition: 'opacity 1s ease',
  },

  continueText: {
    fontFamily:    MONO,
    fontSize:      '11px',
    letterSpacing: '0.14em',
    color:         'rgba(255,255,255,0.28)',
  },
};
