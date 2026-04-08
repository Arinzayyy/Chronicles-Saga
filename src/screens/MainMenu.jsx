import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import storyData from '../data/story.json';

export default function MainMenu() {
  const { startGame } = useGame();
  const [visible, setVisible] = useState(false);
  const [glitch, setGlitch]   = useState(false);

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Periodic glitch pulse on the subtitle
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  function handleBegin() {
    startGame(); // transitions to 'playing'; beat is loaded when player opens phone
  }

  return (
    <div style={styles.root} className={visible ? 'mm-visible' : ''}>
      {/* Scanline overlay */}
      <div style={styles.scanlines} aria-hidden="true" />

      <div style={styles.content}>
        {/* Top signal indicator */}
        <div style={styles.signal}>
          <span style={styles.signalDot} />
          <span style={styles.signalText}>INCOMING SIGNAL</span>
        </div>

        {/* Title */}
        <h1 style={styles.title}>
          CHRONICLES<br />
          <span style={styles.titleAccent}>SAGA</span>
        </h1>

        {/* Subtitle */}
        <p style={{ ...styles.subtitle, ...(glitch ? styles.subtitleGlitch : {}) }}>
          a signal in the dark
        </p>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Attribution line */}
        <p style={styles.attribution}>
          [ interactive narrative / v0.1 ]
        </p>

        {/* Begin button */}
        <button style={styles.beginBtn} onClick={handleBegin}>
          BEGIN
        </button>

        {/* Footer hint */}
        <p style={styles.hint}>
          your choices shape the signal
        </p>
      </div>

      <style>{`
        .mm-visible {
          animation: mmFadeIn 1.2s ease forwards;
        }
        @keyframes mmFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        button.begin-btn:hover {
          background: var(--accent) !important;
          color: var(--bg) !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    opacity: 0,
    overflow: 'hidden',
  },

  scanlines: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '48px 24px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
  },

  signal: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  signalDot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--success)',
    boxShadow: '0 0 6px var(--success)',
    animation: 'pulse 2s ease-in-out infinite',
  },

  signalText: {
    fontSize: '11px',
    letterSpacing: '0.2em',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },

  title: {
    fontSize: 'clamp(48px, 10vw, 80px)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.0,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    margin: 0,
  },

  titleAccent: {
    color: 'var(--accent)',
    display: 'inline-block',
  },

  subtitle: {
    fontSize: '13px',
    letterSpacing: '0.25em',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    transition: 'opacity 0.05s, color 0.05s',
  },

  subtitleGlitch: {
    color: 'var(--accent)',
    opacity: 0.7,
    textShadow: '2px 0 var(--danger), -2px 0 var(--accent)',
  },

  divider: {
    width: '60px',
    height: '1px',
    background: 'var(--border)',
  },

  attribution: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    letterSpacing: '0.1em',
    fontFamily: 'var(--font-mono)',
  },

  beginBtn: {
    marginTop: '8px',
    padding: '14px 48px',
    fontSize: '13px',
    letterSpacing: '0.3em',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--accent)',
    background: 'transparent',
    border: '1px solid var(--accent)',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
    boxShadow: '0 0 0 transparent',
  },

  hint: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    letterSpacing: '0.1em',
    fontFamily: 'var(--font-mono)',
  },
};
