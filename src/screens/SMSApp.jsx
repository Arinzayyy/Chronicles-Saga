import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useEngine } from '../context/EngineContext';
import { playClick } from '../utils/sound';
import storyData from '../data/story.json';

const SYS  = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';
const MONO = '"SF Mono", "Fira Code", "Courier New", monospace';

// ─── Character display names ──────────────────────────────────────────────────
const CHAR_NAMES = {
  player:       'You',
  __system__:   'System',
  char_unknown: 'Unknown',
  ...Object.fromEntries(storyData.characters.map(c => [c.id, c.display_name])),
};

function displayName(id) {
  return CHAR_NAMES[id] ?? id.replace('char_', '');
}

// ─── Sender label colors (group chat only) ────────────────────────────────────
const SENDER_COLORS = {
  char_murna:   '#E94560',
  char_kelvin:  '#378ADD',
  char_pitch:   '#888888',
  char_ayo:     '#1D9E75',
  char_loray:   '#BA7517',
  char_unknown: 'rgba(255,255,255,0.3)',
};

function senderColor(id) {
  return SENDER_COLORS[id] ?? 'rgba(255,255,255,0.3)';
}

// ─── Thread helpers ───────────────────────────────────────────────────────────
function isGroupThread(threadMeta) {
  return (threadMeta?.members?.length ?? 0) > 2;
}

function threadName(threadId, msgs, meta) {
  if (meta?.isGroup) return 'TEMP-3';
  const other = msgs.find(m => m.sender !== 'player' && !m.isSystem);
  return other ? displayName(other.sender) : 'Unknown';
}

