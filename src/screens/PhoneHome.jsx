import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { playClick } from '../utils/sound';
import lockBg from '../assets/phone_lockscreen.jpg';
import homeBg from '../assets/phone_homescreen.jpg';
import { PHONE } from './phoneTheme';

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
function LockScreen({ onUnlock, notifs = [] }) {
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

  const hasNotifs = notifs.length > 0;

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

      {/* Notification stack — what the player woke up to */}
      {hasNotifs && (
        <div style={ls.notifWrap}>
          <div style={ls.notifCountRow}>
            <span style={ls.notifCount}>
              {notifs.length} notification{notifs.length === 1 ? '' : 's'}
            </span>
          </div>
          {notifs.map((n, i) => (
            <div
              key={n.id ?? i}
              style={{
                ...ls.notifCard,
                // Older cards tuck slightly behind, iOS-stack style
                opacity: 1 - Math.max(0, notifs.length - 1 - i) * 0.04,
              }}
            >
              <div style={ls.notifIcon}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
              <div style={ls.notifBody}>
                <div style={ls.notifTopRow}>
                  <span style={ls.notifApp}>MESSAGES</span>
                  <span style={ls.notifWhen}>now</span>
                </div>
                <p style={ls.notifTitle}>{n.title}</p>
                {n.body ? <p style={ls.notifText}>{n.body}</p> : null}
              </div>
            </div>
          ))}
        </div>
      )}

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
  // The story parks the player on the lock screen via app === 'lockscreen';
  // keep it locked there regardless of the session-unlock flag.
  const forceLock = state.currentApp === 'lockscreen';
  const [locked,  setLocked]  = useState(forceLock || !_sessionUnlocked);
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
      {locked && (
        <LockScreen
          onUnlock={() => setLocked(false)}
          notifs={state.flags?.__lockNotifs__ ?? []}
          locked={forceLock}
        />
      )}
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
  const [pressed, setPressed] = useState(false);
  return (
    <button
      style={{ ...s.iconBtnSm, transform: pressed ? 'scale(0.88)' : 'scale(1)', transition: 'transform 0.12s ease' }}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      {icon}
      {badge && <div style={{ ...s.badge, top: 2, right: 2, width: 14, height: 14 }} />}
    </button>
  );
}

// ─── App icon graphics — angular Persona tiles ────────────────────────────────
// A slanted-corner dark tile with an accent inner border, a corner slash, and a
// bold white glyph. Nothing iOS about it.
function Tile({ accent, children }) {
  return (
    <div style={{ ...s.tile, boxShadow: `inset 0 0 0 2px ${accent}, 0 5px 0 #000, 0 8px 16px rgba(0,0,0,0.55)` }}>
      <div style={{ ...s.tileSlash, borderTopColor: accent }} />
      {children}
    </div>
  );
}

function MsgIcon() {
  return (
    <Tile accent={PHONE.RED}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="#fff">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    </Tile>
  );
}

function PhotosIcon() {
  return (
    <Tile accent={PHONE.TEAL}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7">
        <rect x="3" y="4" width="18" height="16" rx="1" />
        <circle cx="8.5" cy="9" r="1.6" fill="#fff" stroke="none" />
        <path d="M21 16l-5-5L5 20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Tile>
  );
}

