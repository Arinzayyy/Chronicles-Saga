import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useEngine } from '../context/EngineContext';
import { playClick } from '../utils/sound';

// ─── Main screen ───────────────────────────────────────────────────────────
export default function EmailApp() {
  const { state, setApp, markEmailRead } = useGame();
  const engine = useEngine();

  const [activeEmail, setActiveEmail]   = useState(null);
  const [composing,   setComposing]     = useState(null);  // choice beat data
  const [choiceDone,  setChoiceDone]    = useState(false);

  const { emails } = state;

  function openEmail(email) {
    playClick();
    markEmailRead(email.id);
    setActiveEmail(email);
    setComposing(null);
    setChoiceDone(false);
  }

  function handleChoiceSelect(choice) {
    playClick();
    setChoiceDone(true);
    engine.resolveChoice(choice);
  }

  // ── Compose view ─────────────────────────────────────────────────────────
  if (composing) {
    return (
      <ComposeView
        compose={composing}
        choiceDone={choiceDone}
        onSelect={handleChoiceSelect}
        onBack={() => setComposing(null)}
      />
    );
  }

  // ── Email detail view ─────────────────────────────────────────────────────
  if (activeEmail) {
    const beat        = engine.beatMap?.[state.currentBeat];
    const choices     = beat?.player_choices ?? [];
    const isCompose   = choices.some(c => c.triggers_compose);

    return (
      <div style={s.root}>
        <ToolBar />
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => { playClick(); setActiveEmail(null); }} aria-label="Back">
            <Chevron />
          </button>
          <span style={s.headerTitle}>Inbox</span>
          <div style={{ width: 40 }} />
        </div>

        <div style={s.emailDetail}>
          <div style={s.detailHeader}>
            <p style={s.detailSubject}>{activeEmail.subject}</p>
            <p style={s.detailMeta}>
              <span style={s.detailFrom}>{activeEmail.from}</span>
              <span style={s.detailDot}>·</span>
              <span style={s.detailTime}>{formatRelativeTime(activeEmail.timestamp)}</span>
            </p>
          </div>
          <div style={s.detailBody}>
            <p style={s.bodyText}>{activeEmail.body}</p>
          </div>

          {/* Reply choices if a compose beat is active */}
          {isCompose && !choiceDone && (
            <div style={s.replySection}>
              <p style={s.replyPrompt}>COMPOSE REPLY</p>
              {choices.map(choice => (
                <button
                  key={choice.id}
                  style={s.replyOption}
                  onClick={() => handleChoiceSelect(choice)}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Thread list ───────────────────────────────────────────────────────────
  return (
    <div style={s.root}>
      <ToolBar />
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => { playClick(); setApp(null); }} aria-label="Back">
          <Chevron />
        </button>
        <span style={s.headerTitle}>Inbox</span>
        <div style={{ width: 40 }} />
      </div>

      {emails.length === 0 ? (
        <div style={s.empty}>
          <span style={s.emptyText}>no messages</span>
        </div>
      ) : (
        <div style={s.threadList}>
          {[...emails].reverse().map(email => (
            <EmailRow
              key={email.id}
              email={email}
              onClick={() => openEmail(email)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Compose view ─────────────────────────────────────────────────────────
function ComposeView({ compose, choiceDone, onSelect, onBack }) {
  return (
    <div style={s.root}>
      <ToolBar />
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => { playClick(); onBack(); }} aria-label="Back">
          <Chevron />
        </button>
        <span style={s.headerTitle}>New Message</span>
        <div style={{ width: 40 }} />
      </div>

      <div style={s.composeArea}>
        <div style={s.composeField}>
          <span style={s.composeFieldLabel}>To</span>
          <span style={s.composeFieldValue}>{compose.to}</span>
        </div>
        <div style={s.composeDivider} />
        <div style={s.composeField}>
          <span style={s.composeFieldLabel}>Subject</span>
          <span style={s.composeFieldValue}>{compose.subject}</span>
        </div>
        <div style={s.composeDivider} />

        {!choiceDone ? (
          <div style={s.bodyOptions}>
            <p style={s.bodyOptionsPrompt}>Select reply:</p>
            {compose.choices.map(choice => (
              <button
                key={choice.id}
                style={s.bodyOption}
                onClick={() => onSelect(choice)}
              >
                {choice.label}
              </button>
            ))}
          </div>
        ) : (
          <p style={s.composeSent}>[ message sent ]</p>
        )}
      </div>
    </div>
  );
}

// ─── Email row ─────────────────────────────────────────────────────────────
function EmailRow({ email, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{
        ...s.emailRow,
        background: hov ? 'rgba(255,255,255,0.03)' : 'transparent',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={s.emailAvatar}>
        <span style={s.avatarLetter}>{(email.from?.[0] ?? '?').toUpperCase()}</span>
      </div>
      <div style={s.emailInfo}>
        <div style={s.emailMeta}>
          <span style={{ ...s.emailFrom, fontWeight: email.isRead ? 400 : 700 }}>
            {email.from}
          </span>
          {!email.isRead && <div style={s.unreadDot} />}
        </div>
        <p style={s.emailSubject}>{email.subject}</p>
        <p style={s.emailPreview}>{email.body?.slice(0, 80)}...</p>
      </div>
    </button>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function formatRelativeTime(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const m    = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Shared sub-components ─────────────────────────────────────────────────
function ToolBar() {
  return (
    <div style={s.toolbar}>
      <div style={s.toolbarLeft}>
        <span style={s.toolbarDot} />
        <span style={s.toolbarDot} />
        <span style={s.toolbarDot} />
      </div>
      <span style={s.toolbarTitle}>MAIL</span>
      <div style={{ width: 52 }} />
    </div>
  );
}

function Chevron() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1L2 9l6 8" />
    </svg>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    position:      'relative',
    width:         '100vw',
    height:        '100vh',
    background:    '#0b0b14',
    display:       'flex',
    flexDirection: 'column',
    overflow:      'hidden',
    fontFamily:    'var(--font-mono)',
    color:         'var(--text)',
  },
  toolbar: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '12px 16px 8px',
    borderBottom:   '1px solid rgba(255,255,255,0.05)',
    flexShrink:     0,
  },
  toolbarLeft: { display: 'flex', gap: '6px' },
  toolbarDot:  {
    display: 'inline-block', width: '10px', height: '10px',
    borderRadius: '50%', background: 'rgba(255,255,255,0.12)',
  },
  toolbarTitle: {
    fontSize: '11px', letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.2)',
  },
  header: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '8px 16px 12px',
    borderBottom:   '1px solid rgba(255,255,255,0.07)',
    flexShrink:     0,
  },
  backBtn: {
    width: 40, height: 40,
    display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'rgba(255,255,255,0.7)', padding: 0,
  },
  headerTitle: {
    fontSize: '17px', fontWeight: 600,
    color: 'rgba(255,255,255,0.9)', letterSpacing: '0.02em',
  },

  empty: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emptyText: {
    fontSize: '13px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em',
  },

  threadList: { flex: 1, overflowY: 'auto' },

  emailRow: {
    width: '100%', display: 'flex', alignItems: 'flex-start', gap: '14px',
    padding: '14px 18px', background: 'none', border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    cursor: 'pointer', textAlign: 'left', color: 'inherit',
    transition: 'background 0.12s',
  },
  emailAvatar: {
    width: 42, height: 42, borderRadius: '50%',
    background: '#1a1a30', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  avatarLetter: { fontSize: '16px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 },
  emailInfo:   { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' },
  emailMeta:   { display: 'flex', alignItems: 'center', gap: '8px' },
  emailFrom:   { fontSize: '14px', color: 'rgba(255,255,255,0.88)' },
  unreadDot:   { width: 7, height: 7, borderRadius: '50%', background: '#5c8afc', flexShrink: 0 },
  emailSubject:{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', margin: 0 },
  emailPreview:{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0,
    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },

  emailDetail: { flex: 1, overflowY: 'auto', padding: '0 0 40px' },
  detailHeader: { padding: '20px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  detailSubject: { fontSize: '18px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: '0 0 8px' },
  detailMeta:    { display: 'flex', alignItems: 'center', gap: '8px', margin: 0 },
  detailFrom:    { fontSize: '12px', color: 'rgba(255,255,255,0.45)' },
  detailDot:     { fontSize: '10px', color: 'rgba(255,255,255,0.2)' },
  detailTime:    { fontSize: '12px', color: 'rgba(255,255,255,0.3)' },
  detailBody:    { padding: '20px' },
  bodyText:      { fontSize: '14px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, whiteSpace: 'pre-wrap' },

  replySection: { padding: '0 20px' },
  replyPrompt:  { fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', marginBottom: '10px' },
  replyOption:  {
    display: 'block', width: '100%', marginBottom: '8px',
    padding: '12px 16px', background: 'rgba(92,138,252,0.1)',
    border: '1px solid rgba(92,138,252,0.35)', borderRadius: '6px',
    color: 'rgba(180,200,255,0.85)', fontSize: '13px', fontFamily: 'var(--font-mono)',
    cursor: 'pointer', textAlign: 'left', lineHeight: 1.4,
  },

  composeArea: { flex: 1, padding: '0', overflowY: 'auto' },
  composeField: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 20px',
  },
  composeFieldLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.3)', width: '54px', letterSpacing: '0.1em' },
  composeFieldValue: { fontSize: '14px', color: 'rgba(255,255,255,0.75)', flex: 1 },
  composeDivider:    { height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 20px' },
  bodyOptions:       { padding: '24px 20px' },
  bodyOptionsPrompt: { fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.22)', marginBottom: '14px' },
  bodyOption:        {
    display: 'block', width: '100%', marginBottom: '8px',
    padding: '12px 16px', background: 'rgba(92,138,252,0.08)',
    border: '1px solid rgba(92,138,252,0.3)', borderRadius: '6px',
    color: 'rgba(180,200,255,0.82)', fontSize: '13px', fontFamily: 'var(--font-mono)',
    cursor: 'pointer', textAlign: 'left', lineHeight: 1.5,
  },
  composeSent: {
    textAlign: 'center', fontSize: '12px', letterSpacing: '0.14em',
    color: 'rgba(255,255,255,0.25)', padding: '40px 0',
  },
};
