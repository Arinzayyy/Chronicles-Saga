import { useEffect, useMemo, useState } from 'react';
import { useGame } from '../context/GameContext';
import { hasSave, getLastViewerIdentity } from '../saveState';
import { playClick } from '../utils/sound';
import { getMuted, toggleMuted, subscribe as subscribeVolume } from '../utils/volumeStore';
import MainMenuSettings from './MainMenuSettings';
import SaveSlotSelect from './SaveSlotSelect';

// NOTE: BGM is owned by src/audioController.js (single source of truth).

// Default persona-style key art (shown before any viewer is chosen). Drop the
// artist file at src/assets/main_menu_persona.jpg (or .png) and it's picked up
// automatically; until then we fall back to the old background so the build
// never breaks on a missing asset.
const personaImgs = import.meta.glob('../assets/main_menu_persona.*', {
  eager: true, query: '?url', import: 'default',
});
const DEFAULT_BG = Object.values(personaImgs)[0] ?? null;

// Per-viewer key art. Drop a file named after each viewer into
// src/assets/viewer_menu/ (Dara, Zael, Seun, Fox — jpg/png/webp) and the menu
// uses it as the background once that viewer has been chosen. Missing files
// simply fall back to DEFAULT_BG, so the build never breaks.
const viewerImgs = import.meta.glob('../assets/viewer_menu/*.{jpg,jpeg,png,webp}', {
  eager: true, query: '?url', import: 'default',
});
const VIEWER_BG = {};
for (const [path, url] of Object.entries(viewerImgs)) {
  const stem = path.split('/').pop().replace(/\.[^.]+$/, '');
  VIEWER_BG[stem] = url;
  VIEWER_BG[stem.toLowerCase()] = url; // forgiving of casing
}

function bgForViewer(viewer) {
  if (!viewer) return DEFAULT_BG;
  return VIEWER_BG[viewer] ?? VIEWER_BG[viewer.toLowerCase()] ?? DEFAULT_BG;
}

const RED   = '#d3132e';
const TEAL  = '#19b8b4';
const HEAVY = "'Anton', 'Archivo Black', 'Arial Black', Impact, sans-serif";
const MONO  = "'Courier New', 'Consolas', monospace";

