import { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useEngine } from '../context/EngineContext';
import { playClick } from '../utils/sound';
import deskPhoto from '../assets/desk.jpg';

// ─── Hotspot geometry ─────────────────────────────────────────────────────────
const HOTSPOTS = {
  monitor: {
    top:    '0%',
    left:   '18%',
    width:  '62%',
    height: '48%',
  },
  phone: {
    top:    '58%',
    left:   '74%',
    width:  '14%',
    height: '40%',
  },
};

export default function DeskScene() {
  const { state, setContext, setApp } = useGame();
  const engine = useEngine();

  const [phoneHover,    setPhoneHover]    = useState(false);
  const [monitorHover,  setMonitorHover]  = useState(false);
  const [zoomedHotspot, setZoomedHotspot] = useState(null);  // 'monitor' | 'phone' | null
  const [fadeOut,       setFadeOut]       = useState(false); // drives black overlay opacity

  const timers = useRef([]);
  // Prevent double-firing if both hotspots somehow clicked
  const transitioning = useRef(false);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  function triggerTransition(hotspotKey, action) {
    if (transitioning.current) return;
    transitioning.current = true;

    // Step 1 (0ms): scale the hotspot to 1.08
    setZoomedHotspot(hotspotKey);

    // Step 2 (200ms): zoom settles → start fade to black
    timers.current.push(setTimeout(() => {
      setFadeOut(true);
    }, 200));

    // Step 3 (600ms): fade complete → switch context
    timers.current.push(setTimeout(() => {
      action();
    }, 600));
  }

  function handlePhoneClick() {
    playClick();
    triggerTransition('phone', () => {
      setContext('phone');
      // If a beat is already in progress, return directly to SMS conversation.
      // Otherwise land on PhoneHome so the player can tap in naturally.
      if (state.currentBeat) {
        setApp('sms');
      }
    });
  }

  function handleMonitorClick() {
    playClick();
    triggerTransition('monitor', () => {
      // setContext resets currentApp to null → ComputerHome renders
      setContext('computer');
    });
  }

  return (
    <div style={s.root}>

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
          ...HOTSPOTS.monitor,
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
          ...HOTSPOTS.phone,
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
      <div
        style={{
          ...s.fadeOverlay,
          opacity: fadeOut ? 1 : 0,
        }}
      />

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
    // All three properties animated together
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

  // Sits above everything — fades from 0→1 over 400ms to black out the scene
  fadeOverlay: {
    position: 'fixed',
    inset: 0,
    background: '#000',
    pointerEvents: 'none',
    zIndex: 100,
    transition: 'opacity 0.4s ease',
  },
};
