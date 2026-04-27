import { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useEngine } from '../context/EngineContext';
import { playClick } from '../utils/sound';
import deskPhoto from '../assets/desk.jpg';

// ─── Image-space hotspot definitions ─────────────────────────────────────────
// Coordinates are fractions of the SOURCE IMAGE dimensions (2237 × 1571 px).
// These are pixel-verified against desk.jpg and never need to change when the
// viewport or window size changes — the useCoverRects hook handles that maths.
//
//  monitor : screen runs  x 23.1%→70.0%,  y  9.9%→27.4%
//  phone   : body runs    x 17.9%→27.7%,  y 19.7%→38%   (generous for click area)
const IMG_W = 2237;
const IMG_H = 1571;

const HOTSPOTS_IMG = {
  monitor: { x: 0.341, y: 0.173, w: 0.344, h: 0.245 },
  phone:   { x: 0.246, y: 0.363, w: 0.078, h: 0.136 },
};

// ─── useCoverRects ────────────────────────────────────────────────────────────
// Converts image-space rects to viewport-space CSS values, correctly accounting
// for objectFit: cover cropping at any window size.  Re-runs on every resize.
function useCoverRects(containerRef) {
  const [rects, setRects] = useState({});

  const recalculate = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const vw = el.clientWidth;
    const vh = el.clientHeight;

    // objectFit: cover scales so both dimensions are >= viewport
    const scale = Math.max(vw / IMG_W, vh / IMG_H);

    const renderedW = IMG_W * scale;
    const renderedH = IMG_H * scale;

    // How many rendered pixels are hidden on each axis (centred crop)
    const cropX = (renderedW - vw) / 2;
    const cropY = (renderedH - vh) / 2;

    const next = {};
    for (const [key, h] of Object.entries(HOTSPOTS_IMG)) {
      // Convert image-fraction → rendered pixels → subtract crop → viewport %
      const left   = (h.x * renderedW - cropX) / vw * 100;
      const top    = (h.y * renderedH - cropY) / vh * 100;
      const width  = h.w * renderedW / vw * 100;
      const height = h.h * renderedH / vh * 100;

      next[key] = {
        left:   `${left.toFixed(2)}%`,
        top:    `${top.toFixed(2)}%`,
        width:  `${width.toFixed(2)}%`,
        height: `${height.toFixed(2)}%`,
      };
    }
    setRects(next);
  }, [containerRef]);

  useEffect(() => {
    recalculate();
    window.addEventListener('resize', recalculate);
    return () => window.removeEventListener('resize', recalculate);
  }, [recalculate]);

  return rects;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DeskScene() {
  const { state, setContext, setApp } = useGame();
  const engine = useEngine();

  const [phoneHover,    setPhoneHover]    = useState(false);
  const [monitorHover,  setMonitorHover]  = useState(false);
  const [zoomedHotspot, setZoomedHotspot] = useState(null);
  const [fadeOut,       setFadeOut]       = useState(false);

  const rootRef      = useRef(null);
  const timers       = useRef([]);
  const transitioning = useRef(false);

  // Pixel-perfect hotspot rects, recalculated on every resize
  const rects = useCoverRects(rootRef);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  function triggerTransition(hotspotKey, action) {
    if (transitioning.current) return;
    transitioning.current = true;
    setZoomedHotspot(hotspotKey);
    timers.current.push(setTimeout(() => setFadeOut(true), 200));
    timers.current.push(setTimeout(() => action(), 600));
  }

  function handlePhoneClick() {
    playClick();
    triggerTransition('phone', () => {
      setContext('phone');
      if (state.currentBeat) setApp('sms');
    });
  }

  function handleMonitorClick() {
    playClick();
    triggerTransition('monitor', () => setContext('computer'));
  }

  return (
    <div ref={rootRef} style={s.root}>

      {/* ── Photo background ──────────────────────────────────────────── */}
      <img
        src={deskPhoto}
        alt=""
        aria-hidden="true"
        style={s.photo}
        draggable={false}
      />

      {/* ── Dark mood overlay ─────────────────────────────────────────── */}
      <div style={s.overlay} />

      {/* ── Monitor hotspot ───────────────────────────────────────────── */}
      <button
        style={{
          ...s.hotspot,
          ...rects.monitor,
          ...(monitorHover && !transitioning.current ? s.hotspotActive : {}),
          transform: zoomedHotspot === 'monitor' ? 'scale(1.08)' : 'scale(1)',
        }}
        onClick={handleMonitorClick}
        onMouseEnter={() => setMonitorHover(true)}
        onMouseLeave={() => setMonitorHover(false)}
        aria-label="Check the monitor"
        disabled={transitioning.current}
      >
        {monitorHover && !transitioning.current && (
          <span style={s.hotspotLabel}>[ open ]</span>
        )}
      </button>

      {/* ── Phone hotspot ─────────────────────────────────────────────── */}
      <button
        style={{
          ...s.hotspot,
          ...rects.phone,
          ...(phoneHover && !transitioning.current ? s.hotspotActive : {}),
          transform: zoomedHotspot === 'phone' ? 'scale(1.08)' : 'scale(1)',
        }}
        onClick={handlePhoneClick}
        onMouseEnter={() => setPhoneHover(true)}
        onMouseLeave={() => setPhoneHover(false)}
        aria-label="Pick up the phone"
        disabled={transitioning.current}
      >
        {phoneHover && !transitioning.current && (
          <span style={s.hotspotLabel}>[ pick up ]</span>
        )}
      </button>

      {/* ── Vignette ──────────────────────────────────────────────────── */}
      <div style={s.vignette} />

      {/* ── Ambient text ──────────────────────────────────────────────── */}
      <p style={s.ambientText}>
        [ another morning. the monitor is on. ]
      </p>

      {/* ── Fade-to-black overlay ─────────────────────────────────────── */}
      <div style={{ ...s.fadeOverlay, opacity: fadeOut ? 1 : 0 }} />

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#0a0a0f',
    userSelect: 'none',
  },

  photo: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    objectPosition: 'center center',
    display: 'block',
    zIndex: 0,
  },

  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.45)',
    zIndex: 1,
  },

  hotspot: {
    position: 'absolute',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: 2,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '10px',
    transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
  },

  hotspotActive: {
    background: 'rgba(255, 255, 255, 0.08)',
  },

  hotspotLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.15em',
    color: 'rgba(200, 200, 240, 0.8)',
    textShadow: '0 0 8px rgba(124,92,252,0.6)',
    pointerEvents: 'none',
  },

  vignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.6) 100%)',
    pointerEvents: 'none',
    zIndex: 3,
  },

  ambientText: {
    position: 'absolute',
    bottom: '22px',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'rgba(120, 120, 160, 0.55)',
    letterSpacing: '0.12em',
    pointerEvents: 'none',
    zIndex: 4,
    margin: 0,
  },

  fadeOverlay: {
    position: 'fixed',
    inset: 0,
    background: '#000',
    pointerEvents: 'none',
    zIndex: 100,
    transition: 'opacity 0.4s ease',
  },
};
