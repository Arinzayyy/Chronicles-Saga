import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { hasSave } from '../saveState';
import bgImage from '../assets/main_menu_bg.jpg';
import { playClick } from '../utils/sound';
import { getMuted, toggleMuted, subscribe as subscribeVolume } from '../utils/volumeStore';
import MainMenuSettings from './MainMenuSettings';
import SaveSlotSelect from './SaveSlotSelect';

// NOTE: BGM is owned by src/audioController.js (single source of truth).
// Previously this file created a second <Audio> causing duplicate playback —
// that's been removed as part of the volume fix.

const ACCENT = '#E94560';
const MONO   = "'Courier New', 'Consolas', 'Liberation Mono', monospace";
const BG     = '#0a0a0f';
const DIM    = 'rgba(255,255,255,0.18)';
const MID    = 'rgba(255,255,255,0.45)';

function useTime() {
  const fmt = () => new Date().toTimeString().slice(0, 5);
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const iv = setInterval(() => setTime(fmt()), 10000);
    return () => clearInterval(iv);
  }, []);
  return time;
}

export default function MainMenu() {
  const { newGame } = useGame();
  const [visible,      setVisible]      = useState(false);
  const [blink,        setBlink]        = useState(true);
  const [muted,        setMutedUI]      = useState(getMuted());
  const [saveExists,   setSaveExists]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLoad,     setShowLoad]     = useState(false);
  const time = useTime();

  // Keep mute indicator synced with the volume store (also updated from
  // the Settings screen, so we need to react to external changes).
  useEffect(() => subscribeVolume(s => setMutedUI(s.muted)), []);

  // Check for a save file on mount so the Continue button knows whether to
  // be active. We do this in a useEffect so it only runs client-side
  // (localStorage isn't available during SSR if this were ever server-rendered).
  useEffect(() => {
    setSaveExists(hasSave());
  }, []);

  // Fade-in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Dot blink
  useEffect(() => {
    const iv = setInterval(() => setBlink(b => !b), 800);
    return () => clearInterval(iv);
  }, []);

  function handleNewGame() {
    playClick();
    // newGame() clears any existing save then dispatches START_GAME.
    // This prevents old save data from being overwritten accidentally.
    newGame();
    // Do NOT stop audio here — Prologue will fade it out
  }

  function handleLoad() {
    if (!saveExists) return;
    playClick();
    setShowLoad(true);
  }

  function toggleMute() {
    playClick();
    // Volume store is the single source; subscribers (BGM element, etc.)
    // receive the change automatically.
    toggleMuted();
  }

  function openSettings() {
    playClick();
    setShowSettings(true);
  }

  // When the settings overlay is open, render it instead of the menu.
  // Using conditional render (vs overlay z-index) keeps focus/keyboard sane.
  if (showSettings) {
    return <MainMenuSettings onClose={() => setShowSettings(false)} />;
  }

  // Same pattern for the save-slot select screen. When a slot is loaded,
  // the game router takes over (gamePhase flips to "playing") and this
  // component unmounts on its own.
  if (showLoad) {
    return (
      <SaveSlotSelect
        mode="load"
        onClose={() => setShowLoad(false)}
      />
    );
  }

  return (
    <div style={s.root} className={visible ? 'mm-in' : ''}>
      {/* Background image */}
      <div style={s.bgImg} aria-hidden="true" />

      {/* Dark overlay */}
      <div style={s.bgOverlay} aria-hidden="true" />

      {/* Scanline overlay */}
      <div style={s.scanlines} aria-hidden="true" />

      <div style={s.layout}>

        {/* ══ LEFT PANEL ══ */}
        <div style={s.left}>
          <div style={s.sysTag}>SYS://CHRONICLES</div>
          <div style={s.encryptedLabel}>// ENCRYPTED SIGNAL ACTIVE</div>

          <div style={s.titleWrap}>
            <span style={s.titleChronicles}>CHRONICLES</span>
            <span style={s.titleSaga}>SAGA</span>
          </div>

          <div style={s.divider} />

          <blockquote style={s.quote}>
            <span style={s.quoteLine}>Someone went dark. Not cleanly.</span>
            <span style={s.quoteLine}>You&apos;re the only one not in the system.</span>
            <span style={s.quoteAttrib}>— intercepted fragment</span>
          </blockquote>

          <div style={{ flex: 1 }} />

          <div style={s.statusBar}>
            <span style={{ ...s.dot, background: ACCENT,    boxShadow: `0 0 6px ${ACCENT}`,    opacity: blink ? 1 : 0.2 }} />
            <span style={{ ...s.dot, background: '#4da6ff', boxShadow: '0 0 6px #4da6ff' }} />
            <span style={{ ...s.dot, background: '#ffffff', boxShadow: '0 0 6px #ffffff99' }} />
            <span style={s.statusText}>LIVE SIGNAL // GROUP CHAT: STATIC</span>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={s.right}>

          <div style={s.topBar}>
            <span style={s.clock}>{time}</span>
          </div>

          <div style={s.sagaCard}>
            <div style={s.sagaLabel}>ACTIVE SAGA</div>
            <div style={s.sagaTitle}>HALIMA RETRIEVAL</div>
            <div style={s.sagaMeta}>
              <span style={s.sagaMetaItem}>■ ONGOING</span>
              <span style={s.sagaMetaItem}>NODE 04</span>
            </div>
            <p style={s.sagaDesc}>
              A distress signal with Halima&apos;s signature. A warehouse that was never a
              hideout. Someone is watching how you respond.
            </p>
          </div>

          <nav style={s.menu}>
            <button style={s.menuRowActive} onClick={handleNewGame}>
              <span style={s.menuArrow}>▶</span>
              <span style={s.menuInner}>
                <span style={s.menuLabel}>NEW GAME</span>
                <span style={s.menuSub}>// begin halima retrieval from scene 1</span>
              </span>
            </button>

            {saveExists ? (
              <button style={s.menuRowActive} onClick={handleLoad}>
                <span style={s.menuArrow}>▶</span>
                <span style={s.menuInner}>
                  <span style={s.menuLabel}>LOAD</span>
                  <span style={s.menuSub}>// choose a save slot</span>
                </span>
              </button>
            ) : (
              <div style={s.menuRowDim}>
                <span style={s.menuArrowDim}>▷</span>
                <span style={s.menuInner}>
                  <span style={s.menuLabelDim}>LOAD</span>
                  <span style={s.menuSubDim}>// no save data</span>
                </span>
              </div>
            )}

            <button style={s.menuRowActive} onClick={openSettings}>
              <span style={s.menuArrow}>▶</span>
              <span style={s.menuInner}>
                <span style={s.menuLabel}>SETTINGS</span>
                <span style={s.menuSub}>// audio, haptics &amp; system</span>
              </span>
            </button>
          </nav>

          <div style={s.bottomRight}>
            <button style={s.muteBtn} onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>
              {muted ? '✕♪' : '♪'}
            </button>
            <span style={s.buildTag}>BUILD 0.1 // HALIMA</span>
          </div>
        </div>
      </div>

      <style>{`
        .mm-in { animation: mmFadeIn 0.9s ease forwards; }
        @keyframes mmFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
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
    opacity: 0,
    overflow: 'hidden',
    fontFamily: MONO,
  },

  bgImg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
  },

  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.85))',
    zIndex: 1,
  },

  scanlines: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
    pointerEvents: 'none',
    zIndex: 2,
  },

  layout: {
    position: 'relative',
    zIndex: 3,
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
  },

  /* ── LEFT ── */
  left: {
    flex: '1 1 55%',
    display: 'flex',
    flexDirection: 'column',
    padding: '36px 48px 40px',
    borderRight: `1px solid rgba(233,69,96,0.25)`,
  },

  sysTag: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.2em',
    color: DIM,
    marginBottom: '32px',
  },

  encryptedLabel: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.18em',
    color: 'rgba(233,69,96,0.55)',
    marginBottom: '16px',
  },

  titleWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.0,
    marginBottom: '28px',
  },

  titleChronicles: {
    fontFamily: MONO,
    fontSize: 'clamp(60px, 8vw, 90px)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: '#ffffff',
    lineHeight: 1.0,
  },

  titleSaga: {
    fontFamily: MONO,
    fontSize: 'clamp(60px, 8vw, 90px)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: ACCENT,
    textShadow: `0 0 32px ${ACCENT}77`,
    lineHeight: 1.0,
  },

  divider: {
    width: '56px',
    height: '2px',
    background: ACCENT,
    marginBottom: '32px',
    boxShadow: `0 0 10px ${ACCENT}66`,
  },

  quote: {
    margin: 0,
    padding: '0 0 0 20px',
    borderLeft: `2px solid ${ACCENT}44`,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  quoteLine: {
    fontFamily: MONO,
    fontSize: '14px',
    color: MID,
    letterSpacing: '0.04em',
    lineHeight: 1.65,
  },

  quoteAttrib: {
    marginTop: '12px',
    fontFamily: MONO,
    fontSize: '11px',
    color: DIM,
    letterSpacing: '0.1em',
    fontStyle: 'italic',
  },

  statusBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    border: `1px solid rgba(233,69,96,0.18)`,
    background: 'rgba(0,0,0,0.35)',
  },

  dot: {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    flexShrink: 0,
    transition: 'opacity 0.3s',
  },

  statusText: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.18em',
    color: ACCENT,
    marginLeft: '4px',
  },

  /* ── RIGHT ── */
  right: {
    flex: '1 1 45%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '36px 48px 40px',
    gap: '28px',
  },

  topBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '4px',
  },

  clock: {
    fontFamily: MONO,
    fontSize: '12px',
    letterSpacing: '0.2em',
    color: MID,
  },

  sagaCard: {
    padding: '24px',
    border: `1px solid ${ACCENT}`,
    background: 'rgba(0,0,0,0.45)',
    boxShadow: `inset 0 0 32px rgba(233,69,96,0.04), 0 0 0 1px rgba(233,69,96,0.12)`,
  },

  sagaLabel: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.25em',
    color: ACCENT,
    marginBottom: '10px',
  },

  sagaTitle: {
    fontFamily: MONO,
    fontSize: 'clamp(18px, 2.5vw, 24px)',
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '0.06em',
    marginBottom: '10px',
  },

  sagaMeta: {
    display: 'flex',
    gap: '20px',
    marginBottom: '16px',
  },

  sagaMetaItem: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: DIM,
  },

  sagaDesc: {
    fontFamily: MONO,
    fontSize: '12px',
    color: MID,
    lineHeight: 1.7,
    letterSpacing: '0.03em',
    margin: 0,
    paddingTop: '12px',
    borderTop: '1px solid rgba(255,255,255,0.07)',
  },

  menu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  menuRowActive: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '14px 20px',
    fontFamily: MONO,
    color: '#ffffff',
    background: 'rgba(233,69,96,0.14)',
    border: `1px solid ${ACCENT}`,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.15s, box-shadow 0.15s',
    width: '100%',
  },

  menuArrow: {
    color: ACCENT,
    fontSize: '10px',
    paddingTop: '3px',
    flexShrink: 0,
  },

  menuRowDim: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '14px 20px',
    fontFamily: MONO,
    color: DIM,
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(0,0,0,0.25)',
    cursor: 'default',
    userSelect: 'none',
  },

  menuArrowDim: {
    color: DIM,
    fontSize: '10px',
    paddingTop: '3px',
    flexShrink: 0,
  },

  menuInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  menuLabel: {
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#ffffff',
  },

  menuSub: {
    fontSize: '10px',
    letterSpacing: '0.1em',
    color: 'rgba(233,69,96,0.65)',
    fontWeight: 400,
  },

  menuLabelDim: {
    fontSize: '13px',
    fontWeight: 400,
    letterSpacing: '0.2em',
    color: DIM,
  },

  menuSubDim: {
    fontSize: '10px',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.12)',
    fontWeight: 400,
  },

  bottomRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
    marginTop: 'auto',
  },

  muteBtn: {
    fontFamily: MONO,
    fontSize: '14px',
    color: DIM,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 6px',
    letterSpacing: '0.05em',
    transition: 'color 0.15s',
    lineHeight: 1,
  },

  buildTag: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: DIM,
  },
};
