import { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';

// ─── App definitions ───────────────────────────────────────────────────────
const APPS = [
  {
    id:    'email',
    label: 'Email',
    color: '#0f1a2e',
    icon:  <EmailIcon />,
    iconColor: '#5c8afc',
  },
  {
    id:    'files',
    label: 'Files',
    color: '#1a1a0f',
    icon:  <FilesIcon />,
    iconColor: '#d4a847',
  },
  {
    id:    'terminal',
    label: 'Terminal',
    color: '#0a140a',
    icon:  <TerminalIcon />,
    iconColor: '#39ff14',
  },
];

export default function ComputerHome() {
  const { state, setApp, setContext } = useGame();
  const [fadeOut, setFadeOut] = useState(false);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function handleBack() {
    if (fadeOut) return;
    setFadeOut(true);
    timers.current.push(setTimeout(() => setContext('desk'), 500));
  }

  function handleAppClick(appId) {
    if (fadeOut) return;
    setApp(appId);
  }

  // Unread email badge
  const hasUnread = state.emails.some(e => !e.isRead);

  return (
    <div style={s.root}>
      {/* Scanline overlay */}
      <div style={s.scanlines} aria-hidden="true" />

      {/* Desktop area */}
      <div style={s.desktop}>
        <div style={s.appGrid}>
          {APPS.map(app => (
            <DesktopIcon
              key={app.id}
              app={app}
              badge={app.id === 'email' && hasUnread}
              onClick={() => handleAppClick(app.id)}
            />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={s.bottomBar}>
        <button style={s.backBtn} onClick={handleBack} aria-label="Back to desk">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 14L6 9l5-5" />
          </svg>
          <span style={s.backLabel}>desk</span>
        </button>

        <div style={s.statusCluster}>
          <span style={s.statusDot} />
          <span style={s.statusText}>CONNECTED</span>
        </div>
      </div>

      {/* Fade-to-black */}
      <div style={{ ...s.fadeOverlay, opacity: fadeOut ? 1 : 0 }} />
    </div>
  );
}

function DesktopIcon({ app, badge, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{
        ...s.iconBtn,
        background: app.color,
        transform:  hov ? 'scale(0.93)' : 'scale(1)',
        boxShadow:  hov
          ? '0 0 0 1px rgba(255,255,255,0.12), 0 8px 24px rgba(0,0,0,0.5)'
          : '0 0 0 1px rgba(255,255,255,0.06)',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={app.label}
    >
      <span style={{ ...s.iconGlyph, color: app.iconColor }}>{app.icon}</span>
      {badge && <div style={s.badge} />}
      <span style={s.iconLabel}>{app.label}</span>
    </button>
  );
}

// ─── SVG icons ────────────────────────────────────────────────────────────
function EmailIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function FilesIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h7l2 2h7v14H4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function TerminalIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 9l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    position:      'relative',
    width:         '100vw',
    height:        '100vh',
    background:    '#0d0d14',
    display:       'flex',
    flexDirection: 'column',
    overflow:      'hidden',
    fontFamily:    'var(--font-mono)',
    userSelect:    'none',
  },
  scanlines: {
    position:        'absolute',
    inset:           0,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)',
    pointerEvents:   'none',
    zIndex:          0,
  },
  desktop: {
    flex:           1,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    position:       'relative',
    zIndex:         1,
  },
  appGrid: {
    display:        'flex',
    gap:            '24px',
    flexWrap:       'wrap',
    justifyContent: 'center',
    padding:        '20px',
  },
  iconBtn: {
    position:       'relative',
    width:          '90px',
    height:         '90px',
    borderRadius:   '14px',
    border:         'none',
    cursor:         'pointer',
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '0',
    transition:     'transform 0.14s ease, box-shadow 0.14s ease',
    padding:        '0 0 6px',
  },
  iconGlyph: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    flex:           1,
  },
  badge: {
    position:     'absolute',
    top:          '8px',
    right:        '8px',
    width:        '10px',
    height:       '10px',
    borderRadius: '50%',
    background:   '#ff3b30',
    border:       '2px solid #0d0d14',
  },
  iconLabel: {
    fontSize:      '11px',
    color:         'rgba(255,255,255,0.55)',
    letterSpacing: '0.06em',
    paddingBottom: '4px',
  },

  bottomBar: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '12px 24px 28px',
    borderTop:      '1px solid rgba(255,255,255,0.05)',
    position:       'relative',
    zIndex:         1,
    flexShrink:     0,
  },
  backBtn: {
    display:       'flex',
    alignItems:    'center',
    gap:           '6px',
    background:    'none',
    border:        'none',
    cursor:        'pointer',
    color:         'rgba(255,255,255,0.45)',
    padding:       '6px 8px',
    borderRadius:  '4px',
    transition:    'color 0.15s',
    fontSize:      '12px',
  },
  backLabel: {
    letterSpacing: '0.12em',
  },

  statusCluster: {
    display:    'flex',
    alignItems: 'center',
    gap:        '6px',
  },
  statusDot: {
    display:      'inline-block',
    width:        '6px',
    height:       '6px',
    borderRadius: '50%',
    background:   'var(--success)',
    boxShadow:    '0 0 6px var(--success)',
    animation:    'pulse 2.4s ease-in-out infinite',
  },
  statusText: {
    fontSize:      '10px',
    letterSpacing: '0.18em',
    color:         'rgba(255,255,255,0.2)',
  },

  fadeOverlay: {
    position:   'fixed',
    inset:      0,
    background: '#000',
    pointerEvents: 'none',
    zIndex:     100,
    transition: 'opacity 0.5s ease',
  },
};
