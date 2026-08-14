import { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import wallpaper from '../assets/computer_wallpaper.jpg';
import { playClick } from '../utils/sound';

// ─── Clock / date ─────────────────────────────────────────────────────────────
function useClock() {
  const snap = () => {
    const now  = new Date();
    const hh   = now.getHours().toString().padStart(2, '0');
    const mm   = now.getMinutes().toString().padStart(2, '0');
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    return { time: `${hh}:${mm}`, date };
  };
  const [display, setDisplay] = useState(snap);
  useEffect(() => {
    const iv = setInterval(() => setDisplay(snap()), 1000);
    return () => clearInterval(iv);
  }, []);
  return display;
}

// ─── SVG icons ────────────────────────────────────────────────────────────────
function EmailIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Blue background tile */}
      <rect width="48" height="48" rx="6" fill="#0078D4" />
      {/* Envelope body */}
      <rect x="7" y="12" width="34" height="24" rx="2"
        stroke="#ffffff" strokeWidth="2" fill="none" />
      {/* Flap V-chevron */}
      <polyline points="7,14 24,28 41,14"
        stroke="#ffffff" strokeWidth="2" strokeLinejoin="round"
        strokeLinecap="round" fill="none" />
    </svg>
  );
}
function FilesIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Folder tab (top-left) */}
      <path d="M3 12 Q3 10 5 10 L12 10 Q13.5 10 14.5 11.5 L15.5 13 L29 13 Q31 13 31 15 L31 27 Q31 29 29 29 L3 29 Q1 29 1 27 L1 14 Q1 12 3 12 Z"
        fill="#FFB900" />
      {/* Subtle inner shadow line for depth */}
      <path d="M1 16 L31 16"
        stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
    </svg>
  );
}
function TerminalIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Screen body */}
      <rect x="1" y="3" width="30" height="26" rx="2" fill="#0d0d0d" />
      <rect x="1" y="3" width="30" height="26" rx="2"
        stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* ">" prompt */}
      <polyline points="6,13 11,16 6,19"
        stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        fill="none" />
      {/* Cursor underscore */}
      <line x1="14" y1="20" x2="20" y2="20"
        stroke="#39ff14" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function StartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" fill="#00adef" rx="0.5" />
      <rect x="9" y="1" width="6" height="6" fill="#00adef" rx="0.5" />
      <rect x="1" y="9" width="6" height="6" fill="#00adef" rx="0.5" />
      <rect x="9" y="9" width="6" height="6" fill="#00adef" rx="0.5" />
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5c1.9-1.9 4.5-3 7-3s5.1 1.1 7 3"
        stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 16c.95-.95 2.2-1.5 3.5-1.5s2.55.55 3.5 1.5"
        stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1.2"
        fill="rgba(255,255,255,0.75)" />
    </svg>
  );
}
function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M11 5L6 9H3v6h3l5 4V5z"
        fill="rgba(255,255,255,0.75)" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7"
        stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// ─── App definitions ──────────────────────────────────────────────────────────
const APPS = [
  { id: 'email',    label: 'Email',    Icon: EmailIcon },
  { id: 'files',    label: 'Files',    Icon: FilesIcon },
  { id: 'terminal', label: 'Terminal', Icon: TerminalIcon },
];

