import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import storyData from '../data/story.json';

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

        // Skip player, system, and ghost messages
        if (msg.sender === 'player' || msg.isSystem || msg.isGhost) continue;

        // Suppress if the user is anywhere in the SMS app:
        //   • on the thread list  → all threads are visible, no banner needed
        //   • inside this thread  → they're already reading it
        // Only fire when they're in a *different* thread and a new one gets a message.
        const inSMS = state.currentApp === 'sms' && state.currentContext === 'phone';
        const openThread = state.flags?.activeThread ?? null;
        if (inSMS && (!openThread || openThread === threadId)) continue;

        const meta        = state.threads?.[threadId];
        const isGroup     = meta?.isGroup ?? false;
        const groupName   = isGroup ? (meta?.name ?? 'Group') : null;
        const senderName  = displayName(msg.sender);
        const title       = isGroup ? groupName : senderName;
        const subtitle    = isGroup ? `${senderName}: ${msg.isPhoto ? '📷 Photo' : msg.body.split('\n')[0]}`
                                    : (msg.isPhoto ? '📷 Photo' : msg.body.split('\n')[0]);

        newNotifs.push({ id: msg.id, threadId, title, subtitle });
      }
    }

    if (newNotifs.length > 0) setQueue(q => [...q, ...newNotifs]);
  }, [state.messageThreads]); // eslint-disable-line react-hooks/exhaustive-deps

  // Drain queue one notification at a time
  useEffect(() => {
    if (current || queue.length === 0) return;

    const [next, ...rest] = queue;
    setQueue(rest);
    setCurrent(next);

    // Small delay so the element mounts before we flip visible → slide in
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));

    dismissTimer.current = setTimeout(dismiss, 4500);
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
          transform: visible ? 'translateY(0)' : 'translateY(-130%)',
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
  // Invisible full-width anchor pinned to top of viewport
  container: {
    position:      'fixed',
    top:           0,
    left:          0,
    right:         0,
    zIndex:        9999,
    display:       'flex',
    justifyContent:'center',
    padding:       '10px 14px 0',
    pointerEvents: 'none',   // pass-through except on banner itself
  },

  banner: {
    display:              'flex',
    alignItems:           'flex-start',
    gap:                  '10px',
    width:                '100%',
    maxWidth:             '380px',
    background:           'rgba(28,28,30,0.94)',
    backdropFilter:       'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border:               '1px solid rgba(255,255,255,0.10)',
    borderRadius:         '14px',
    padding:              '11px 14px 12px',
    boxShadow:            '0 10px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35)',
    cursor:               'pointer',
    pointerEvents:        'auto',
    transition:           'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
    userSelect:           'none',
    fontFamily:           SYS,
  },

  // Green Messages squircle
  icon: {
    width:          36,
    height:         36,
    borderRadius:   '9px',
    background:     'linear-gradient(145deg, #30d158 0%, #25a244 100%)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
    boxShadow:      '0 2px 6px rgba(0,0,0,0.3)',
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
    fontSize:   '12px',
    fontWeight: '500',
    color:      'rgba(255,255,255,0.45)',
    letterSpacing: '0.01em',
  },

  time: {
    fontSize: '12px',
    color:    'rgba(255,255,255,0.35)',
  },

  title: {
    margin:     '0 0 1px',
    fontSize:   '14px',
    fontWeight: '600',
    color:      '#fff',
    overflow:   'hidden',
    whiteSpace: 'nowrap',
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
