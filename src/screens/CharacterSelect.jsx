import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { playClick } from '../utils/sound';
import ch1 from '../assets/viewer_select/CH1.png';
import ch2 from '../assets/viewer_select/CH2.png';
import ch3 from '../assets/viewer_select/CH3.png';
import ch4 from '../assets/viewer_select/CH4.png';

// ─── Character definitions ─────────────────────────────────────────────────
const CHARACTERS = [
  {
    id:         'Dara',
    descriptor: 'always the last one home.',
    rim:        '#E94560',
    rimAlpha:   'rgba(233, 69, 96, 0.45)',
    image:      ch1,
  },
  {
    id:         'Zael',
    descriptor: 'dirt road logic. somehow works.',
    rim:        '#BA7517',
    rimAlpha:   'rgba(186, 117, 23, 0.45)',
    image:      ch2,
  },
  {
    id:         'Seun',
    descriptor: 'huh. ...oh. huh.',
    rim:        '#EF9F27',
    rimAlpha:   'rgba(239, 159, 39, 0.45)',
    image:      ch3,
  },
  {
    id:         'Fox',
    descriptor: "designer bag. don't touch it.",
    rim:        '#9B59B6',
    rimAlpha:   'rgba(155, 89, 182, 0.45)',
    image:      ch4,
  },
];

// ─── Card ──────────────────────────────────────────────────────────────────
function Card({ char, selected, onSelect }) {
  const [hov, setHov] = useState(false);
  const active = selected || hov;

  const shadow = selected
    ? `0 0 0 1px ${char.rim}, 0 0 36px ${char.rimAlpha}, 0 12px 32px rgba(0,0,0,0.6)`
    : hov
    ? `0 0 0 1px rgba(255,255,255,0.1), 0 8px 28px rgba(0,0,0,0.5)`
    : `0 0 0 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)`;

  return (
    <button
      style={{
        ...s.card,
        transform: active ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: shadow,
        background: selected ? '#0f0f22' : '#0c0c1e',
        // Selected state: thin colored border on top of the card outline
        outline: selected ? `1.5px solid ${char.rim}` : 'none',
        outlineOffset: '-1px',
      }}
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Left rim strip */}
      <div style={{
        ...s.rimStrip,
        background: active ? char.rim : 'rgba(255,255,255,0.04)',
        boxShadow:  active ? `0 0 10px ${char.rimAlpha}` : 'none',
        opacity:    active ? 1 : 0.5,
      }} />

      {/* Portrait image — fills top ~80% of card */}
      <div style={s.portraitWrap}>
        <img
          src={char.image}
          alt={char.id}
          style={{
            ...s.portrait,
            transform: hov ? 'scale(1.03)' : 'scale(1)',
          }}
          draggable={false}
        />
        {/* Subtle bottom fade so image blends into footer */}
        <div style={{
          ...s.portraitFade,
          background: `linear-gradient(to bottom, transparent 55%, ${selected ? '#0f0f22' : '#0c0c1e'} 100%)`,
        }} />
        {/* Rim-light overlay on the image edges when active */}
        {active && (
          <div style={{
            ...s.portraitRimOverlay,
            boxShadow: `inset 3px 0 18px ${char.rimAlpha}, inset -2px 0 10px ${char.rimAlpha}`,
          }} />
        )}
      </div>

      {/* Card footer — name + descriptor */}
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
    playClick();
    setConfirming(true);
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
              onSelect={() => { if (!confirming) { playClick(); setSelected(c.id); } }}
            />
          ))}
        </div>

        {/* Confirm button — only appears once a card is selected */}
        <div style={s.confirmArea}>
          {selected && (
            <button
              className="cs-confirm"
              style={{
                ...s.confirmBtn,
                opacity:       confirming ? 0 : 1,
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

  // Card
  card: {
    position:      'relative',
    width:         '160px',
    height:        '280px',
    borderRadius:  '8px',
    border:        'none',
    cursor:        'pointer',
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    padding:       '0 0 14px',
    transition:    'transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease, outline 0.22s ease',
    overflow:      'hidden', // keeps image scale from bleeding out
  },
  rimStrip: {
    position:     'absolute',
    left:         0,
    top:          0,
    bottom:       0,
    width:        '3px',
    borderRadius: '8px 0 0 8px',
    zIndex:       2,
    transition:   'background 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease',
  },

  // Portrait image area — top 80% of card
  portraitWrap: {
    position:   'relative',
    width:      '100%',
    flex:       '0 0 80%',   // exactly 80% of card height
    overflow:   'hidden',
  },
  portrait: {
    width:          '100%',
    height:         '100%',
    objectFit:      'cover',
    objectPosition: 'center top',
    display:        'block',
    transition:     'transform 0.3s ease',
    transformOrigin: 'center top',
  },
  // Gradient fade at bottom of portrait into card background
  portraitFade: {
    position:   'absolute',
    bottom:     0,
    left:       0,
    right:      0,
    height:     '60%',
    pointerEvents: 'none',
  },
  // Inset rim light overlay on the image
  portraitRimOverlay: {
    position:      'absolute',
    inset:         0,
    pointerEvents: 'none',
    borderRadius:  0,
  },

  // Card footer — bottom 20%
  cardFoot: {
    flex:           '0 0 auto',
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    gap:            '5px',
    paddingTop:     '6px',
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
