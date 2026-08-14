import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { playClick } from '../utils/sound';
import ch1 from '../assets/viewer_select/CH1.png';
import ch2 from '../assets/viewer_select/CH2.png';
import ch3 from '../assets/viewer_select/CH3.png';
import ch4 from '../assets/viewer_select/CH4.png';

// ─── Character definitions ─────────────────────────────────────────────────
const CHARACTERS = [
  { id: 'Dara', descriptor: 'always the last one home.',        rim: '#E94560', image: ch1 },
  { id: 'Zael', descriptor: 'dirt road logic. somehow works.',  rim: '#BA7517', image: ch2 },
  { id: 'Seun', descriptor: 'huh. ...oh. huh.',                 rim: '#EF9F27', image: ch3 },
  { id: 'Fox',  descriptor: "designer bag. don't touch it.",    rim: '#9B59B6', image: ch4 },
];

const HEAVY = "'Anton', 'Archivo Black', 'Arial Black', Impact, sans-serif";
const MONO  = "'Courier New', 'Consolas', monospace";

// ─── Full-screen panel selector ─────────────────────────────────────────────
// Four panels split the screen. The hovered (or selected) panel expands and
// goes full colour; the rest shrink and desaturate. Click to select, CONFIRM
// to lock it in.
export default function CharacterSelect() {
  const { setViewerIdentity } = useGame();
  const [hovered,    setHovered]    = useState(null);
  const [selected,   setSelected]   = useState(null);
  const [confirming, setConfirming] = useState(false);

  // What's "open" right now: an explicit selection wins over a hover.
  const active = selected ?? hovered;

  function handlePick(id) {
    if (confirming) return;
    playClick();
    setSelected(id);
  }

  function handleConfirm() {
    if (!selected || confirming) return;
    playClick();
    setConfirming(true);
    setTimeout(() => setViewerIdentity(selected), 440);
  }

  return (
    <div style={{ ...s.root, opacity: confirming ? 0 : 1 }}>
      <div style={s.prompt}>who are you?</div>

      <div style={s.panels}>
        {CHARACTERS.map((c) => {
          const isActive   = active === c.id;
          const isSelected = selected === c.id;
          const someActive = active != null;

          const filter = isActive
            ? 'none'
            : someActive
            ? 'grayscale(0.85) brightness(0.42)'
            : 'grayscale(0.2) brightness(0.82)';

          return (
            <div
              key={c.id}
              role="button"
              tabIndex={0}
              aria-label={c.id}
              style={{ ...s.panel, flexGrow: isActive ? 2.7 : 1 }}
              onMouseEnter={() => { if (!confirming) setHovered(c.id); }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handlePick(c.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePick(c.id); }}
            >
              {/* Character art */}
              <div style={{ ...s.panelBg, backgroundImage: `url(${c.image})`, filter }} />
              {/* Readability shade, heavier when dimmed */}
              <div style={{ ...s.shade, opacity: isActive ? 0.55 : 0.8 }} />
              {/* Selected ring */}
              {isSelected && <div style={{ ...s.selRing, boxShadow: `inset 0 0 0 3px ${c.rim}, inset 0 0 60px ${c.rim}55` }} />}
              {/* Bottom colour rim */}
              <div style={{ ...s.rim, background: c.rim, opacity: isActive ? 1 : 0.3, boxShadow: isActive ? `0 0 26px ${c.rim}` : 'none' }} />

              {/* Caption */}
              <div style={s.caption}>
                <div
                  style={{
                    ...s.name,
                    fontSize: isActive ? 'clamp(44px, 5.2vw, 92px)' : 'clamp(22px, 2.1vw, 36px)',
                    textShadow: isActive ? `4px 4px 0 #000, 0 0 30px ${c.rim}aa` : '3px 3px 0 #000',
                  }}
                >
                  {c.id}
                </div>
                <div style={{ ...s.desc, color: c.rim, maxHeight: isActive ? '40px' : '0px', opacity: isActive ? 1 : 0 }}>
                  {c.descriptor}
                </div>
                {isSelected && (
                  <button
                    className="cs-confirm"
                    style={{ ...s.confirm, borderColor: c.rim, color: '#fff', background: `${c.rim}` }}
                    onClick={(e) => { e.stopPropagation(); handleConfirm(); }}
                  >
                    CONFIRM
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={s.scanlines} aria-hidden="true" />
      <style>{css}</style>
    </div>
  );
}

const css = `
  .cs-confirm { transition: filter 0.15s, transform 0.15s; }
  .cs-confirm:hover { filter: brightness(1.12); transform: translateY(-1px); }
  .cs-confirm:active { transform: translateY(0); }
`;

const s = {
  root: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    background: '#06060a',
    overflow: 'hidden',
    userSelect: 'none',
    transition: 'opacity 0.42s ease',
  },

  prompt: {
    position: 'absolute',
    top: '4vh',
    left: '0',
    right: '0',
    textAlign: 'center',
    zIndex: 5,
    fontFamily: MONO,
    fontSize: '13px',
    letterSpacing: '0.35em',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'lowercase',
    textShadow: '0 2px 12px #000',
    pointerEvents: 'none',
  },

  panels: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },

  panel: {
    position: 'relative',
    flexBasis: 0,
    minWidth: 0,
    height: '100%',
    overflow: 'hidden',
    cursor: 'pointer',
    borderLeft: '1px solid rgba(0,0,0,0.6)',
    transition: 'flex-grow 0.5s cubic-bezier(0.4,0,0.2,1)',
  },

  panelBg: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 18%',
    backgroundRepeat: 'no-repeat',
    transition: 'filter 0.5s ease, transform 0.5s ease',
  },

  shade: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(4,4,8,0.96) 0%, rgba(4,4,8,0.35) 36%, rgba(4,4,8,0.05) 60%, rgba(4,4,8,0.2) 100%)',
    transition: 'opacity 0.5s ease',
    pointerEvents: 'none',
  },

  selRing: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 3,
  },

  rim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '5px',
    transition: 'opacity 0.4s ease, box-shadow 0.4s ease',
    zIndex: 2,
  },

  caption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '5vh',
    zIndex: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 12px',
    pointerEvents: 'none',
  },

  name: {
    fontFamily: HEAVY,
    fontWeight: 400,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    lineHeight: 1,
    transform: 'skewX(-6deg)',
    WebkitTextStroke: '2px #000',
    paintOrder: 'stroke fill',
    transition: 'font-size 0.45s cubic-bezier(0.4,0,0.2,1), text-shadow 0.4s ease',
    whiteSpace: 'nowrap',
  },

  desc: {
    fontFamily: MONO,
    fontSize: '12px',
    letterSpacing: '0.08em',
    marginTop: '10px',
    overflow: 'hidden',
    textShadow: '0 1px 6px #000',
    transition: 'opacity 0.4s ease, max-height 0.4s ease',
  },

  confirm: {
    marginTop: '18px',
    pointerEvents: 'auto',
    fontFamily: HEAVY,
    fontSize: '15px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    padding: '11px 34px',
    border: '2px solid #000',
    boxShadow: '3px 3px 0 #000',
    cursor: 'pointer',
  },

  scanlines: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
    pointerEvents: 'none',
    zIndex: 6,
  },
};
