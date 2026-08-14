// ─── Phone OS theme tokens ───────────────────────────────────────────────────
// Shared design language for the in-game phone. "Persona bones": heavy type,
// red/black/white, hard shadows, angular chrome — NOT iOS. The haunted layer
// (Phase 4) reuses RED + GLITCH on top of these for supernatural beats.

export const PHONE = {
  // palette
  RED:       '#d3132e',
  RED_DEEP:  '#8c0d1f',
  TEAL:      '#19b8b4',
  INK:       '#08080c',
  STEEL:     '#16161c',
  STEEL_HI:  '#24242c',
  PAPER:     '#f4f1ea',   // off-white for high-contrast panels
  WHITE:     '#ffffff',
  MUTE:      'rgba(255,255,255,0.5)',
  FAINT:     'rgba(255,255,255,0.16)',

  // type
  HEAVY: "'Anton', 'Archivo Black', 'Arial Black', Impact, sans-serif",
  COND:  "'Oswald', 'Archivo Narrow', 'Arial Narrow', sans-serif",
  MONO:  "'Courier New', 'Consolas', monospace",

  // shape — angular, low radius (no iОS squircles)
  RADIUS_TILE:  '6px',
  RADIUS_PANEL: '4px',
  SKEW: 'skewX(-7deg)',

  // shadows
  HARD:  '3px 3px 0 #000',
  HARD2: '5px 6px 0 #000',
};

// Hard outlined-text treatment used for headers / labels across the OS.
export function outlinedText(stroke = '2px') {
  return {
    color: PHONE.WHITE,
    WebkitTextStroke: `${stroke} #000`,
    paintOrder: 'stroke fill',
    textShadow: '2px 2px 0 #000',
  };
}
