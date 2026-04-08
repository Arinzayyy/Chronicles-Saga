import { useState } from 'react';
import { useGame } from '../context/GameContext';

// ─── Character definitions ─────────────────────────────────────────────────
const CHARACTERS = [
  {
    id:         'Sable',
    descriptor: 'quiet. observant.',
    rim:        '#185FA5',
    rimAlpha:   'rgba(24, 95, 165, 0.45)',
  },
  {
    id:         'Cael',
    descriptor: 'calculated. distant.',
    rim:        '#BA7517',
    rimAlpha:   'rgba(186, 117, 23, 0.45)',
  },
  {
    id:         'Riven',
    descriptor: 'moves fast. sharp.',
    rim:        '#EF9F27',
    rimAlpha:   'rgba(239, 159, 39, 0.45)',
  },
  {
    id:         'Yara',
    descriptor: 'reads people. careful.',
    rim:        '#1D9E75',
    rimAlpha:   'rgba(29, 158, 117, 0.45)',
  },
];

// ─── SVG silhouette figures ────────────────────────────────────────────────
// Each is a unique dark silhouette inside a 100×128 viewBox.
// Slight pose variations distinguish the characters.
const FIGURE_PATHS = {
  // Sable — hooded, narrow, hunched slightly forward
  Sable: `
    M50 6 C41 6 34 13 34 22 C34 31 41 38 50 38 C59 38 66 31 66 22 C66 13 59 6 50 6Z
    M38 13 C36 15 36 18 36 20 Q36 16 44 13 Q38 11 38 13Z
    M62 13 C64 15 64 18 64 20 Q64 16 56 13 Q62 11 62 13Z
    M35 40 L28 90 L38 90 L42 72 L50 70 L58 72 L62 90 L72 90 L65 40
    C61 38 56 37 50 37 C44 37 39 38 35 40Z
    M28 90 L26 118 L36 118 L42 98 L50 96 L58 98 L64 118 L74 118 L72 90 Z
  `,
  // Cael — upright, composed, squared shoulders
  Cael: `
    M50 4 C40 4 32 12 32 22 C32 32 40 40 50 40 C60 40 68 32 68 22 C68 12 60 4 50 4Z
    M30 42 L22 92 L34 92 L40 72 L50 70 L60 72 L66 92 L78 92 L70 42
    C66 40 59 38 50 38 C41 38 34 40 30 42Z
    M22 92 L20 120 L32 120 L40 100 L50 98 L60 100 L68 120 L80 120 L78 92Z
  `,
  // Riven — wide stance, arms out slightly, dynamic
  Riven: `
    M50 8 C41 8 34 15 34 24 C34 33 41 40 50 40 C59 40 66 33 66 24 C66 15 59 8 50 8Z
    M33 42 L14 86 L26 90 L36 68 L44 72 L50 70 L56 72 L64 68 L74 90 L86 86 L67 42
    C62 40 57 39 50 39 C43 39 38 40 33 42Z
    M26 90 L22 120 L36 120 L44 98 L50 96 L56 98 L64 120 L78 120 L74 90Z
  `,
  // Yara — slight forward lean, attentive, one shoulder raised
  Yara: `
    M50 8 C42 8 36 14 36 22 C36 30 42 36 50 36 C58 36 64 30 64 22 C64 14 58 8 50 8Z
    M37 38 L28 88 L34 90 L40 68 L50 66 L60 68 L66 90 L72 88 L63 38
    C60 36 56 35 50 35 C44 35 40 36 37 38Z
    M28 88 L24 120 L36 120 L44 96 L50 94 L56 96 L64 120 L76 120 L72 88Z
  `,
};