function fmtTime() {
  const d = new Date();
  let h = d.getHours(), m = String(d.getMinutes()).padStart(2,'0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

// ─── Message pacing helpers ───────────────────────────────────────────────────
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns how long the typing indicator should show before this message.
function typingDuration(body) {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  if (words <= 5)  return rand(800,  1200);
  if (words <= 15) return rand(1500, 2500);
  return rand(2500, 3500);
}

// Returns the pause before showing the typing indicator for the next message.
function interPause(lastSender, nextSender) {
  if (lastSender === null) return 0;
  return lastSender === nextSender ? rand(400, 800) : rand(1000, 2000);
}

// Messages that skip the queue and appear instantly.
function isInstant(msg) {
  return msg.isSystem || msg.isGhost || msg.sender === 'player';
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SMSApp() {
  const { state, setApp, addMessage, markThreadRead, setFlag } = useGame();
  const engine = useEngine();

  const [activeThread,   setActiveThread]   = useState(null);
  const [choiceSelected, setChoiceSelected] = useState(false);

  // ── Pacing state ────────────────────────────────────────────────────────────
  // shownMsgs: what's actually rendered in the conversation right now.
  // localTyping: { sender } | null — the indicator shown while a msg is being "typed".
  const [shownMsgs,   setShownMsgs]   = useState([]);
  const [localTyping, setLocalTyping] = useState(null);

  const queueRef        = useRef([]);        // messages waiting to be displayed
  const processingRef   = useRef(false);     // true while queue drain is in progress
  const shownIdsRef     = useRef(new Set()); // ids of messages already registered (shown or queued)
  const lastSenderRef   = useRef(null);      // sender of last displayed non-system message
  const pacingTimersRef = useRef([]);        // setTimeout ids for cleanup
  const processQueueRef = useRef(null);      // mutable ref — always points at latest processQueue

  const messagesEndRef = useRef(null);
  const didInit        = useRef(false);

  // ── processQueue — assigned every render so closures are always fresh ───────
  processQueueRef.current = () => {
    if (queueRef.current.length === 0) {
      processingRef.current = false;
      return;
    }
    processingRef.current = true;
    const msg = queueRef.current.shift();

    const pause  = interPause(lastSenderRef.current, msg.sender);
    const typing = typingDuration(msg.body ?? '');

    function pt(fn, delay) {
      const t = setTimeout(fn, delay);
      pacingTimersRef.current.push(t);
    }

    pt(() => {
      // Show typing indicator for this sender
      setLocalTyping({ sender: msg.sender });
      pt(() => {
        // Typing done — brief pause before bubble appears
        setLocalTyping(null);
        pt(() => {
          lastSenderRef.current = msg.sender;
          setShownMsgs(prev => [...prev, msg]);
          processQueueRef.current(); // drain next
        }, 200);
      }, typing);
    }, pause);
  };

  // ── Fire opening beat once ──────────────────────────────────────────────────
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (state.beatHistory.length === 0) engine.loadBeat('beat_s1_001');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reset choice state when beat advances ───────────────────────────────────
  useEffect(() => { setChoiceSelected(false); }, [state.currentBeat]);

  // ── Mark thread read and publish active thread ───────────────────────────────
  useEffect(() => {
    setFlag('activeThread', activeThread ?? null);
    if (activeThread) markThreadRead(activeThread);
  }, [activeThread]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Clear active thread flag on unmount ─────────────────────────────────────
  useEffect(() => {
    return () => setFlag('activeThread', null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Open thread from notification ───────────────────────────────────────────
  useEffect(() => {
    const target = state.flags?.openThread;
    if (target && state.messageThreads[target]) {
      setActiveThread(target);
      setFlag('openThread', null);
    }
  }, [state.flags?.openThread]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Thread change: cancel pacing, snapshot history as instantly-shown ────────
  useEffect(() => {
    pacingTimersRef.current.forEach(clearTimeout);
    pacingTimersRef.current = [];
    queueRef.current = [];
    processingRef.current = false;
    setLocalTyping(null);

    if (!activeThread) {
      setShownMsgs([]);
      shownIdsRef.current = new Set();
      lastSenderRef.current = null;
      return;
    }

    // Messages already in state when we open the thread are "history" — show immediately.
    const history = state.messageThreads[activeThread] ?? [];
    setShownMsgs(history);
    shownIdsRef.current = new Set(history.map(m => m.id));
    const lastReal = [...history].reverse().find(m => !m.isSystem);
    lastSenderRef.current = lastReal?.sender ?? null;
  }, [activeThread]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Watch for new messages arriving from the engine ──────────────────────────
  // IMPORTANT: must be defined AFTER the thread-change effect so both effects
  // run in the right order when activeThread changes (thread-change first).
  useEffect(() => {
    if (!activeThread) return;
    const engineMsgs = state.messageThreads[activeThread] ?? [];
    const newMsgs = engineMsgs.filter(m => !shownIdsRef.current.has(m.id));
    if (newMsgs.length === 0) return;

    for (const msg of newMsgs) {
      shownIdsRef.current.add(msg.id); // register immediately so we never double-queue
      if (isInstant(msg)) {
        // Ghost, system, and player messages appear without typing delay.
        if (!msg.isSystem) lastSenderRef.current = msg.sender;
        setShownMsgs(prev => [...prev, msg]);
      } else {
        queueRef.current.push(msg);
      }
    }

    if (!processingRef.current) {
      processQueueRef.current();
    }
  }, [state.messageThreads[activeThread]]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scroll to bottom whenever displayed content changes ──────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [shownMsgs, localTyping]);

  const currentBeatData = engine.beatMap?.[state.currentBeat];
  const pendingChoices  = currentBeatData?.player_choices ?? [];

  const choiceThread = (() => {
    const dirs = currentBeatData?.directives;
    if (!dirs) return null;
    for (let i = dirs.length - 1; i >= 0; i--) {
      if (dirs[i].thread_id) return dirs[i].thread_id;
    }
    return null;
  })();

  const showChoices = (
    activeThread !== null &&
    pendingChoices.length > 0 &&
    !choiceSelected &&
    (choiceThread === null || choiceThread === activeThread)
  );

  function handleChoiceSelect(choice) {
    playClick();
    setChoiceSelected(true);
    const body = choice.label.replace(/^["""'']|["""'']$/g, '').trim();
    addMessage(activeThread, {
      id:        `player_choice_${Date.now()}`,
      sender:    'player',
      threadId:  activeThread,
      body,
      timestamp: Date.now(),
      isGhost: false, isSystem: false, isRead: true,
    });
    engine.resolveChoice(choice);
  }

  // Visible threads (exclude __system__, keep non-empty)
  const visibleThreads = Object.entries(state.messageThreads)
    .filter(([id, msgs]) => id !== '__system__' && msgs.some(m => !m.isSystem))
    .map(([id, msgs]) => {
      const meta      = state.threads[id];
      const visible   = msgs.filter(m => !m.isSystem);
      const last      = visible.at(-1);
      const name      = threadName(id, visible, meta);
      const hasUnread = visible.some(m => !m.isRead && m.sender !== 'player');
      const preview   = last
        ? (last.sender === 'player' ? 'You: ' : '') + last.body.split('\n')[0]
        : '...';
      return { id, name, preview, hasUnread };
    });

  // ── Thread list ───────────────────────────────────────────────────────────
  if (!activeThread) {
    return (
      <div style={s.root}>
        <StatusBar />

        <div style={s.navBar}>
          <button style={s.navBackBtn} onClick={() => { playClick(); setApp(null); }} aria-label="Back">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" stroke="#0A84FF"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.5 1L1 8l6.5 7" />
            </svg>
          </button>
          <span style={s.navTitle}>Messages</span>
          <button style={s.navActionBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A84FF" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div style={s.threadList}>
          {visibleThreads.length === 0 ? (
            <div style={s.waitingWrap}><WaitingDots /></div>
          ) : (
            visibleThreads.map((t, i) => (
              <ThreadRow
                key={t.id}
                thread={t}
                isLast={i === visibleThreads.length - 1}
                onClick={() => { playClick(); setActiveThread(t.id); }}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  // ── Conversation view ─────────────────────────────────────────────────────
  const meta    = state.threads[activeThread];
  const cname   = threadName(activeThread, shownMsgs.filter(m => !m.isSystem), meta);
  const isGroup = isGroupThread(meta);

  // Typing indicator dot color
  const typingDotColor = (isGroup && localTyping)
    ? senderColor(localTyping.sender)
    : 'rgba(142,142,147,0.9)';

  return (
    <div style={s.root}>
      <StatusBar />

      {/* Conversation nav bar */}
      <div style={s.convNav}>
        <button style={s.navBackBtn} onClick={() => { playClick(); setActiveThread(null); }} aria-label="Back">
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none" stroke="#0A84FF"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 1L1 8l6.5 7" />
          </svg>
          <span style={s.navBackLabel}>Messages</span>
        </button>

        <div style={s.convContactInfo}>
          <Avatar name={cname} size={28} />
          <span style={s.convName}>{cname}</span>
        </div>

        <div style={s.convIcons}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A84FF" strokeWidth="1.8">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 6.18 2 2 0 015 4h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 11.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 18.92v-2z" strokeLinecap="round"/>
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A84FF" strokeWidth="1.8">
            <path d="M15 10l-4 4L3 7l1-1" strokeLinecap="round"/>
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Messages — rendered from shownMsgs, not raw engine state */}
      <div style={{ ...s.conversation, gap: isGroup ? '12px' : '3px' }}>
        {shownMsgs.map(msg => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} style={s.systemLine}>
                {msg.body}
              </div>
            );
          }
          if (msg.sender === 'player') {
            return (
              <div key={msg.id} style={s.rowRight}>
                <div style={s.bubbleSent}>{msg.body}</div>
              </div>
            );
          }
          // Ghost messages — char_admin, no sender label, instant display
          if (msg.isGhost) {
            return (
              <div key={msg.id} style={s.rowLeft}>
                <div style={s.bubbleGhost}>{msg.body}</div>
              </div>
            );
          }
          if (msg.isPhoto) {
            return (
              <div key={msg.id} style={s.rowLeft}>
                {isGroup && msg.sender !== 'char_admin' && (
                  <span style={{ ...s.senderLabel, color: senderColor(msg.sender) }}>
                    {displayName(msg.sender)}
                  </span>
                )}
                <div style={s.bubblePhoto}>
                  <div style={s.photoPlaceholder}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(255,255,255,0.4)" stroke="none"/>
                      <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={s.photoLabel}>{msg.photoId?.replace('photo_','').replace(/_/g,' ')}</span>
                  </div>
                  {msg.caption && <p style={s.photoCaption}>{msg.caption}</p>}
                </div>
              </div>
            );
          }
          return (
            <div key={msg.id} style={s.rowLeft}>
              {isGroup && msg.sender !== 'char_admin' && (
                <span style={{ ...s.senderLabel, color: senderColor(msg.sender) }}>
                  {displayName(msg.sender)}
                </span>
              )}
              <div style={s.bubbleRecv}>{msg.body}</div>
            </div>
          );
        })}

        {/* Local typing indicator — driven by pacing queue, not engine state */}
        {localTyping && (
          <div style={s.rowLeft}>
            {isGroup && localTyping.sender !== 'char_admin' && (
              <span style={{ ...s.senderLabel, color: senderColor(localTyping.sender) }}>
                {displayName(localTyping.sender)}
              </span>
            )}
            <div style={s.typingBubble}>
              <span className="iDot" style={{ ...s.dot, background: typingDotColor }} />
              <span className="iDot" style={{ ...s.dot, background: typingDotColor, animationDelay: '0.16s' }} />
              <span className="iDot" style={{ ...s.dot, background: typingDotColor, animationDelay: '0.32s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} style={{ height: 1 }} />
      </div>

      {/* Choices — replaces keyboard */}
      {showChoices ? (
        <div style={s.choicesArea}>
          <div style={s.choicesDivider} />
          {pendingChoices.map(choice => (
            <button
              key={choice.id}
              style={s.choiceBtn}
              onClick={() => handleChoiceSelect(choice)}
            >
              <span style={s.choiceBtnText}>{choice.label}</span>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="rgba(10,132,255,0.5)"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1l5 5-5 5"/>
              </svg>
            </button>
          ))}
        </div>
      ) : (
        <div style={s.inputBar}>
          <div style={s.inputField}>
            <span style={s.inputPlaceholder}>iMessage</span>
          </div>
          <button style={s.sendBtn} disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 19V5M5 12l7-7 7 7" strokeWidth="2" stroke="white" fill="none" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      <style>{css}</style>
    </div>
  );
}

// ─── Thread row ────────────────────────────────────────────────────────────
function ThreadRow({ thread, isLast, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{
        ...s.threadRow,
        background: hov ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderBottom: isLast ? 'none' : '1px solid rgba(84,84,88,0.4)',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <Avatar name={thread.name} size={46} />
      <div style={s.threadInfo}>
        <div style={s.threadMeta}>
          <span style={{ ...s.threadName, fontWeight: thread.hasUnread ? '600' : '400' }}>
            {thread.name}
          </span>
          <span style={s.threadTime}>now</span>
        </div>
        <div style={s.previewRow}>
          <span style={s.threadPreview}>{thread.preview}</span>
          {thread.hasUnread && <div style={s.unreadDot} />}
          {!thread.hasUnread && (
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="rgba(84,84,88,0.8)"
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M1 1l5 5-5 5"/>
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Avatar ────────────────────────────────────────────────────────────────
function Avatar({ name, size }) {
  const hue    = ((name?.charCodeAt(0) ?? 65) * 27) % 360;
  const bg     = `hsl(${hue}, 55%, 38%)`;
  const letter = name?.[0]?.toUpperCase() ?? '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      fontSize: size * 0.42,
      fontWeight: '600',
      color: '#fff',
      fontFamily: SYS,
    }}>
      {letter}
    </div>
  );
}

// ─── Status bar ────────────────────────────────────────────────────────────
function StatusBar() {
  const [t, setT] = useState(fmtTime);
  useEffect(() => {
    const id = setInterval(() => setT(fmtTime()), 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={s.statusBar}>
      <span style={s.statusTime}>{t}</span>
      <div style={s.statusRight}>
        <svg width="15" height="11" viewBox="0 0 17 12" fill="white">
          <rect x="0" y="7"  width="3" height="5"  rx="0.8"/>
          <rect x="4" y="4"  width="3" height="8"  rx="0.8"/>
          <rect x="8" y="1"  width="3" height="11" rx="0.8"/>
          <rect x="12" y="0" width="3" height="12" rx="0.8" opacity="0.3"/>
        </svg>
        <svg width="23" height="11" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/>
          <rect x="2" y="2" width="16" height="8" rx="2" fill="white"/>
          <path d="M23 4v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Waiting dots ──────────────────────────────────────────────────────────
function WaitingDots() {
  return (
    <div style={{ display:'flex', gap:6 }}>
      <span className="iDot" style={{ ...s.dot, background:'rgba(142,142,147,0.5)' }} />
      <span className="iDot" style={{ ...s.dot, background:'rgba(142,142,147,0.5)', animationDelay:'0.18s' }} />
      <span className="iDot" style={{ ...s.dot, background:'rgba(142,142,147,0.5)', animationDelay:'0.36s' }} />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    position:      'relative',
    width:         '100%',
    height:        '100%',
    background:    '#000',
    display:       'flex',
    flexDirection: 'column',
    overflow:      'hidden',
    fontFamily:    SYS,
    color:         '#fff',
  },

  statusBar: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'14px 20px 2px', color:'#fff', flexShrink:0,
  },
  statusTime:  { fontSize:'15px', fontWeight:'600', letterSpacing:'0.01em' },
  statusRight: { display:'flex', alignItems:'center', gap:'5px' },

  navBar: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'10px 16px 10px',
    borderBottom:'1px solid rgba(84,84,88,0.4)',
    flexShrink:0,
  },
  navBackBtn: {
    display:'flex', alignItems:'center', gap:'4px',
    background:'none', border:'none', cursor:'pointer', color:'#0A84FF',
    padding:'4px 0', minWidth:60,
  },
  navBackLabel: { fontSize:'17px', color:'#0A84FF', fontFamily:SYS },
  navTitle: { fontSize:'17px', fontWeight:'600', color:'#fff', letterSpacing:'0.01em' },
  navActionBtn: {
    background:'none', border:'none', cursor:'pointer', padding:'4px',
    display:'flex', alignItems:'center', justifyContent:'flex-end', minWidth:60,
  },

  threadList:  { flex:1, overflowY:'auto' },
  waitingWrap: { display:'flex', justifyContent:'center', padding:'60px 0' },
  threadRow: {
    width:'100%', display:'flex', alignItems:'center', gap:'12px',
    padding:'11px 16px', background:'none', border:'none',
    cursor:'pointer', textAlign:'left', color:'inherit',
    transition:'background 0.1s',
  },
  threadInfo:    { flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:'2px' },
  threadMeta:    { display:'flex', alignItems:'center', justifyContent:'space-between' },
  threadName:    { fontSize:'16px', color:'#fff' },
  threadTime:    { fontSize:'12px', color:'#8E8E93' },
  previewRow:    { display:'flex', alignItems:'center', justifyContent:'space-between', gap:4 },
  threadPreview: {
    fontSize:'14px', color:'#8E8E93',
    overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', flex:1,
  },
  unreadDot: { width:9, height:9, borderRadius:'50%', background:'#0A84FF', flexShrink:0 },

  convNav: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'8px 12px 10px',
    borderBottom:'1px solid rgba(84,84,88,0.4)',
    flexShrink:0,
  },
  convContactInfo: { display:'flex', flexDirection:'column', alignItems:'center', gap:'3px' },
  convName:  { fontSize:'12px', fontWeight:'600', color:'#fff', letterSpacing:'0.01em' },
  convIcons: { display:'flex', gap:'16px', minWidth:60, justifyContent:'flex-end' },

  conversation: {
    flex:1, overflowY:'auto', padding:'12px 12px 8px',
    display:'flex', flexDirection:'column', gap:'3px',
  },
  systemLine: {
    alignSelf:'center',
    fontSize:'11px', color:'#8E8E93',
    padding:'4px 8px', textAlign:'center', letterSpacing:'0.01em',
  },
  rowLeft: {
    display:'flex', flexDirection:'column', alignItems:'flex-start',
    justifyContent:'flex-start', paddingLeft:2,
  },
  rowRight: { display:'flex', justifyContent:'flex-end', paddingRight:2 },
  senderLabel: {
    fontFamily:    MONO,
    fontSize:      '10px',
    fontWeight:    '500',
    letterSpacing: '0.04em',
    marginBottom:  '4px',
    paddingLeft:   '2px',
    lineHeight:    1,
  },

  bubbleRecv: {
    maxWidth:'75%', background:'#3A3A3C', color:'#fff',
    padding:'9px 13px', borderRadius:'18px 18px 18px 4px',
    fontSize:'15px', lineHeight:'1.45', whiteSpace:'pre-wrap', wordBreak:'break-word',
  },
  bubbleSent: {
    maxWidth:'75%', background:'#0B84FF', color:'#fff',
    padding:'9px 13px', borderRadius:'18px 18px 4px 18px',
    fontSize:'15px', lineHeight:'1.45', whiteSpace:'pre-wrap', wordBreak:'break-word',
  },
  bubbleGhost: {
    maxWidth:'75%', background:'rgba(58,58,60,0.45)', color:'rgba(255,255,255,0.5)',
    padding:'9px 13px', borderRadius:'18px 18px 18px 4px',
    fontSize:'14px', lineHeight:'1.45', border:'1px dashed rgba(142,142,147,0.3)',
    fontStyle:'italic', whiteSpace:'pre-wrap', wordBreak:'break-word',
  },

  bubblePhoto: {
    maxWidth:'75%', background:'#3A3A3C', borderRadius:'18px 18px 18px 4px',
    overflow:'hidden',
  },
  photoPlaceholder: {
    width:'200px', height:'150px', background:'rgba(0,0,0,0.3)',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6,
  },
  photoLabel:   { fontSize:'10px', color:'rgba(255,255,255,0.35)', fontFamily:MONO, letterSpacing:'0.06em' },
  photoCaption: { fontSize:'13px', color:'rgba(255,255,255,0.7)', padding:'8px 12px 10px', margin:0 },

  typingBubble: {
    background:'#3A3A3C', padding:'13px 16px',
    borderRadius:'18px 18px 18px 4px',
    display:'flex', alignItems:'center', gap:'5px',
  },
  dot: {
    display:'inline-block', width:7, height:7, borderRadius:'50%',
    background:'rgba(142,142,147,0.9)',
    animation:'iDotBounce 1.2s ease-in-out infinite',
  },

  choicesArea:    { background:'#000', flexShrink:0, paddingBottom:'12px' },
  choicesDivider: { height:'1px', background:'rgba(84,84,88,0.4)', marginBottom:'2px' },
  choiceBtn: {
    width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'13px 20px',
    background:'none', border:'none',
    borderBottom:'1px solid rgba(84,84,88,0.3)',
    cursor:'pointer', color:'inherit',
    transition:'background 0.1s',
  },
  choiceBtnText: { fontSize:'16px', color:'#0A84FF', fontFamily:SYS, textAlign:'left' },

  inputBar: {
    display:'flex', alignItems:'center', gap:'8px',
    padding:'8px 12px 14px',
    borderTop:'1px solid rgba(84,84,88,0.4)',
    flexShrink:0,
  },
  inputField: {
    flex:1, background:'#1C1C1E', borderRadius:'18px',
    padding:'8px 14px',
    border:'1px solid rgba(84,84,88,0.5)',
    display:'flex', alignItems:'center',
  },
  inputPlaceholder: { fontSize:'15px', color:'#636366', fontFamily:SYS },
  sendBtn: {
    width:30, height:30, borderRadius:'50%',
    background:'rgba(10,132,255,0.3)',
    border:'none', cursor:'default',
    display:'flex', alignItems:'center', justifyContent:'center',
  },
};

const css = `
  .iDot { animation: iDotBounce 1.2s ease-in-out infinite; }
  @keyframes iDotBounce {
    0%, 100% { opacity: 0.35; transform: translateY(0); }
    50%       { opacity: 1;    transform: translateY(-3px); }
  }
`;
