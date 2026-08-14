import { useGame } from '../context/GameContext';
import { useEngine } from '../context/EngineContext';
import { playClick } from '../utils/sound';

/**
 * SceneViewer — a focused, fullscreen image viewer for guided "look through
 * these shots" beats. NOT the Photos library: one picture front and centre,
 * narration in the side panel, and a Next control to advance to the next shot.
 *
 * Beats opt in via app: "viewer" and either:
 *   • "photo": "<photo_id>"  → show that picture (placeholder until a real
 *                              asset is registered in PHOTO_ASSETS)
 *   • "recording": true      → show the voice-note "now playing" panel
 *
 * Advancement reuses the engine: beat.continue → Next, player_choices → choices.
 * Drop real images into PHOTO_ASSETS later and they render with zero other
 * changes — voiceover can advance the same way Next does.
 */

const SYS  = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';
const MONO = '"SF Mono", "Fira Code", "Courier New", monospace';

// photo_id → imported image asset. Empty for now → placeholders.
const PHOTO_ASSETS = {};

function fmtTime() {
  const d = new Date(), h = d.getHours() % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, '0')} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
}

function prettyLabel(id) {
  // "halima_scene_1" → "Scene 01"
  const m = /scene[_-]?(\d+)/i.exec(id || '');
  if (m) return `Scene ${String(m[1]).padStart(2, '0')}`;
  return (id || '').replace(/_/g, ' ');
}

export default function SceneViewer() {
  const { state } = useGame();
  const engine    = useEngine();

  const beat           = engine?.beatMap?.[state.currentBeat];
  const photo          = beat?.photo ?? null;
  const isRecording    = !!beat?.recording;
  const continueTarget = beat?.continue ?? null;
  const choices        = beat?.player_choices ?? [];
  const asset          = photo ? PHOTO_ASSETS[photo] : null;

  return (
    <div style={s.root}>
      <StatusBar />

      <div style={s.stage}>
        {isRecording ? (
          <VoiceNotePanel />
        ) : asset ? (
          <img src={asset} alt={prettyLabel(photo)} style={s.img} />
        ) : photo ? (
          <PhotoPlaceholder id={photo} />
        ) : null}
      </div>

      {/* Advancement: a quiet Next pill, or a labelled choice list */}
      {continueTarget ? (
        <>
          <button
            style={s.nextPill}
            onClick={() => { playClick(); engine?.advanceBeat(continueTarget); }}
            aria-label="Next"
          >
            <span style={s.nextLabel}>Next</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <style>{`@keyframes svIn { from { opacity:0; transform:translateY(8px);} to {opacity:1; transform:translateY(0);} }`}</style>
        </>
      ) : choices.length > 0 ? (
        <div style={s.choiceWrap}>
          {choices.map((c, i) => (
            <button key={i} style={s.choiceBtn} onClick={() => { playClick(); engine?.resolveChoice(c); }}>
              {c.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ─── Big photo placeholder (until a real asset exists) ───────────────────────
function PhotoPlaceholder({ id }) {
  return (
    <div style={s.placeholder}>
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="1.1">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.6" fill="rgba(255,255,255,0.20)" stroke="none" />
        <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={s.placeholderLabel}>{prettyLabel(id)}</span>
    </div>
  );
}

// ─── Voice-note "now playing" panel (recording beats) ────────────────────────
function VoiceNotePanel() {
  return (
    <div style={s.voiceCard}>
      <div style={s.voiceIcon}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
          <path d="M19 11a7 7 0 0 1-14 0" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 18v3" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div style={s.waveform}>
        {Array.from({ length: 34 }).map((_, i) => (
          <span key={i} style={{ ...s.waveBar, height: `${8 + Math.abs(Math.sin(i * 1.3)) * 30}px` }} />
        ))}
      </div>
      <div style={s.voiceMeta}>
        <span style={s.voiceName}>Halima — recording</span>
        <span style={s.voiceDur}>0:47</span>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div style={s.statusBar}>
      <span style={s.statusTime}>{fmtTime()}</span>
      <div style={s.statusRight}>
        <svg width="15" height="11" viewBox="0 0 17 12" fill="white">
          <rect x="0" y="7" width="3" height="5" rx="0.8" />
          <rect x="4" y="4" width="3" height="8" rx="0.8" />
          <rect x="8" y="1" width="3" height="11" rx="0.8" />
          <rect x="12" y="0" width="3" height="12" rx="0.8" opacity="0.3" />
        </svg>
        <svg width="23" height="11" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="white" />
          <path d="M23 4v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

const s = {
  root: {
    position: 'relative', width: '100%', height: '100%',
    background: '#000', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', fontFamily: SYS, color: '#fff',
  },
  statusBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px 2px', flexShrink: 0, position: 'relative', zIndex: 2,
  },
  statusTime:  { fontSize: '15px', fontWeight: '600' },
  statusRight: { display: 'flex', alignItems: 'center', gap: '5px' },

  // The image stage — picture front and centre, filling the screen.
  stage: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '8px', minHeight: 0,
  },
  img: {
    maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
    borderRadius: '8px',
  },

  placeholder: {
    width: '100%', height: '100%', borderRadius: '10px',
    background: 'radial-gradient(ellipse at 50% 40%, #1b1b1f 0%, #101013 100%)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
  },
  placeholderLabel: {
    fontFamily: MONO, fontSize: '11px', letterSpacing: '0.22em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)',
  },

  // Voice-note panel
  voiceCard: {
    width: '86%', maxWidth: '320px',
    background: 'rgba(20,20,24,0.7)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '18px', padding: '26px 22px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
  },
  voiceIcon: {
    width: 54, height: 54, borderRadius: '50%',
    background: 'linear-gradient(145deg, #30d158 0%, #25a244 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(48,209,88,0.35)',
  },
  waveform: {
    display: 'flex', alignItems: 'center', gap: '3px', height: '40px',
  },
  waveBar: {
    width: '3px', borderRadius: '2px', background: 'rgba(48,209,88,0.65)',
  },
  voiceMeta: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
  },
  voiceName: { fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.92)' },
  voiceDur:  { fontFamily: MONO, fontSize: '12px', color: 'rgba(255,255,255,0.45)' },

  // Quiet "Next" pill — intentionally not a dialogue-choice button.
  nextPill: {
    position: 'absolute', bottom: '26px', right: '18px', zIndex: 30,
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '9px 16px', borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(20,20,24,0.62)',
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    color: 'rgba(255,255,255,0.92)', cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(0,0,0,0.45)', animation: 'svIn 0.45s ease both',
    fontFamily: SYS,
  },
  nextLabel: { fontSize: '14px', fontWeight: '600', letterSpacing: '0.02em' },

  // Real decisions
  choiceWrap: {
    position: 'absolute', left: '16px', right: '16px', bottom: '24px', zIndex: 30,
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  choiceBtn: {
    width: '100%', padding: '13px 16px', borderRadius: '13px',
    border: '1px solid rgba(10,132,255,0.55)', background: 'rgba(10,132,255,0.14)',
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    color: '#fff', fontSize: '14px', fontWeight: '500', textAlign: 'left', cursor: 'pointer',
    fontFamily: SYS,
  },
};