function Silhouette({ id, active, rimColor }) {
  return (
    <svg
      viewBox="0 0 100 128"
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`rim-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={rimColor}     stopOpacity={active ? 0.7 : 0.2} />
          <stop offset="60%"  stopColor={rimColor}     stopOpacity={active ? 0.15 : 0} />
          <stop offset="100%" stopColor="transparent"  stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`rim-r-${id}`} x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor={rimColor}    stopOpacity={active ? 0.4 : 0.1} />
          <stop offset="60%"  stopColor={rimColor}    stopOpacity="0" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Base dark fill */}
      <path d={FIGURE_PATHS[id]} fill="#101024" fillRule="evenodd" />
      {/* Left rim light */}
      <path d={FIGURE_PATHS[id]} fill={`url(#rim-${id})`} fillRule="evenodd" />
      {/* Right rim light */}
      <path d={FIGURE_PATHS[id]} fill={`url(#rim-r-${id})`} fillRule="evenodd" />
    </svg>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────
function Card({ char, selected, onSelect }) {
  const [hov, setHov] = useState(false);
  const active = selected || hov;

  const shadow = selected
    ? `0 0 0 1px ${char.rim}, 0 0 28px ${char.rimAlpha}, 0 12px 32px rgba(0,0,0,0.6)`
    : hov
    ? `0 0 0 1px rgba(255,255,255,0.1), 0 8px 28px rgba(0,0,0,0.5)`
    : `0 0 0 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)`;

  return (
    <button
      style={{
        ...s.card,
        transform:  active ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:  shadow,
        background: selected ? '#0f0f22' : '#0c0c1e',
      }}
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Left rim strip */}
      <div style={{
        ...s.rimStrip,
        background:  active ? char.rim : 'rgba(255,255,255,0.04)',
        boxShadow:   active ? `0 0 10px ${char.rimAlpha}` : 'none',
        opacity:     active ? 1 : 0.5,
      }} />

      {/* Silhouette area */}
      <div style={s.figureWrap}>
        <Silhouette id={char.id} active={active} rimColor={char.rim} />
      </div>

      {/* Card footer */}
      <div style={s.cardFoot}>
        <span style={s.charName}>{char.id.toLowerCase()}</span>
        <span style={{
          ...s.charDesc,
          color: active ? char.rim : 'rgba(255,255,255,0.28)',
        }}>
          {char.descriptor}
        </span>
      </div>
    </button>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────
export default function CharacterSelect() {
  const { setViewerIdentity } = useGame();
  const [selected,   setSelected]   = useState(null);
  const [confirming, setConfirming] = useState(false);

  function handleConfirm() {
    if (!selected || confirming) return;
    setConfirming(true);
    // Fade handled by the parent's FadeIn key-change when viewerIdentity is set
    setTimeout(() => setViewerIdentity(selected), 380);
  }

  return (
    <div style={{ ...s.root, opacity: confirming ? 0 : 1 }}>
      {/* Scanline texture */}
      <div style={s.scanlines} aria-hidden="true" />

      <div style={s.content}>
        <p style={s.prompt}>who are you?</p>

        <div style={s.row}>
          {CHARACTERS.map(c => (
            <Card
              key={c.id}
              char={c}
              selected={selected === c.id}
              onSelect={() => !confirming && setSelected(c.id)}
            />
          ))}
        </div>

        {/* Confirm button — only appears once a card is selected */}
        <div style={s.confirmArea}>
          {selected && (
            <button
              style={{
                ...s.confirmBtn,
                opacity:    confirming ? 0 : 1,
                pointerEvents: confirming ? 'none' : 'auto',
              }}
              onClick={handleConfirm}
            >
              CONFIRM
            </button>
          )}
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    position:       'relative',
    minHeight:      '100vh',
    background:     '#0a0a0f',
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
    fontFamily:     'var(--font-mono)',
    userSelect:     'none',
    transition:     'opacity 0.38s ease',
  },
  scanlines: {
    position:        'absolute',
    inset:           0,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
    pointerEvents:   'none',
    zIndex:          0,
  },
  content: {
    position:       'relative',
    zIndex:         1,
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    gap:            '36px',
    padding:        '48px 20px',
    width:          '100%',
    maxWidth:       '820px',
  },
  prompt: {
    fontSize:      '12px',
    letterSpacing: '0.22em',
    color:         'rgba(255,255,255,0.25)',
    textAlign:     'center',
    margin:        0,
  },
  row: {
    display:        'flex',
    gap:            '14px',
    flexWrap:       'wrap',
    justifyContent: 'center',
  },
  card: {
    position:       'relative',
    width:          '160px',
    height:         '280px',
    borderRadius:   '8px',
    border:         'none',
    cursor:         'pointer',
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    padding:        '0 0 14px',
    transition:     'transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease',
    overflow:       'hidden',
  },
  rimStrip: {
    position:     'absolute',
    left:         0,
    top:          0,
    bottom:       0,
    width:        '3px',
    borderRadius: '8px 0 0 8px',
    transition:   'background 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease',
  },
  figureWrap: {
    flex:    1,
    width:   '100%',
    padding: '18px 14px 8px',
  },
  cardFoot: {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    gap:            '5px',
  },
  charName: {
    fontSize:      '13px',
    fontWeight:    600,
    color:         'rgba(255,255,255,0.82)',
    letterSpacing: '0.1em',
  },
  charDesc: {
    fontSize:      '10px',
    letterSpacing: '0.07em',
    transition:    'color 0.22s ease',
    textAlign:     'center',
  },
  confirmArea: {
    height:         '48px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
  },
  confirmBtn: {
    padding:       '12px 52px',
    fontSize:      '12px',
    letterSpacing: '0.3em',
    fontFamily:    'var(--font-mono)',
    fontWeight:    600,
    color:         'var(--accent)',
    background:    'transparent',
    border:        '1px solid var(--accent)',
    borderRadius:  '2px',
    cursor:        'pointer',
    transition:    'background 0.2s, color 0.2s, opacity 0.2s',
  },
};

const css = `
  .cs-confirm:hover {
    background: var(--accent) !important;
    color: #0a0a0f !important;
  }
`;
