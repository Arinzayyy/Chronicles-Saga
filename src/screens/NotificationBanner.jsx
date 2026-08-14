import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import storyData from '../data/story.json';
import { PHONE } from './phoneTheme';

const SYS = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

const CHAR_NAMES = {
  player:       'You',
  __system__:   'System',
  char_unknown: 'Unknown',
  ...Object.fromEntries(storyData.characters.map(c => [c.id, c.display_name])),
};

function displayName(id) {
  return CHAR_NAMES[id] ?? id.replace('char_', '').replace(/^./, c => c.toUpperCase());
}

// How long a banner stays on screen, based on how much there is to read.
// A bare title ("Halima 🔔") clears quickly; a full DM preview lingers long
// enough to actually read it. Clamped so nothing flashes or overstays.
function bannerDwell(title, subtitle) {
  const words = `${title ?? ''} ${subtitle ?? ''}`.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2400, Math.min(6000, 1200 + words * 320));
}

export default function NotificationBanner() {
  const { state, setContext, setApp, setFlag } = useGame();

  const [queue,   setQueue]   = useState([]);
  const [current, setCurrent] = useState(null);
  const [visible, setVisible] = useState(false);

  const seenIds      = useRef(new Set());
  const isFirstRun   = useRef(true);
  const dismissTimer = useRef(null);

  // Detect new inbound messages; seed on first run so mount doesn't spam
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      for (const msgs of Object.values(state.messageThreads)) {
        for (const msg of msgs) seenIds.current.add(msg.id);
      }
      return;
    }

    const newNotifs = [];

    for (const [threadId, msgs] of Object.entries(state.messageThreads)) {
      if (threadId === '__system__') continue;

      for (const msg of msgs) {
        if (seenIds.current.has(msg.id)) continue;
        seenIds.current.add(msg.id);

        // Skip player, system, ghost, and pre-seeded backlog messages.
        // Backlog messages were already waiting on the phone — they shouldn't
        // pop a "new message" banner.
        if (msg.sender === 'player' || msg.isSystem || msg.isGhost || msg.isBacklog) continue;

        // Suppress if the user is anywhere in the SMS app:
        //   • on the thread list  → all threads are visible, no banner needed
        //   • inside this thread  → they're already reading it
        // Only fire when they're in a *different* thread and a new one gets a message.
        const inSMS = state.currentApp === 'sms' && state.currentContext === 'phone';
        const openThread = state.flags?.activeThread ?? null;
        if (inSMS && (!openThread || openThread === threadId)) continue;

        const meta        = state.threads?.[threadId];
        const isGroup     = meta?.isGroup ?? false;
        const groupName   = isGroup ? (meta?.name ?? 'NOT A CULT') : null;
        const senderName  = displayName(msg.sender);
        const title       = isGroup ? groupName : senderName;
        const subtitle    = isGroup ? `${senderName}: ${msg.isPhoto ? '📷 Photo' : msg.body.split('\n')[0]}`
                                    : (msg.isPhoto ? '📷 Photo' : msg.body.split('\n')[0]);

        newNotifs.push({ id: msg.id, threadId, title, subtitle });
      }
    }

    if (newNotifs.length > 0) setQueue(q => [...q, ...newNotifs]);
  }, [state.messageThreads]); // eslint-disable-line react-hooks/exhaustive-deps

  // Engine-driven title-only notifications (notify directive → __notify__ flag)
  const lastNotifyTs = useRef(0);
  useEffect(() => {
    const n = state.flags?.__notify__;
    if (!n || n.ts === lastNotifyTs.current) return;
    lastNotifyTs.current = n.ts;
    // On the lock screen these are rendered as a notification stack with a
    // count, so don't also slide them in as banners.
    if (state.currentApp === 'lockscreen') return;
    setQueue(q => [...q, { id: `flagnotif_${n.ts}`, threadId: null, title: n.title, subtitle: n.body ?? '', dwell: n.duration ?? null }]);
  }, [state.flags?.__notify__]); // eslint-disable-line react-hooks/exhaustive-deps

  // Drain queue one notification at a time
  useEffect(() => {
    if (current || queue.length === 0) return;

    const [next, ...rest] = queue;
    setQueue(rest);
    setCurrent(next);

    // Small delay so the element mounts before we flip visible → slide in
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));

    dismissTimer.current = setTimeout(dismiss, next.dwell ?? bannerDwell(next.title, next.subtitle));
  }, [queue, current]); // eslint-disable-line react-hooks/exhaustive-deps

  function dismiss() {
    clearTimeout(dismissTimer.current);
    setVisible(false);
    setTimeout(() => setCurrent(null), 380);
  }

  function handleTap() {
    dismiss();
    // Set the target thread before navigating so SMSApp opens it directly
    setFlag('openThread', current.threadId);
    setTimeout(() => {
      setContext('phone');
      setApp('sms');
    }, 180);
  }

  if (!current) return null;

  return (
    <div style={s.container}>
      <div
        role="button"
        aria-label={`New message from ${current.title}`}
        style={{
          ...s.banner,
          transform: visible ? 'skewX(-5deg) translateY(0)' : 'skewX(-5deg) translateY(-150%)',
        }}
        onClick={handleTap}
      >
        {/* Messages squircle icon */}
        <div style={s.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>

        {/* Text content */}
        <div style={s.body}>
          <div style={s.topRow}>
            <span style={s.appName}>Messages</span>
            <span style={s.time}>now</span>
          </div>
          <p style={s.title}>{current.title}</p>
          <p style={s.subtitle}>{current.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  // Positioned absolutely inside the phone's screenContent div.
  // zIndex 25 puts it above the Dynamic Island (20) and all phone content.
  // Padding-top clears the island (top:14px + height:34px + gap:6px = 54px).
  container: {
    position:      'absolute',
    top:           0,
    left:          0,
    right:         0,
    zIndex:        25,
    display:       'flex',
    justifyContent:'center',
    padding:       '40px 10px 0',
    pointerEvents: 'none',   // pass-through except on banner itself
  },

  banner: {
    display:              'flex',
    alignItems:           'flex-start',
    gap:                  '10px',
    width:                '100%',
    maxWidth:             '100%',
    background:           'rgba(10,10,14,0.92)',
    backdropFilter:       'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderLeft:           `4px solid ${PHONE.RED}`,
    borderRadius:         PHONE.RADIUS_PANEL,
    padding:              '11px 14px 12px',
    boxShadow:            '5px 6px 0 rgba(0,0,0,0.6), 0 0 22px rgba(211,19,46,0.25)',
    cursor:               'pointer',
    pointerEvents:        'auto',
    transition:           'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
    userSelect:           'none',
    fontFamily:           SYS,
  },

  // Red angular app chip
  icon: {
    width:          34,
    height:         34,
    borderRadius:   '4px',
    background:     PHONE.RED,
    boxShadow:      'inset 0 0 0 1.5px #000',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },

  body: {
    flex:    1,
    minWidth: 0,
  },

  topRow: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   '2px',
  },

  appName: {
    fontFamily:    PHONE.MONO,
    fontSize:      '10px',
    fontWeight:    600,
    color:         PHONE.RED,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
  },

  time: {
    fontSize: '12px',
    color:    'rgba(255,255,255,0.35)',
  },

  title: {
    margin:       '0 0 1px',
    fontFamily:   PHONE.COND,
    fontSize:     '15px',
    fontWeight:   700,
    color:        '#fff',
    letterSpacing:'0.02em',
    overflow:     'hidden',
    whiteSpace:   'nowrap',
    textOverflow: 'ellipsis',
  },

  subtitle: {
    margin:      0,
    fontSize:    '13px',
    fontWeight:  '400',
    color:       'rgba(255,255,255,0.60)',
    overflow:    'hidden',
    whiteSpace:  'nowrap',
    textOverflow:'ellipsis',
  },
};
