import { useEffect, useState } from 'react';
import { playClick } from '../utils/sound';
import {
  getVolume, setVolume,
  getMuted,  setMuted,
  subscribe as subscribeVolume,
} from '../utils/volumeStore';

// Background art — falls back to the menu persona art; glob never errors on a
// missing file, so the build is safe even with no art present.
const bgImgs = import.meta.glob('../assets/main_menu_persona.*', { eager: true, query: '?url', import: 'default' });
const bgImage = Object.values(bgImgs)[0] ?? null;

// ─── Style tokens (mirrors MainMenu.jsx) ──────────────────────────────────────
const HEAVY = "'Anton', 'Archivo Black', 'Arial Black', Impact, sans-serif";
const MONO  = "'Courier New', 'Consolas', 'Liberation Mono', monospace";
const RED    = '#d3132e';
const TEAL   = '#19b8b4';
const BG      = '#08090c';
const DIM     = 'rgba(255,255,255,0.18)';
const MID     = 'rgba(255,255,255,0.5)';

export default function MainMenuSettings({ onClose }) {
  const [volume, setVolState] = useState(getVolume());
  const [muted,  setMutedSt]  = useState(getMuted());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  // Stay in sync if the store is updated elsewhere (e.g. mute toggle from menu).
  useEffect(() => subscribeVolume(s => {
    setVolState(s.volume);
    setMutedSt(s.muted);
  }), []);

  function handleVolume(e) {
    const next = Number(e.target.value) / 100;
    setVolume(next);
    // Dragging shouldn't spam click SFX — don't play it here.
  }

  function handleMuteToggle() {
    playClick();
    setMuted(!muted);
  }

  function handleBack() {
    playClick();
    onClose?.();
  }

  const volumePct = Math.round(volume * 100);

  return (
    <div style={{ ...s.root, opacity: visible ? 1 : 0 }} className={visible ? 'set-in' : ''}>
      <div style={s.bgImg} aria-hidden="true" />
      <div style={s.wash} aria-hidden="true" />
      <div style={s.scanlines} aria-hidden="true" />

      <div style={s.layout}>
        <div style={s.headerRow}>
          <div>
            <div style={s.crumb}>SYS://CHRONICLES / SETTINGS</div>
            <h1 style={s.title}>SETTINGS</h1>
          </div>
          <button className="set-back" style={s.backBtn} onClick={handleBack}>
            ◀ BACK
          </button>
        </div>

        {/* ── SOUNDS & HAPTICS ───────────────────────────────────────────── */}
        <section style={s.section}>
          <h2 style={s.sectionLabel}>// SOUNDS &amp; HAPTICS</h2>

          <div style={s.row}>
            <div style={s.rowHead}>
              <span style={s.rowLabel}>MASTER VOLUME</span>
              <span style={s.rowValue}>{muted ? 'MUTED' : `${volumePct}%`}</span>
            </div>
            <input
              className="set-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              value={volumePct}
              onChange={handleVolume}
              disabled={muted}
              aria-label="Master volume"
              style={{
                ...s.slider,
                opacity: muted ? 0.35 : 1,
                background: `linear-gradient(to right, ${RED} 0%, ${RED} ${volumePct}%, rgba(255,255,255,0.1) ${volumePct}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            <div style={s.rowHint}>// background music &amp; interface sounds</div>
          </div>

          <div style={s.row}>
            <div style={s.rowHead}>
              <span style={s.rowLabel}>MUTE ALL</span>
              <button
                className="set-toggle"
                onClick={handleMuteToggle}
                style={{
                  ...s.toggle,
                  background:  muted ? RED : 'transparent',
                  color:       muted ? '#fff' : MID,
                  borderColor: muted ? '#000' : 'rgba(255,255,255,0.22)',
                  boxShadow:   muted ? '3px 3px 0 #000' : 'none',
                }}
              >
                {muted ? 'ON' : 'OFF'}
              </button>
            </div>
            <div style={s.rowHint}>// silences all audio output</div>
          </div>
        </section>

        <div style={s.footer}>
          <span style={s.buildTag}>BUILD 0.2 // HALIMA</span>
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}

const css = `
  .set-in { animation: setIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards; }
  @keyframes setIn {
    from { opacity: 0; transform: translateX(-18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .set-back:hover { color: #fff; border-color: ${RED}; background: rgba(211,19,46,0.18); }
  .set-toggle:hover { filter: brightness(1.1); }

  /* Range slider thumb — cross-browser */
  input[type="range"].set-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px; height: 18px;
    background: ${RED};
    border: 2px solid #000;
    box-shadow: 0 0 10px ${RED}cc, 2px 2px 0 #000;
    cursor: pointer;
  }
  input[type="range"].set-slider::-moz-range-thumb {
    width: 18px; height: 18px;
    background: ${RED};
    border: 2px solid #000;
    box-shadow: 0 0 10px ${RED}cc;
    cursor: pointer;
  }
`;

const s = {
  root: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    background: BG,
    display: 'flex',
    alignItems: 'stretch',
    overflow: 'hidden',
    fontFamily: MONO,
    color: '#fff',
    transition: 'opacity 0.4s ease',
  },

  bgImg: {
    position: 'absolute', inset: 0,
    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
  },
  // Dark wash hugging the left so the controls stay legible while the art
  // stays visible on the right (matches the menu / save screen).
  wash: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(100deg, rgba(5,6,9,0.94) 0%, rgba(5,6,9,0.74) 36%, rgba(5,6,9,0.3) 64%, rgba(5,6,9,0) 84%)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  scanlines: {
    position: 'absolute', inset: 0,
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
    pointerEvents: 'none',
    zIndex: 2,
  },

  layout: {
    position: 'relative',
    zIndex: 3,
    width: '100%',
    maxWidth: '620px',
    padding: '7vh 0 60px 5vw',
    display: 'flex',
    flexDirection: 'column',
  },

  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '34px',
  },

  crumb: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.25em',
    color: DIM,
    marginBottom: '8px',
    textShadow: '1px 1px 0 #000',
  },

  title: {
    fontFamily: HEAVY,
    fontSize: 'clamp(46px, 6.4vw, 88px)',
    fontWeight: 400,
    letterSpacing: '0.01em',
    lineHeight: 0.9,
    margin: 0,
    color: '#fff',
    textTransform: 'uppercase',
    transform: 'skewX(-7deg) rotate(-2deg)',
    transformOrigin: 'left center',
    WebkitTextStroke: '2.5px #000',
    paintOrder: 'stroke fill',
    textShadow: `3px 3px 0 #000, 6px 7px 0 #000, 0 0 30px ${RED}77, 9px 10px 0 rgba(0,0,0,0.4)`,
  },

  backBtn: {
    fontFamily: MONO,
    fontSize: '11px',
    letterSpacing: '0.22em',
    color: MID,
    background: 'rgba(0,0,0,0.45)',
    border: `1px solid ${DIM}`,
    padding: '10px 16px',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'color 0.15s, border-color 0.15s, background 0.15s',
  },

  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionLabel: {
    fontFamily: MONO,
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.22em',
    color: 'rgba(255,255,255,0.55)',
    margin: '0 0 4px',
    textTransform: 'uppercase',
    textShadow: '1px 1px 0 #000',
  },

  row: {
    padding: '16px 18px',
    background: 'rgba(8,9,12,0.5)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    borderLeft: `4px solid rgba(255,255,255,0.12)`,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  rowHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  rowLabel: {
    fontFamily: HEAVY,
    fontSize: 'clamp(20px, 2.2vw, 28px)',
    fontWeight: 400,
    letterSpacing: '0.03em',
    color: '#fff',
    textTransform: 'uppercase',
    lineHeight: 1,
    transform: 'skewX(-7deg)',
    transformOrigin: 'left center',
    WebkitTextStroke: '1.5px #000',
    paintOrder: 'stroke fill',
    textShadow: '2px 2px 0 #000',
  },
  rowValue: {
    fontFamily: MONO,
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: RED,
    minWidth: '60px',
    textAlign: 'right',
    textShadow: '1px 1px 0 #000',
  },
  rowHint: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.3)',
  },

  slider: {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },

  toggle: {
    fontFamily: HEAVY,
    fontSize: '13px',
    fontWeight: 400,
    letterSpacing: '0.16em',
    padding: '6px 18px',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.15s',
    minWidth: '60px',
    textTransform: 'uppercase',
  },

  footer: {
    marginTop: 'auto',
    paddingTop: '28px',
  },
  buildTag: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: DIM,
    textShadow: '1px 1px 0 #000',
  },
};