export default function MainMenu() {
  const { newGame, state } = useGame();
  // Reflect the chosen viewer as the menu's key art: in-session identity first,
  // else the most recently saved one, else the default art.
  const lastViewer = useMemo(() => getLastViewerIdentity(), []);
  const BG_URL = bgForViewer(state?.viewerIdentity ?? lastViewer);
  const [visible,      setVisible]      = useState(false);
  const [muted,        setMutedUI]      = useState(getMuted());
  const [saveExists,   setSaveExists]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLoad,     setShowLoad]     = useState(false);
  const [par,          setPar]          = useState({ x: 0, y: 0 });
  const [sel,          setSel]          = useState(0); // highlighted menu row

  useEffect(() => subscribeVolume(s => setMutedUI(s.muted)), []);
  useEffect(() => { setSaveExists(hasSave()); }, []);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Subtle whole-image parallax (placeholder for layered art later —
  // when the artist ships layers, split this into bg/char depths).
  useEffect(() => {
    function onMove(e) {
      const nx = (e.clientX / window.innerWidth)  - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      setPar({ x: nx * -14, y: ny * -10 });
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  function handleNewGame() { playClick(); newGame(); }
  function handleLoad()    { if (!saveExists) return; playClick(); setShowLoad(true); }
  function openSettings()  { playClick(); setShowSettings(true); }
  function toggleMute()    { playClick(); toggleMuted(); }

  // Menu rows, top → bottom. Diagonal cascade (varying angle + growing indent),
  // primary actions large up top, secondary options smaller and stepped right.
  // The selected row scales up + turns red so it dominates (see .pm-selected).
  const items = [
    { label: 'New Game',    onActivate: handleNewGame, rot: '-5deg', ind: '0px',   size: 'clamp(66px, 10.5vw, 148px)' },
    { label: 'Continue',    onActivate: handleLoad, locked: !saveExists, caret: saveExists, rot: '-3deg', ind: '34px', size: 'clamp(66px, 10.5vw, 148px)' },
    { label: 'Settings',    onActivate: openSettings, rot: '-4deg', ind: '84px',  size: 'clamp(54px, 8vw, 112px)' },
    { label: 'Change Saga', locked: true, soon: true, rot: '-2deg', ind: '108px', size: 'clamp(54px, 8vw, 112px)' },
    { label: 'Gallery',     locked: true, soon: true, rot: '-3.5deg', ind: '146px', size: 'clamp(54px, 8vw, 112px)' },
  ];

  // Keyboard / controller navigation: ↑↓ to move, Enter to confirm.
  useEffect(() => {
    function onKey(e) {
      if (showSettings || showLoad) return;
      if (e.key === 'ArrowDown' || e.key === 's') { setSel(i => Math.min(i + 1, items.length - 1)); e.preventDefault(); }
      else if (e.key === 'ArrowUp' || e.key === 'w') { setSel(i => Math.max(i - 1, 0)); e.preventDefault(); }
      else if (e.key === 'Enter' || e.key === ' ') {
        const it = items[sel];
        if (it && !it.locked) it.onActivate();
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sel, saveExists, showSettings, showLoad]); // eslint-disable-line react-hooks/exhaustive-deps

  if (showSettings) return <MainMenuSettings onClose={() => setShowSettings(false)} />;
  if (showLoad)     return <SaveSlotSelect mode="load" onClose={() => setShowLoad(false)} />;

  return (
    <div style={s.root} className={visible ? 'pm-in' : 'pm-pre'}>
      {/* Key art */}
      <div
        style={{
          ...s.bgImg,
          backgroundImage: BG_URL ? `url(${BG_URL})` : 'none',
          transform: `scale(1.06) translate(${par.x}px, ${par.y}px)`,
        }}
        aria-hidden="true"
      />
      {/* Left-edge legibility wash over the teal area */}
      <div style={s.wash} aria-hidden="true" />

      <div style={s.layout}>
        {/* ══ MENU STACK ══ */}
        <nav style={s.menu} aria-label="Main menu">
          {items.map((it, i) => {
            const selected = i === sel;
            const cls = [
              'pm-item',
              it.locked ? 'pm-locked' : '',
              selected ? 'pm-selected' : '',
            ].filter(Boolean).join(' ');
            return (
              <button
                key={it.label}
                className={cls}
                style={{ '--rot': it.rot, '--ind': it.ind, fontSize: it.size }}
                onMouseEnter={() => setSel(i)}
                onFocus={() => setSel(i)}
                onClick={() => { if (!it.locked) it.onActivate(); }}
                aria-disabled={it.locked || undefined}
                title={it.soon ? 'Coming soon' : undefined}
              >
                <span className="pm-fill">{it.label}</span>
                {it.caret && <span className="pm-caret">▼</span>}
                {it.soon && <span className="pm-soon">SOON</span>}
              </button>
            );
          })}
        </nav>

        {/* ══ BOTTOM BAR ══ */}
        <div style={s.bottomBar}>
          <button style={s.muteBtn} onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>
            {muted ? '✕♪' : '♪'}
          </button>
          <span style={s.buildTag}>BUILD 0.2 // HALIMA</span>
          {/* Decorative prompts — flavor, not a gamepad promise */}
          <span style={s.prompts}>
            <span style={s.promptKey}>A</span> Confirm&nbsp;&nbsp;
            <span style={{ ...s.promptKey, background: RED }}>B</span> Back
          </span>
        </div>
      </div>

      <style>{`
        .pm-pre { opacity: 0; }
        .pm-in  { animation: pmIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes pmIn {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .pm-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          width: fit-content;
          margin-left: var(--ind);
          padding: 2px 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          transform: rotate(var(--rot)) skewX(-7deg);
          transform-origin: left center;  /* grow rightward from the shared left edge */
          transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), filter 0.16s;
          font-family: ${HEAVY};
          text-transform: uppercase;
          line-height: 0.82;
          letter-spacing: 0.005em;
          user-select: none;
        }
        .pm-big  { font-size: clamp(60px, 9.2vw, 118px); }
        .pm-mid  { font-size: clamp(44px, 6.2vw, 82px); }

        .pm-fill {
          color: #ffffff;
          -webkit-text-stroke: 2.5px #000;
          paint-order: stroke fill;
          text-shadow:
            3px 3px 0 #000,
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000,
            6px 7px 0 #000,
            9px 10px 0 rgba(0,0,0,0.4);
        }

        .pm-item:not(.pm-locked):hover,
        .pm-item:not(.pm-locked):focus-visible,
        .pm-item.pm-selected:not(.pm-locked) {
          transform: rotate(var(--rot)) skewX(-7deg) translateX(8px) scale(1.28);
          outline: none;
        }
        /* highlighting a locked row: a gentle pop, no red, no big scale */
        .pm-item.pm-selected.pm-locked {
          transform: rotate(var(--rot)) skewX(-7deg) scale(1.06);
        }
        .pm-item:not(.pm-locked):hover .pm-fill,
        .pm-item:not(.pm-locked):focus-visible .pm-fill,
        .pm-item.pm-selected:not(.pm-locked) .pm-fill {
          color: ${RED};
          text-shadow:
            3px 3px 0 #000,
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000,
            6px 7px 0 #000,
            0 0 28px ${RED}cc,
            9px 10px 0 rgba(0,0,0,0.4);
        }
        /* A highlighted-but-locked row still reads as focused (brighter), but stays white */
        .pm-item.pm-selected.pm-locked .pm-fill { color: #ffffff; }
        .pm-item:not(.pm-locked):active {
          transform: rotate(var(--rot)) skewX(-7deg) translateX(16px) scale(0.98);
        }

        .pm-locked { cursor: default; }
        .pm-locked .pm-fill {
          color: rgba(255,255,255,0.78);
          -webkit-text-stroke: 2.5px #000;
        }

        .pm-caret {
          font-size: 0.35em;
          color: ${RED};
          text-shadow: 2px 2px 0 #000;
          animation: pmCaret 1.1s ease-in-out infinite;
        }
        @keyframes pmCaret {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }

        .pm-soon {
          font-family: ${MONO};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #fff;
          background: ${TEAL};
          padding: 3px 8px;
          transform: rotate(3deg);
          box-shadow: 2px 2px 0 #000;
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
    background: '#08090c',
    overflow: 'hidden',
  },

  bgImg: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
    transition: 'transform 0.25s ease-out',
    willChange: 'transform',
  },

  // Keeps the type readable over busy splatter without dulling the art:
  // a soft dark wash hugging the left edge only.
  wash: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(100deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.28) 34%, rgba(0,0,0,0) 58%)',
    zIndex: 1,
    pointerEvents: 'none',
  },

  layout: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '9vh 0 0 5vw',
  },

  menu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.8vh',
    alignItems: 'flex-start',
  },

  bottomBar: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    padding: '0 28px 18px 4px',
  },

  muteBtn: {
    fontFamily: MONO,
    fontSize: '15px',
    color: 'rgba(255,255,255,0.7)',
    background: 'rgba(0,0,0,0.45)',
    border: '1px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    padding: '5px 9px',
    lineHeight: 1,
  },

  buildTag: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.45)',
    textShadow: '1px 1px 0 #000',
  },

  prompts: {
    marginLeft: 'auto',
    fontFamily: MONO,
    fontSize: '12px',
    fontWeight: 700,
    color: '#fff',
    textShadow: '1px 1px 0 #000',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  promptKey: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#1d9e3f',
    color: '#fff',
    fontSize: '11px',
    boxShadow: '1px 1px 0 #000',
  },
};
