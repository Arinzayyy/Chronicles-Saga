import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

/**
 * NarrationOverlay — the Viewer's inner voice.
 *
 * Renders the current beat's narration lines as a dim, cinematic strip over
 * whatever screen is active. The device never disappears — the overlay sits
 * on top, screen dimmed underneath. Lines fade in as the engine pushes them,
 * and the whole strip clears when the beat changes (GameContext resets
 * state.narration on SET_BEAT).
 *
 * Rogue lines (the Admin-flavored narration twist) render IDENTICALLY on
 * purpose — see CH7 conversion notes. The `rogue` flag exists only for
 * later seasons to exploit.
 */
export default function NarrationOverlay() {
  const { state } = useGame();
  const lines = state.narration ?? [];
  const [visibleIds, setVisibleIds] = useState(() => new Set());

  useEffect(() => {
    if (lines.length === 0) {
      setVisibleIds(new Set());
      return;
    }
    // Newly arrived lines fade in after mount
    const pending = lines.filter(l => !visibleIds.has(l.id));
    if (pending.length === 0) return;
    const t = requestAnimationFrame(() => {
      setVisibleIds(prev => {
        const next = new Set(prev);
        for (const l of pending) next.add(l.id);
        return next;
      });
    });
    return () => cancelAnimationFrame(t);
  }, [lines]); // eslint-disable-line react-hooks/exhaustive-deps

  if (lines.length === 0) return null;

  // The side panel is tall, so we can keep a few more lines in view; older
  // lines stay readable while new ones fade in beneath them.
  const shown = lines.slice(-6);

  return (
    <div style={s.container} aria-live="polite">
      <div style={s.strip}>
        {shown.map(line => (
          <p
            key={line.id}
            style={{
              ...s.line,
              opacity:   visibleIds.has(line.id) ? 1 : 0,
              transform: visibleIds.has(line.id) ? 'translateY(0)' : 'translateY(6px)',
            }}
          >
            {line.body}
          </p>
        ))}
      </div>
    </div>
  );
}

const s = {
  // Anchored to the left "desk" margin, vertically centred, and stopped well
  // short of the phone: the phone is at most ~191px half-width (height 830 ×
  // 393/852 ÷ 2), so a right edge at calc(50% + 220px) always clears it.
  // On narrow viewports the panel simply shrinks (and vanishes) rather than
  // ever overlapping the device.
  container: {
    position:      'fixed',
    left:          '24px',
    right:         'calc(50% + 220px)',
    top:           0,
    bottom:        0,
    zIndex:        40,
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'flex-start',
    justifyContent:'center',
    pointerEvents: 'none',
    padding:       '0',
  },
  strip: {
    maxWidth:             '460px',
    width:                '100%',
    background:           'linear-gradient(135deg, rgba(5,5,8,0.0) 0%, rgba(5,5,8,0.42) 18%, rgba(5,5,8,0.52) 100%)',
    borderRadius:         '14px',
    padding:              '22px 24px',
    backdropFilter:       'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
  },
  line: {
    margin:        '0 0 14px',
    fontSize:      '15px',
    lineHeight:    1.6,
    fontStyle:     'italic',
    letterSpacing: '0.01em',
    color:         'rgba(235,235,245,0.9)',
    textAlign:     'left',
    textShadow:    '0 1px 10px rgba(0,0,0,0.95)',
    transition:    'opacity 0.9s ease, transform 0.9s ease',
  },
};