function SettingsIcon() {
  return (
    <Tile accent="#9aa0aa">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <line x1="5" y1="7"  x2="19" y2="7" />
        <line x1="5" y1="12" x2="19" y2="12" />
        <line x1="5" y1="17" x2="19" y2="17" />
        <circle cx="9"  cy="7"  r="2.2" fill="#0b0b0f" />
        <circle cx="15" cy="12" r="2.2" fill="#0b0b0f" />
        <circle cx="8"  cy="17" r="2.2" fill="#0b0b0f" />
      </svg>
    </Tile>
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
    background: 'linear-gradient(170deg, rgba(6,6,10,0.5) 0%, rgba(6,6,10,0.8) 100%)',
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
    fontFamily:      PHONE.HEAVY,
    fontSize:        'clamp(58px, 15vw, 76px)',
    fontWeight:      400,
    color:           '#fff',
    letterSpacing:   '0.01em',
    lineHeight:      0.88,
    transform:       'skewX(-7deg)',
    WebkitTextStroke:'2px #000',
    paintOrder:      'stroke fill',
    textShadow:      `3px 3px 0 #000, 0 0 30px ${PHONE.RED}66`,
  },
  clockDate: {
    fontFamily:    PHONE.MONO,
    fontSize:      '12px',
    fontWeight:    400,
    color:         'rgba(255,255,255,0.7)',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
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
    fontFamily:    PHONE.MONO,
    fontSize:      '10px',
    letterSpacing: '0.28em',
    color:         'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
  },

  // ── Notification stack ──────────────────────────────────────────────────
  notifWrap: {
    position:      'relative',
    zIndex:        2,
    width:         '100%',
    padding:       '0 12px',
    display:       'flex',
    flexDirection: 'column',
    gap:           '8px',
    maxHeight:     '46%',
    overflowY:     'auto',
    marginBottom:  '10px',
  },
  notifCountRow: {
    display:        'flex',
    justifyContent: 'center',
    marginBottom:   '2px',
  },
  notifCount: {
    fontFamily:    MONO,
    fontSize:      '10px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color:         'rgba(255,255,255,0.55)',
  },
  notifCard: {
    display:              'flex',
    alignItems:           'flex-start',
    gap:                  '10px',
    background:           'rgba(10,10,14,0.82)',
    backdropFilter:       'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderLeft:           `4px solid ${PHONE.RED}`,
    borderRadius:         PHONE.RADIUS_PANEL,
    padding:              '11px 13px',
    boxShadow:            '4px 4px 0 rgba(0,0,0,0.5)',
  },
  notifIcon: {
    width:          30,
    height:         30,
    borderRadius:   '4px',
    background:     PHONE.RED,
    boxShadow:      'inset 0 0 0 1.5px #000',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  notifBody: { flex: 1, minWidth: 0 },
  notifTopRow: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   '1px',
  },
  notifApp: {
    fontSize:      '10px',
    fontWeight:    '600',
    letterSpacing: '0.06em',
    color:         'rgba(255,255,255,0.45)',
  },
  notifWhen: {
    fontSize: '11px',
    color:    'rgba(255,255,255,0.4)',
  },
  notifTitle: {
    margin:     '1px 0 0',
    fontSize:   '13.5px',
    fontWeight: '600',
    color:      '#fff',
    lineHeight: 1.3,
  },
  notifText: {
    margin:     '2px 0 0',
    fontSize:   '12.5px',
    color:      'rgba(255,255,255,0.75)',
    lineHeight: 1.35,
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
    background: 'linear-gradient(170deg, rgba(6,6,10,0.55) 0%, rgba(6,6,10,0.78) 100%)',
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
    fontFamily:    PHONE.MONO,
    fontSize:      '12px',
    fontWeight:    400,
    color:         'rgba(255,255,255,0.7)',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    margin:        0,
  },
  lockTime: {
    fontFamily:      PHONE.HEAVY,
    fontSize:        '50px',
    fontWeight:      400,
    color:           '#fff',
    letterSpacing:   '0.01em',
    margin:          '6px 0 0',
    lineHeight:      0.9,
    transform:       'skewX(-7deg)',
    WebkitTextStroke:'1.5px #000',
    paintOrder:      'stroke fill',
    textShadow:      `2px 2px 0 #000, 0 0 24px ${PHONE.RED}55`,
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
  tile: {
    position:       'relative',
    width:          '68px',
    height:         '68px',
    borderRadius:   PHONE.RADIUS_TILE,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
    background:     'linear-gradient(150deg, #20202a 0%, #0b0b0f 100%)',
  },
  // Accent triangle in the top-right corner (colour set inline by <Tile>)
  tileSlash: {
    position:    'absolute',
    top:         0,
    right:       0,
    width:       0,
    height:      0,
    borderTop:   '16px solid',
    borderLeft:  '16px solid transparent',
  },
  iconLabel: {
    fontFamily:    PHONE.COND,
    fontSize:      '11px',
    fontWeight:    600,
    color:         '#fff',
    textShadow:    '1px 1px 0 #000',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
  badge: {
    position:       'absolute',
    top:            '-5px',
    right:          '-5px',
    minWidth:       '18px',
    height:         '18px',
    borderRadius:   '3px',
    background:     PHONE.RED,
    border:         '2px solid #000',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    boxShadow:      '2px 2px 0 #000',
  },
  badgeNum: {
    fontSize:   '10px',
    fontWeight: '700',
    color:      '#fff',
    fontFamily: PHONE.COND,
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
    background:     'rgba(10,10,14,0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius:   PHONE.RADIUS_TILE,
    padding:        '10px 18px',
    border:         '1px solid rgba(211,19,46,0.35)',
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
    borderRadius: '1px',
    background:   'rgba(255,255,255,0.3)',
    transform:    PHONE.SKEW,
    boxShadow:    `0 0 8px rgba(211,19,46,0.4)`,
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
