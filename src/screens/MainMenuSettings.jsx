import { useEffect, useState } from 'react';
import bgImage from '../assets/main_menu_bg.jpg';
import { playClick } from '../utils/sound';
import {
  getVolume, setVolume,
  getMuted,  setMuted,
  subscribe as subscribeVolume,
} from '../utils/volumeStore';

// ─── Style tokens (mirrors MainMenu.jsx) ──────────────────────────────────────
const ACCENT = '#E94560';
const MONO   = "'Courier New', 'Consolas', 'Liberation Mono', monospace";
const BG     = '#0a0a0f';
const DIM    = 'rgba(255,255,255,0.18)';
const MID    = 'rgba(255,255,255,0.45)';

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
    <div style={{ ...s.root, opacity: visible ? 1 : 0 }}>
      <div style={s.bgImg} aria-hidden="true" />
      <div style={s.bgOverlay} aria-hidden="true" />
      <div style={s.scanlines} aria-hidden="true" />

      <div style={s.layout}>
        <div style={s.panel}>
          <div style={s.sysTag}>SYS://CHRONICLES/SETTINGS</div>

          <div style={s.titleRow}>
            <span style={s.titleWord}>SYSTEM</span>
            <span style={s.titleAccent}>CONFIG</span>
          </div>
          <div style={s.divider} />

          {/* ── SOUNDS & HAPTICS ─────────────────────────────────────────── */}
          <section style={s.section}>
            <h2 style={s.sectionLabel}>// SOUNDS &amp; HAPTICS</h2>

            <div style={s.row}>
              <div style={s.rowHead}>
                <span style={s.rowLabel}>MASTER VOLUME</span>
                <span style={s.rowValue}>
                  {muted ? 'MUTED' : `${volumePct}%`}
                </span>
              </div>
              <input
                className="cs-slider"
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
                  background: `linear-gradient(to right, ${ACCENT} 0%, ${ACCENT} ${volumePct}%, rgba(255,255,255,0.08) ${volumePct}%, rgba(255,255,255,0.08) 100%)`,
                }}
              />
              <div style={s.rowHint}>
                // controls background music &amp; interface sounds
              </div>
            </div>

            <div style={s.row}>
              <div style={s.rowHead}>
                <span style={s.rowLabel}>MUTE ALL</span>
                <button
                  onClick={handleMuteToggle}
                  style={{
                    ...s.toggle,
                    background: muted ? ACCENT : 'transparent',
                    color:      muted ? '#0a0a0f' : MID,
                    borderColor: muted ? ACCENT : 'rgba(255,255,255,0.18)',
                  }}
                >
                  {muted ? 'ON' : 'OFF'}
                </button>
              </div>
              <div style={s.rowHint}>
                // silences all audio output
              </div>
            </div>
          </section>

          {/* ── Back button ──────────────────────────────────────────────── */}
          <div style={s.footer}>
            <button style={s.backBtn} onClick={handleBack}>
              <span style={s.backArrow}>◀</span>
              <span>BACK TO MENU</span>
            </button>
            <span style={s.buildTag}>BUILD 0.1 // HALIMA</span>
          </div>
        </div>
      </div>

      <style>{`
        /* Range slider thumb — cross-browser */
        input[type="range"].cs-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px; height: 16px;
          background: ${ACCENT};
          border: 2px solid #0a0a0f;
          box-shadow: 0 0 8px ${ACCENT}aa;
          cursor: pointer;
        }
        input[type="range"].cs-slider::-moz-range-thumb {
          width: 16px; height: 16px;
          background: ${ACCENT};
          border: 2px solid #0a0a0f;
          box-shadow: 0 0 8px ${ACCENT}aa;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

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
    transition: 'opacity 0.4s ease',
  },

  bgImg: {
    position: 'absolute', inset: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
    filter: 'blur(2px)',
  },
  bgOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.82), rgba(0,0,0,0.92))',
    zIndex: 1,
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    minHeight: '100vh',
    padding: '48px 32px',
  },

  panel: {
    width: '100%',
    maxWidth: '640px',
    padding: '32px 36px',
    border: `1px solid ${ACCENT}`,
    background: 'rgba(0,0,0,0.55)',
    boxShadow: `inset 0 0 32px rgba(233,69,96,0.05), 0 0 0 1px rgba(233,69,96,0.12)`,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  sysTag: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.2em',
    color: DIM,
  },

  titleRow: {
    display: 'flex',
    gap: '14px',
    alignItems: 'baseline',
  },
  titleWord: {
    fontFamily: MONO,
    fontSize: 'clamp(32px, 5vw, 44px)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: '#ffffff',
  },
  titleAccent: {
    fontFamily: MONO,
    fontSize: 'clamp(32px, 5vw, 44px)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: ACCENT,
    textShadow: `0 0 28px ${ACCENT}77`,
  },

  divider: {
    width: '56px',
    height: '2px',
    background: ACCENT,
    boxShadow: `0 0 10px ${ACCENT}66`,
  },

  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionLabel: {
    fontFamily: MONO,
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.2em',
    color: 'rgba(233,69,96,0.65)',
    margin: 0,
    textTransform: 'uppercase',
  },

  row: {
    padding: '14px 16px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  rowHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontFamily: MONO,
    fontSize: '12px',
    letterSpacing: '0.15em',
    color: '#ffffff',
  },
  rowValue: {
    fontFamily: MONO,
    fontSize: '12px',
    letterSpacing: '0.1em',
    color: ACCENT,
    minWidth: '60px',
    textAlign: 'right',
  },
  rowHint: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.25)',
  },

  slider: {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '100%',
    height: '4px',
    borderRadius: '2px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },

  toggle: {
    fontFamily: MONO,
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    padding: '4px 14px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.15s',
    minWidth: '54px',
  },

  footer: {
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 18px',
    fontFamily: MONO,
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#ffffff',
    background: 'rgba(233,69,96,0.14)',
    border: `1px solid ${ACCENT}`,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  backArrow: {
    color: ACCENT,
    fontSize: '10px',
  },
  buildTag: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: DIM,
  },
};
