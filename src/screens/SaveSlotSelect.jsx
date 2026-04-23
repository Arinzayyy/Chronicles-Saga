import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
  getAllSlots,
  AUTOSAVE_SLOT_ID,
} from '../saveState';
import bgImage from '../assets/main_menu_bg.jpg';
import { playClick } from '../utils/sound';

// ─── Save Slot Select ────────────────────────────────────────────────────────
// A single screen reused in two modes:
//
//   mode="load"  — clicking a slot loads it into the running game.
//                  Empty slots are disabled.
//
//   mode="save"  — clicking a slot writes the current state to it.
//                  Occupied slots show a confirm-overwrite step.
//                  The autosave slot is hidden (the game manages it itself).
//
// Used by MainMenu ("LOAD") and by the in-game SettingsApp ("SAVE"/"LOAD").

const ACCENT = '#E94560';
const MONO   = "'Courier New', 'Consolas', 'Liberation Mono', monospace";
const BG     = '#0a0a0f';
const DIM    = 'rgba(255,255,255,0.18)';
const MID    = 'rgba(255,255,255,0.45)';

function formatTimestamp(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  const date = d.toLocaleDateString(undefined, {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
  const time = d.toLocaleTimeString(undefined, {
    hour:   '2-digit',
    minute: '2-digit',
  });
  return `${date} · ${time}`;
}

function slotLabel(slot, index) {
  if (slot.isAutosave) return 'AUTOSAVE';
  // index includes the autosave slot at position 0, so subtract 1 for manual.
  return `SLOT ${String(index).padStart(2, '0')}`;
}

export default function SaveSlotSelect({ mode = 'load', onClose, onLoaded }) {
  const { loadSlot, saveSlot, deleteSlot } = useGame();

  const [slots,     setSlots]     = useState(() => getAllSlots());
  const [visible,   setVisible]   = useState(false);
  const [confirm,   setConfirm]   = useState(null); // { slotId, action: 'overwrite' | 'delete' }
  const [toast,     setToast]     = useState('');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  function refresh() {
    setSlots(getAllSlots());
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 1600);
  }

  function handleLoad(slotId) {
    playClick();
    const ok = loadSlot(slotId);
    if (ok) {
      onLoaded?.(slotId);
    } else {
      showToast('SAVE UNREADABLE');
    }
  }

  function handleSave(slotId, allowOverwrite) {
    playClick();
    const slot = slots.find(s => s.id === slotId);
    if (slot?.exists && !allowOverwrite) {
      setConfirm({ slotId, action: 'overwrite' });
      return;
    }
    const ok = saveSlot(slotId);
    if (ok) {
      refresh();
      showToast('SAVED');
      setConfirm(null);
    } else {
      showToast('SAVE FAILED');
    }
  }

  function handleDelete(slotId, confirmed) {
    playClick();
    if (!confirmed) {
      setConfirm({ slotId, action: 'delete' });
      return;
    }
    deleteSlot(slotId);
    refresh();
    showToast('DELETED');
    setConfirm(null);
  }

  function handleBack() {
    playClick();
    onClose?.();
  }

  // In save mode, hide the autosave slot — the game manages it itself.
  const visibleSlots = mode === 'save'
    ? slots.filter(s => s.id !== AUTOSAVE_SLOT_ID)
    : slots;

  // ── Confirm overlay ──────────────────────────────────────────────────────
  const confirmSlot = confirm ? slots.find(s => s.id === confirm.slotId) : null;
  const confirmIndex = confirm
    ? slots.findIndex(s => s.id === confirm.slotId)
    : -1;

  return (
    <div style={s.root} className={visible ? 'slot-in' : ''}>
      <div style={s.bgImg} aria-hidden="true" />
      <div style={s.bgOverlay} aria-hidden="true" />
      <div style={s.scanlines} aria-hidden="true" />

      <div style={s.layout}>
        <div style={s.headerRow}>
          <div>
            <div style={s.crumb}>SYS://CHRONICLES</div>
            <h1 style={s.title}>
              {mode === 'save' ? 'SAVE GAME' : 'LOAD GAME'}
            </h1>
            <div style={s.subtitle}>
              {mode === 'save'
                ? '// choose a slot to overwrite'
                : '// choose a save file to restore'}
            </div>
          </div>

          <button style={s.backBtn} onClick={handleBack}>
            ◀ BACK
          </button>
        </div>

        <div style={s.divider} />

        <div style={s.slotList}>
          {visibleSlots.map((slot) => {
            // For labels we want autosave at 0, slot_1 at index 1, etc.
            const globalIndex = slots.findIndex(s2 => s2.id === slot.id);
            const canInteract =
              mode === 'save' ? true : slot.exists;
            return (
              <div key={slot.id} style={s.slotRow}>
                <button
                  style={{
                    ...s.slotMain,
                    ...(canInteract ? {} : s.slotMainDisabled),
                    ...(slot.isAutosave ? s.slotMainAutosave : {}),
                  }}
                  onClick={() => {
                    if (!canInteract) return;
                    if (mode === 'save') {
                      handleSave(slot.id, false);
                    } else {
                      handleLoad(slot.id);
                    }
                  }}
                  disabled={!canInteract}
                >
                  <span style={s.slotArrow}>{canInteract ? '▶' : '▷'}</span>
                  <span style={s.slotInner}>
                    <span style={s.slotLabel}>
                      {slotLabel(slot, globalIndex)}
                      {slot.isAutosave && (
                        <span style={s.autosaveTag}>· AUTO</span>
                      )}
                    </span>
                    <span style={s.slotMeta}>
                      {slot.exists
                        ? `SAVED: ${formatTimestamp(slot.savedAt)}`
                        : '// empty'}
                    </span>
                  </span>
                </button>

                {/* Delete button — visible in both modes, only if slot has data.
                    Autosave can be deleted too (useful for wiping a bad run). */}
                {slot.exists && (
                  <button
                    style={s.deleteBtn}
                    onClick={() => handleDelete(slot.id, false)}
                    title="Delete this save"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {toast && <div style={s.toast}>{toast}</div>}

        {confirm && confirmSlot && (
          <div style={s.confirmBackdrop} onClick={() => setConfirm(null)}>
            <div style={s.confirmBox} onClick={e => e.stopPropagation()}>
              <div style={s.confirmTitle}>
                {confirm.action === 'overwrite'
                  ? `OVERWRITE ${slotLabel(confirmSlot, confirmIndex)}?`
                  : `DELETE ${slotLabel(confirmSlot, confirmIndex)}?`}
              </div>
              <div style={s.confirmBody}>
                {confirm.action === 'overwrite'
                  ? `Existing save from ${formatTimestamp(confirmSlot.savedAt)} will be replaced. This can't be undone.`
                  : `This save from ${formatTimestamp(confirmSlot.savedAt)} will be permanently deleted.`}
              </div>
              <div style={s.confirmRow}>
                <button
                  style={s.confirmCancel}
                  onClick={() => {
                    playClick();
                    setConfirm(null);
                  }}
                >
                  CANCEL
                </button>
                <button
                  style={s.confirmGo}
                  onClick={() => {
                    if (confirm.action === 'overwrite') {
                      handleSave(confirm.slotId, true);
                    } else {
                      handleDelete(confirm.slotId, true);
                    }
                  }}
                >
                  {confirm.action === 'overwrite' ? 'OVERWRITE' : 'DELETE'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .slot-in { animation: slotFadeIn 0.5s ease forwards; }
        @keyframes slotFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const s = {
  root: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    background: BG,
    display: 'flex',
    alignItems: 'stretch',
    opacity: 0,
    overflow: 'hidden',
    fontFamily: MONO,
    color: '#fff',
  },

  bgImg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  },
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.82), rgba(0,0,0,0.9))',
    zIndex: 1,
  },
  scanlines: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
    pointerEvents: 'none',
    zIndex: 2,
  },

  layout: {
    position: 'relative',
    zIndex: 3,
    width: '100%',
    maxWidth: '960px',
    margin: '0 auto',
    padding: '48px 40px 60px',
    display: 'flex',
    flexDirection: 'column',
  },

  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '20px',
  },

  crumb: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.2em',
    color: DIM,
    marginBottom: '14px',
  },

  title: {
    fontFamily: MONO,
    fontSize: 'clamp(28px, 4vw, 42px)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    margin: 0,
    color: ACCENT,
    textShadow: `0 0 24px ${ACCENT}55`,
  },

  subtitle: {
    fontFamily: MONO,
    fontSize: '11px',
    letterSpacing: '0.2em',
    color: 'rgba(233,69,96,0.6)',
    marginTop: '10px',
  },

  backBtn: {
    fontFamily: MONO,
    fontSize: '11px',
    letterSpacing: '0.22em',
    color: MID,
    background: 'rgba(0,0,0,0.35)',
    border: `1px solid ${DIM}`,
    padding: '10px 16px',
    cursor: 'pointer',
  },

  divider: {
    width: '56px',
    height: '2px',
    background: ACCENT,
    marginTop: '24px',
    marginBottom: '28px',
    boxShadow: `0 0 10px ${ACCENT}55`,
  },

  slotList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  slotRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'stretch',
  },

  slotMain: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '18px 22px',
    fontFamily: MONO,
    color: '#ffffff',
    background: 'rgba(233,69,96,0.10)',
    border: `1px solid ${ACCENT}`,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.15s, box-shadow 0.15s',
  },
  slotMainDisabled: {
    color: DIM,
    background: 'rgba(0,0,0,0.28)',
    border: `1px dashed rgba(255,255,255,0.12)`,
    cursor: 'not-allowed',
  },
  slotMainAutosave: {
    background: 'rgba(77,166,255,0.10)',
    border: `1px solid rgba(77,166,255,0.55)`,
  },

  slotArrow: {
    color: ACCENT,
    fontSize: '11px',
    flexShrink: 0,
  },

  slotInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },

  slotLabel: {
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.22em',
    color: '#ffffff',
  },

  autosaveTag: {
    marginLeft: '10px',
    fontSize: '10px',
    color: '#4da6ff',
    letterSpacing: '0.2em',
    fontWeight: 400,
  },

  slotMeta: {
    fontSize: '10px',
    letterSpacing: '0.14em',
    color: 'rgba(255,255,255,0.55)',
  },

  deleteBtn: {
    width: '44px',
    fontFamily: MONO,
    fontSize: '14px',
    color: DIM,
    background: 'rgba(0,0,0,0.35)',
    border: `1px solid ${DIM}`,
    cursor: 'pointer',
    transition: 'color 0.15s, border-color 0.15s, background 0.15s',
  },

  toast: {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 18px',
    fontFamily: MONO,
    fontSize: '11px',
    letterSpacing: '0.22em',
    color: ACCENT,
    background: 'rgba(0,0,0,0.88)',
    border: `1px solid ${ACCENT}`,
    zIndex: 10,
  },

  confirmBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.78)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  confirmBox: {
    width: 'min(420px, 92vw)',
    padding: '28px 28px 22px',
    background: BG,
    border: `1px solid ${ACCENT}`,
    boxShadow: `0 0 48px rgba(0,0,0,0.6), inset 0 0 32px rgba(233,69,96,0.06)`,
  },
  confirmTitle: {
    fontFamily: MONO,
    fontSize: '14px',
    fontWeight: 700,
    color: ACCENT,
    letterSpacing: '0.18em',
    marginBottom: '12px',
  },
  confirmBody: {
    fontFamily: MONO,
    fontSize: '12px',
    color: MID,
    lineHeight: 1.7,
    marginBottom: '22px',
  },
  confirmRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  confirmCancel: {
    fontFamily: MONO,
    fontSize: '11px',
    letterSpacing: '0.2em',
    color: MID,
    background: 'transparent',
    border: `1px solid ${DIM}`,
    padding: '10px 18px',
    cursor: 'pointer',
  },
  confirmGo: {
    fontFamily: MONO,
    fontSize: '11px',
    letterSpacing: '0.2em',
    color: '#fff',
    background: ACCENT,
    border: `1px solid ${ACCENT}`,
    padding: '10px 18px',
    cursor: 'pointer',
  },
};
