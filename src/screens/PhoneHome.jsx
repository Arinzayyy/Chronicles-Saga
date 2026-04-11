import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { playClick } from '../utils/sound';
import lockBg from '../assets/phone_lockscreen.jpg';
import homeBg from '../assets/phone_homescreen.jpg';

const SYS  = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif';
const MONO = "'Courier New', 'Consolas', monospace";

// Module-level flag — survives re-renders and navigation within the session,
// resets only on full page reload.
let _sessionUnlocked = false;

function pad(n) { return String(n).padStart(2, '0'); }

function fmtTimeFull() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fmtTimeStatus() {
  const d = new Date();
  let h = d.getHours(), m = d.getMinutes();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${pad(m)} ${ap}`;
}
function fmtDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ─── Lock Screen ──────────────────────────────────────────────────────────────
function LockScreen({ onUnlock }) {
  const [time, setTime] = useState(fmtTimeFull);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setTime(fmtTimeFull()), 1000);
    return () => clearInterval(iv);
  }, []);

  function handleClick() {
    if (unlocking) return;
    playClick();
    setUnlocking(true);
    setTimeout(() => {
      _sessionUnlocked = true;
      onUnlock();
    }, 420);
  }

  return (
    <div style={{ ...ls.root, ...(unlocking ? ls.rootUnlocking : {}) }} onClick={handleClick}>
      {/* Background image */}
      <div style={ls.bg} />
      {/* Dark overlay */}
      <div style={ls.overlay} />

      {/* Status bar */}
      <div style={ls.statusBar}>
        <span style={ls.statusTime}>{fmtTimeStatus()}</span>
        <div style={ls.statusRight}>
          <SignalBars />
          <span style={ls.statusBattery}>87%</span>
          <BatteryIcon />
        </div>
      </div>

      {/* Center clock */}
      <div style={ls.center}>
        <div style={ls.clockTime}>{time}</div>
        <div style={ls.clockDate}>{fmtDate()}</div>
      </div>

      {/* Swipe hint */}
      <div style={ls.swipeWrap}>
        <span style={ls.swipeArrow} className="ls-pulse">↑</span>
        <span style={ls.swipeLabel}>swipe to unlock</span>
      </div>

      <style>{`
        .ls-pulse {
          animation: lsPulse 2s ease-in-out infinite;
        }
        @keyframes lsPulse {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

// ─── Phone Home ───────────────────────────────────────────────────────────────
export default function PhoneHome() {
  const { state, setContext, setApp } = useGame();
  const [locked,  setLocked]  = useState(!_sessionUnlocked);
  const [time,    setTime]    = useState(fmtTimeStatus);
  const [fadeOut, setFadeOut] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const id = setInterval(() => setTime(fmtTimeStatus()), 15000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function handleBack() {
    if (fadeOut) return;
    playClick();
    setFadeOut(true);
    timers.current.push(setTimeout(() => setContext('desk'), 500));
  }

  const hasUnread = Object.entries(state.messageThreads)
    .filter(([id]) => id !== '__system__')
    .some(([, msgs]) => msgs.some(m => !m.isRead && !m.isSystem && m.sender !== 'player'));
  const smsBadge = hasUnread || state.beatHistory.length === 0;

  return (
    <div style={s.root}>
      {/* Home screen wallpaper */}
      <div style={s.wallpaper} />
      <div style={s.wallpaperOverlay} />

      {/* Status bar */}
      <div style={s.statusBar}>
        <span style={s.statusTime}>{time}</span>
        <div style={s.statusRight}>
          <SignalBars />
          <span style={s.statusBattery}>87%</span>
          <BatteryIcon />
        </div>
      </div>

      {/* Lock-screen style date/clock */}
      <div style={s.lockInfo}>
        <p style={s.lockDate}>{fmtDate()}</p>
        <p style={s.lockTime}>{time}</p>
      </div>

      {/* App grid */}
      <div style={s.grid}>
        <AppIcon label="Messages" badge={smsBadge} icon={<MsgIcon />}      onClick={() => { playClick(); setApp('sms'); }} />
        <AppIcon label="Photos"                    icon={<PhotosIcon />}   onClick={() => { playClick(); setApp('gallery'); }} />
        <AppIcon label="Settings"                  icon={<SettingsIcon />} onClick={() => { playClick(); setApp('settings'); }} />
      </div>

      {/* Dock */}
      <div style={s.dock}>
        <div style={s.dockShelf}>
          <AppIconSmall badge={smsBadge} icon={<MsgIcon />} onClick={() => { playClick(); setApp('sms'); }} />
        </div>
      </div>

      {/* Home indicator */}
      <div style={s.homeArea} onClick={handleBack} role="button" aria-label="Back to desk">
        <div style={s.homeBar} />
      </div>

      {/* Fade overlay */}
      <div style={{ ...s.fade, opacity: fadeOut ? 1 : 0 }} />

      {/* Lock screen — rendered on top, removed from DOM after unlock */}
      {locked && <LockScreen onUnlock={() => setLocked(false)} />}
    </div>
  );
}

// ─── App icon (large) ────────────────────────────────────────────────────────
function AppIcon({ label, badge, icon, onClick }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div style={s.iconWrap}>
      <button
        style={{ ...s.iconBtn, transform: pressed ? 'scale(0.88)' : 'scale(1)' }}
        onClick={onClick}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
      >
        {icon}
        {badge && <div style={s.badge}><span style={s.badgeNum}>1</span></div>}
      </button>
      <span style={s.iconLabel}>{label}</span>
    </div>
  );
}

// ─── App icon (small, dock) ───────────────────────────────────────────────────
function AppIconSmall({ badge, icon, onClick }) {
  return (
    <button style={s.iconBtnSm} onClick={onClick}>
      {icon}
      {badge && <div style={{ ...s.badge, top: 2, right: 2, width: 14, height: 14 }} />}
    </button>
  );
}

// ─── App icon graphics ────────────────────────────────────────────────────────
function MsgIcon() {
  return (
    <div style={{ ...s.squircle, background: 'linear-gradient(145deg, #30d158 0%, #25a244 100%)' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    </div>
  );
}

function PhotosIcon() {
  return (
    <div style={{ ...s.squircle, background: '#fff', overflow: 'hidden' }}>
      <svg viewBox="0 0 72 72" width="72" height="72">
        {[['#FF9500',0],['#FF3B30',60],['#FF2D55',120],['#AF52DE',180],['#007AFF',240],['#34C759',300]].map(([color, angle]) => (
          <ellipse key={angle} cx="36" cy="18" rx="11" ry="18" fill={color}
            transform={`rotate(${angle} 36 36)`} opacity="0.92" />
        ))}
        <circle cx="36" cy="36" r="13" fill="white" />
      </svg>
    </div>
  );
}

function SettingsIcon() {
  return (
    <div style={{ ...s.squircle, background: 'linear-gradient(145deg, #8e8e93 0%, #48484a 100%)' }}>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="white">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
      </svg>
    </div>
  );
}

// ─── Status bar icons ─────────────────────────────────────────────────────────
function SignalBars() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
      <rect x="0"  y="7" width="3" height="5"  rx="0.8" />
      <rect x="4"  y="4" width="3" height="8"  rx="0.8" />
      <rect x="8"  y="1" width="3" height="11" rx="0.8" />
      <rect x="12" y="0" width="3" height="12" rx="0.8" opacity="0.3" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35" />
      <rect x="2"   y="2"   width="16" height="8"  rx="2"   fill="white" />
      <path d="M23 4v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

// ─── Lock screen styles ───────────────────────────────────────────────────────
const ls = {
  root: {
    position:      'absolute',
    inset:         0,
    zIndex:        50,
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    overflow:      'hidden',
    cursor:        'pointer',
    transition:    'transform 0.42s cubic-bezier(0.4,0,0.2,1), opacity 0.42s ease',
    transform:     'translateY(0)',
    opacity:       1,
  },
  rootUnlocking: {
    transform: 'translateY(-100%)',
    opacity:   0,
  },
  bg: {
    position:           'absolute',
    inset:              0,
    backgroundImage:    `url(${lockBg})`,
    backgroundSize:     'cover',
    backgroundPosition: 'center',
    backgroundRepeat:   'no-repeat',
    // Fallback if image fails to load
    background:         `url(${lockBg}) center/cover no-repeat, linear-gradient(160deg, #0d0d1a, #1a1a3a)`,
    zIndex:             0,
  },
  overlay: {
    position:   'absolute',
    inset:      0,
    background: 'rgba(0,0,0,0.35)',
    zIndex:     1,
  },
  statusBar: {
    position:       'relative',
    zIndex:         2,
    width:          '100%',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '14px 22px 0',
    flexShrink:     0,
  },
  statusTime: {
    fontSize:      '15px',
    fontWeight:    '600',
    color:         '#fff',
    letterSpacing: '0.01em',
  },
  statusRight: {
    display:    'flex',
    alignItems: 'center',
    gap:        '5px',
  },
  statusBattery: {
    fontSize:      '12px',
    fontWeight:    '500',
    color:         'rgba(255,255,255,0.85)',
  },
  center: {
    position:  'relative',
    zIndex:    2,
    flex:      1,
    display:   'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap:       '8px',
  },
  clockTime: {
    fontSize:      'clamp(60px, 15vw, 70px)',
    fontWeight:    '700',
    color:         '#ffffff',
    letterSpacing: '-0.03em',
    lineHeight:    1,
    textShadow:    '0 2px 24px rgba(0,0,0,0.5)',
    fontFamily:    SYS,
  },
  clockDate: {
    fontSize:      '14px',
    fontWeight:    '400',
    color:         'rgba(255,255,255,0.65)',
    letterSpacing: '0.04em',
    fontFamily:    MONO,
  },
  swipeWrap: {
    position:      'relative',
    zIndex:        2,
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    gap:           '6px',
    paddingBottom: '40px',
  },
  swipeArrow: {
    fontSize:   '22px',
    color:      'rgba(255,255,255,0.8)',
    lineHeight: 1,
    display:    'block',
  },
  swipeLabel: {
    fontFamily:    MONO,
    fontSize:      '10px',
    letterSpacing: '0.2em',
    color:         'rgba(255,255,255,0.4)',
    textTransform: 'lowercase',
  },
};

// ─── Home screen styles ───────────────────────────────────────────────────────
const s = {
  root: {
    position:      'relative',
    width:         '100%',
    height:        '100%',
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    overflow:      'hidden',
    fontFamily:    SYS,
    userSelect:    'none',
    color:         '#fff',
  },

  wallpaper: {
    position:           'absolute',
    inset:              0,
    backgroundImage:    `url(${homeBg})`,
    backgroundSize:     'cover',
    backgroundPosition: 'center',
    backgroundRepeat:   'no-repeat',
    background:         `url(${homeBg}) center/cover no-repeat, #0d0d1a`,
    zIndex:             0,
  },
  wallpaperOverlay: {
    position:   'absolute',
    inset:      0,
    background: 'rgba(0,0,0,0.5)',
    zIndex:     0,
    pointerEvents: 'none',
  },

  statusBar: {
    position:       'relative',
    zIndex:         1,
    width:          '100%',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '14px 22px 0',
    flexShrink:     0,
  },
  statusTime: {
    fontSize:      '15px',
    fontWeight:    '600',
    color:         '#fff',
    letterSpacing: '0.01em',
  },
  statusRight: {
    display:    'flex',
    alignItems: 'center',
    gap:        '5px',
  },
  statusBattery: {
    fontSize:      '12px',
    fontWeight:    '500',
    color:         'rgba(255,255,255,0.85)',
  },

  lockInfo: {
    position:  'relative',
    zIndex:    1,
    textAlign: 'center',
    marginTop: '18px',
    flexShrink: 0,
  },
  lockDate: {
    fontSize:      '15px',
    fontWeight:    '500',
    color:         'rgba(255,255,255,0.75)',
    letterSpacing: '0.01em',
    margin:        0,
  },
  lockTime: {
    fontSize:      '56px',
    fontWeight:    '200',
    color:         '#fff',
    letterSpacing: '-0.02em',
    margin:        '2px 0 0',
    lineHeight:    1,
  },

  grid: {
    position:       'relative',
    zIndex:         1,
    flex:           1,
    display:        'flex',
    alignItems:     'flex-start',
    justifyContent: 'center',
    gap:            '20px',
    paddingTop:     '36px',
    flexWrap:       'wrap',
  },

  iconWrap: {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    gap:           '7px',
  },
  iconBtn: {
    position:     'relative',
    background:   'none',
    border:       'none',
    padding:      0,
    cursor:       'pointer',
    transition:   'transform 0.12s ease',
    borderRadius: '16px',
  },
  squircle: {
    width:          '72px',
    height:         '72px',
    borderRadius:   '16px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
    boxShadow:      '0 4px 12px rgba(0,0,0,0.35)',
  },
  iconLabel: {
    fontSize:      '11px',
    fontWeight:    '400',
    color:         'rgba(255,255,255,0.9)',
    textShadow:    '0 1px 3px rgba(0,0,0,0.6)',
    letterSpacing: '0.01em',
  },
  badge: {
    position:       'absolute',
    top:            '-4px',
    right:          '-4px',
    width:          '18px',
    height:         '18px',
    borderRadius:   '50%',
    background:     '#FF3B30',
    border:         '2px solid rgba(0,0,0,0.4)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
  },
  badgeNum: {
    fontSize:   '10px',
    fontWeight: '700',
    color:      '#fff',
  },

  dock: {
    position:       'relative',
    zIndex:         1,
    width:          '100%',
    display:        'flex',
    justifyContent: 'center',
    paddingBottom:  '6px',
    flexShrink:     0,
  },
  dockShelf: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '16px',
    background:     'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius:   '22px',
    padding:        '10px 18px',
    border:         '1px solid rgba(255,255,255,0.1)',
  },
  iconBtnSm: {
    position:     'relative',
    background:   'none',
    border:       'none',
    padding:      0,
    cursor:       'pointer',
    borderRadius: '14px',
  },

  homeArea: {
    position:       'relative',
    zIndex:         1,
    width:          '100%',
    display:        'flex',
    justifyContent: 'center',
    alignItems:     'center',
    padding:        '8px 0 14px',
    cursor:         'pointer',
    flexShrink:     0,
  },
  homeBar: {
    width:        '120px',
    height:       '5px',
    borderRadius: '3px',
    background:   'rgba(255,255,255,0.3)',
  },

  fade: {
    position:   'fixed',
    inset:      0,
    background: '#000',
    pointerEvents: 'none',
    zIndex:     100,
    transition: 'opacity 0.5s ease',
  },
};