// ─── Desktop icon ─────────────────────────────────────────────────────────────
function DesktopIcon({ app, badge, onClick, disabled }) {
  const [hov, setHov] = useState(false);
  const { Icon } = app;
  return (
    <button
      style={{
        ...s.desktopIcon,
        background: hov ? 'rgba(0,120,215,0.30)' : 'transparent',
        border:     hov ? '1px solid rgba(0,120,215,0.55)' : '1px solid transparent',
        outline:    'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      disabled={disabled}
      aria-label={app.label}
    >
      <div style={s.iconImgWrap}>
        <Icon size={36} />
        {badge && <span style={s.badge}>{badge}</span>}
      </div>
      <span style={s.iconLabel}>{app.label}</span>
    </button>
  );
}

// ─── Taskbar app button ───────────────────────────────────────────────────────
function TaskbarBtn({ app, onClick }) {
  const [hov, setHov] = useState(false);
  const { Icon } = app;
  return (
    <button
      style={{
        ...s.taskbarBtn,
        background: hov ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={app.label}
      title={app.label}
    >
      <Icon size={20} />
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ComputerHome() {
  const { state, setApp, setContext } = useGame();
  const [fadingTo, setFadingTo] = useState(null); // appId or 'desk'
  const timerRef = useRef(null);

  const unreadCount = state.emails.filter(e => !e.isRead).length;

  // Always-fresh ref so the keydown listener below can call the latest
  // navigate() without capturing a stale fadingTo closure.
  const navigateRef = useRef(null);
  navigateRef.current = navigate;

  // Escape → desk
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') navigateRef.current('desk');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function navigate(target) {
    if (fadingTo) return;
    playClick();
    setFadingTo(target);
    timerRef.current = setTimeout(() => {
      if (target === 'desk') {
        setContext('desk');
      } else {
        setApp(target);
      }
    }, 420);
  }

  const { time, date } = useClock();

  return (
    <div
      style={s.root}
      onContextMenu={e => e.preventDefault()}
    >
      {/* ── Wallpaper ─────────────────────────────────────────────────────── */}
      <div style={s.wallpaper} />

      {/* ── Desktop icon column ───────────────────────────────────────────── */}
      <div style={s.iconColumn}>
        {APPS.map(app => (
          <DesktopIcon
            key={app.id}
            app={app}
            badge={app.id === 'email' && unreadCount > 0 ? unreadCount : null}
            onClick={() => navigate(app.id)}
            disabled={!!fadingTo}
          />
        ))}
      </div>

      {/* ── Taskbar ───────────────────────────────────────────────────────── */}
      <div style={s.taskbar}>

        {/* Left: Start button + ESC hint */}
        <div style={s.taskbarLeft}>
          <button style={s.startBtn} aria-label="Start" title="Start">
            <StartIcon />
          </button>
          <span style={s.escHint}>ESC — return to desk</span>
        </div>

        {/* Center: open app icons */}
        <div style={s.taskbarCenter}>
          {APPS.map(app => (
            <TaskbarBtn
              key={app.id}
              app={app}
              onClick={() => navigate(app.id)}
            />
          ))}
        </div>

        {/* Right: system tray */}
        <div style={s.tray}>
          <WifiIcon />
          <SpeakerIcon />
          <div style={s.trayDivider} />
          <div style={s.clockBlock}>
            <span style={s.trayTime}>{time}</span>
            <span style={s.trayDate}>{date}</span>
          </div>
        </div>
      </div>

      {/* ── Fade overlay ──────────────────────────────────────────────────── */}
      <div style={{ ...s.fadeOverlay, opacity: fadingTo ? 1 : 0 }} />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    position:      'relative',
    width:         '100vw',
    height:        '100vh',
    display:       'flex',
    flexDirection: 'column',
    overflow:      'hidden',
    userSelect:    'none',
    fontFamily:    "'Segoe UI', 'Arial', sans-serif",
  },

  wallpaper: {
    position:           'absolute',
    inset:              0,
    backgroundImage:    `url(${wallpaper})`,
    backgroundSize:     'cover',
    backgroundPosition: 'center',
    backgroundRepeat:   'no-repeat',
    // subtle fallback gradient in case image is slow to load
    background:         `url(${wallpaper}) center/cover no-repeat, linear-gradient(135deg, #0a0a2e 0%, #1a1a4a 100%)`,
    zIndex:             0,
  },

  // Desktop icon column — top-left, below any notional "menu bar" area
  iconColumn: {
    position:      'absolute',
    top:           '20px',
    left:          '20px',
    display:       'flex',
    flexDirection: 'column',
    gap:           '4px',
    zIndex:        1,
  },

  desktopIcon: {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '5px',
    width:          '72px',
    padding:        '8px 4px 6px',
    borderRadius:   '4px',
    cursor:         'pointer',
    transition:     'background 0.12s ease, border-color 0.12s ease',
  },

  iconImgWrap: {
    position:       'relative',
    width:          '48px',
    height:         '48px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
  },

  badge: {
    position:     'absolute',
    top:          '-4px',
    right:        '-6px',
    minWidth:     '16px',
    height:       '16px',
    borderRadius: '8px',
    background:   '#e81123',
    color:        '#fff',
    fontSize:     '10px',
    fontWeight:   700,
    lineHeight:   '16px',
    textAlign:    'center',
    padding:      '0 3px',
    border:       '2px solid rgba(0,0,0,0.6)',
  },

  iconLabel: {
    fontSize:      '11px',
    color:         '#ffffff',
    textShadow:    '0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.8)',
    textAlign:     'center',
    letterSpacing: '0.01em',
    lineHeight:    1.2,
  },

  // ── Taskbar ──────────────────────────────────────────────────────────────────
  taskbar: {
    position:       'absolute',
    bottom:         0,
    left:           0,
    right:          0,
    height:         '40px',
    background:     'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    display:        'flex',
    alignItems:     'center',
    borderTop:      '1px solid rgba(255,255,255,0.08)',
    zIndex:         10,
    padding:        '0 8px',
  },

  taskbarLeft: {
    display:    'flex',
    alignItems: 'center',
    gap:        '10px',
    flex:       '0 0 auto',
  },

  startBtn: {
    width:          '36px',
    height:         '34px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    background:     'transparent',
    border:         'none',
    cursor:         'pointer',
    borderRadius:   '2px',
    transition:     'background 0.12s ease',
    flexShrink:     0,
  },

  escHint: {
    fontSize:      '9px',
    color:         'rgba(255,255,255,0.22)',
    letterSpacing: '0.06em',
    whiteSpace:    'nowrap',
  },

  taskbarCenter: {
    flex:           1,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '2px',
  },

  taskbarBtn: {
    width:          '44px',
    height:         '34px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    border:         'none',
    borderRadius:   '2px',
    cursor:         'pointer',
    transition:     'background 0.12s ease',
  },

  // ── System tray ──────────────────────────────────────────────────────────────
  tray: {
    display:    'flex',
    alignItems: 'center',
    gap:        '8px',
    flex:       '0 0 auto',
    paddingRight: '4px',
  },

  trayDivider: {
    width:      '1px',
    height:     '18px',
    background: 'rgba(255,255,255,0.15)',
    flexShrink: 0,
  },

  clockBlock: {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'flex-end',
    lineHeight:    1.3,
  },

  trayTime: {
    fontSize:      '11px',
    color:         'rgba(255,255,255,0.88)',
    fontWeight:    500,
    letterSpacing: '0.03em',
  },

  trayDate: {
    fontSize:      '10px',
    color:         'rgba(255,255,255,0.55)',
    letterSpacing: '0.02em',
  },

  // ── Fade overlay ─────────────────────────────────────────────────────────────
  fadeOverlay: {
    position:      'fixed',
    inset:         0,
    background:    '#000',
    pointerEvents: 'none',
    zIndex:        100,
    transition:    'opacity 0.42s ease',
  },
};
