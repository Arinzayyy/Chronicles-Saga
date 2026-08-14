import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
  getAllSlots,
  AUTOSAVE_SLOT_ID,
} from '../saveState';
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

// Persona-style key art for the save screen. Drop a file at
// src/assets/saves_bg.(jpg|png|webp) and it's picked up automatically; until
// then we fall back to the menu persona art. Globs never error on missing
// files, so the build is safe even with no art present.
const savesImgs    = import.meta.glob('../assets/saves_bg.*',          { eager: true, query: '?url', import: 'default' });
const fallbackImgs = import.meta.glob('../assets/main_menu_persona.*', { eager: true, query: '?url', import: 'default' });
const SAVE_BG = Object.values(savesImgs)[0] ?? Object.values(fallbackImgs)[0] ?? null;

const HEAVY  = "'Anton', 'Archivo Black', 'Arial Black', Impact, sans-serif";
const MONO   = "'Courier New', 'Consolas', 'Liberation Mono', monospace";
const RED     = '#d3132e';
const TEAL    = '#19b8b4';
const BG      = '#08090c';
const DIM     = 'rgba(255,255,255,0.18)';
const MID     = 'rgba(255,255,255,0.5)';

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
      <div style={s.wash} aria-hidden="true" />
      <div style={s.scanlines} aria-hidden="true" />

      <div style={s.layout}>
        <div style={s.headerRow}>
          <div>
            <div style={s.crumb}>SYS://CHRONICLES</div>
            <h1 className="save-title" style={s.title}>
              {mode === 'save' ? 'SAVE GAME' : 'LOAD GAME'}
            </h1>
            <div style={s.subtitle}>
              {mode === 'save'
                ? '// choose a slot to overwrite'
                : '// choose a save file to restore'}
            </div>
          </div>

          <button className="save-back" style={s.backBtn} onClick={handleBack}>
            ◀ BACK
          </button>
        </div>

        <div style={s.slotList}>
          {visibleSlots.map((slot) => {
            // For labels we want autosave at 0, slot_1 at index 1, etc.
            const globalIndex = slots.findIndex(s2 => s2.id === slot.id);
            const canInteract = mode === 'save' ? true : slot.exists;
            return (
              <div key={slot.id} style={s.slotRow}>
                <button
                  className={`save-row ${canInteract ? '' : 'is-disabled'} ${slot.isAutosave ? 'is-auto' : ''}`}
                  style={s.slotMain}
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
                  <span className="save-bar" aria-hidden="true" />
                  <span style={s.slotInner}>
                    <span className="save-label" style={s.slotLabel}>
                      {slotLabel(slot, globalIndex)}
                      {slot.isAutosave && <span style={s.autosaveTag}>AUTO</span>}
                    </span>
                    <span style={s.slotMeta}>
                      {slot.exists
                        ? `SAVED · ${formatTimestamp(slot.savedAt)}`
                        : '// empty'}
                    </span>
                  </span>
                  {canInteract && <span className="save-go" style={s.slotGo}>▶</span>}
                </button>

                {/* Delete button — visible in both modes, only if slot has data. */}
                {slot.exists && (
                  <button
                    className="save-del"
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
                  className="save-back"
                  style={s.confirmCancel}
                  onClick={() => { playClick(); setConfirm(null); }}
                >
                  CANCEL
                </button>
                <button
                  className="save-go-btn"
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

      <style>{css}</style>
    </div>
  );
}

const css = `
  .slot-in { animation: slotFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards; }
  @keyframes slotFadeIn {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .save-row { transition: transform 0.16s cubic-bezier(0.34,1.56,0.64,1), background 0.16s; }
  .save-row:not(.is-disabled) { cursor: pointer; }
  .save-row.is-disabled { cursor: not-allowed; }

  .save-row:not(.is-disabled):hover,
  .save-row:not(.is-disabled):focus-visible {
    transform: translateX(12px);
    background: rgba(8,9,12,0.7);
    outline: none;
  }
  .save-row:not(.is-disabled):hover .save-label,
  .save-row:not(.is-disabled):focus-visible .save-label { color: ${RED}; }
  .save-row:not(.is-disabled):hover .save-bar,
  .save-row:not(.is-disabled):focus-visible .save-bar {
    background: ${RED};
    box-shadow: 0 0 14px ${RED}cc;
  }
  .save-row:not(.is-disabled):hover .save-go,
  .save-row:not(.is-disabled):focus-visible .save-go { opacity: 1; color: ${RED}; }

  .save-back:hover  { color: #fff; border-color: ${RED}; background: rgba(211,19,46,0.18); }
  .save-del:hover   { color: ${RED}; border-color: ${RED}; }
  .save-go-btn:hover { filter: brightness(1.12); }
`;

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
    backgroundImage: SAVE_BG ? `url(${SAVE_BG})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
  },
  // Dark wash hugging the left so the slot list stays legible over the art,
  // while the character on the right stays visible (matches the main menu).
  wash: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(100deg, rgba(5,6,9,0.92) 0%, rgba(5,6,9,0.7) 34%, rgba(5,6,9,0.25) 62%, rgba(5,6,9,0) 82%)',
    zIndex: 1,
    pointerEvents: 'none',
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
    maxWidth: '640px',
    padding: '7vh 0 60px 5vw',
    display: 'flex',
    flexDirection: 'column',
  },

  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '28px',
  },

  crumb: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.25em',
    color: DIM,
    marginBottom: '8px',
    textShadow: '1px 1px 0 #000',
  },

  title: {
    fontFamily: HEAVY,
    fontSize: 'clamp(46px, 6.4vw, 88px)',
    fontWeight: 400,
    letterSpacing: '0.01em',
    lineHeight: 0.9,
    margin: 0,
    color: '#fff',
    textTransform: 'uppercase',
    transform: 'skewX(-7deg) rotate(-2deg)',
    transformOrigin: 'left center',
    WebkitTextStroke: '2.5px #000',
    paintOrder: 'stroke fill',
    textShadow: `3px 3px 0 #000, 6px 7px 0 #000, 0 0 30px ${RED}77, 9px 10px 0 rgba(0,0,0,0.4)`,
  },

  subtitle: {
    fontFamily: MONO,
    fontSize: '11px',
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '14px',
    textShadow: '1px 1px 0 #000',
  },

  backBtn: {
    fontFamily: MONO,
    fontSize: '11px',
    letterSpacing: '0.22em',
    color: MID,
    background: 'rgba(0,0,0,0.45)',
    border: `1px solid ${DIM}`,
    padding: '10px 16px',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'color 0.15s, border-color 0.15s, background 0.15s',
  },

  slotList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
    padding: '14px 18px',
    fontFamily: MONO,
    color: '#ffffff',
    background: 'rgba(8,9,12,0.5)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    border: 'none',
    textAlign: 'left',
  },

  // Slanted accent bar on the left of each row (Persona tab feel).
  slotInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    flex: 1,
    minWidth: 0,
  },

  slotLabel: {
    fontFamily: HEAVY,
    fontSize: 'clamp(22px, 2.6vw, 34px)',
    fontWeight: 400,
    letterSpacing: '0.03em',
    color: '#ffffff',
    textTransform: 'uppercase',
    lineHeight: 1,
    transform: 'skewX(-7deg)',
    transformOrigin: 'left center',
    WebkitTextStroke: '1.5px #000',
    paintOrder: 'stroke fill',
    textShadow: '2px 2px 0 #000, 4px 5px 0 rgba(0,0,0,0.4)',
    transition: 'color 0.15s',
  },

  autosaveTag: {
    marginLeft: '12px',
    fontFamily: MONO,
    fontSize: '10px',
    color: TEAL,
    letterSpacing: '0.2em',
    WebkitTextStroke: '0',
    verticalAlign: 'middle',
  },

  slotMeta: {
    fontFamily: MONO,
    fontSize: '10px',
    letterSpacing: '0.16em',
    color: 'rgba(255,255,255,0.5)',
    textShadow: '1px 1px 0 #000',
  },

  slotGo: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    opacity: 0.5,
    flexShrink: 0,
    transition: 'opacity 0.15s, color 0.15s',
  },

  deleteBtn: {
    width: '46px',
    fontFamily: MONO,
    fontSize: '14px',
    color: DIM,
    background: 'rgba(0,0,0,0.45)',
    border: `1px solid ${DIM}`,
    cursor: 'pointer',
    transition: 'color 0.15s, border-color 0.15s, background 0.15s',
  },

  toast: {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%) skewX(-7deg)',
    padding: '10px 22px',
    fontFamily: HEAVY,
    fontSize: '14px',
    letterSpacing: '0.14em',
    color: '#fff',
    background: RED,
    border: '2px solid #000',
    boxShadow: '3px 3px 0 #000',
    zIndex: 10,
    textTransform: 'uppercase',
  },

  confirmBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  confirmBox: {
    width: 'min(440px, 92vw)',
    padding: '26px 28px 22px',
    background: BG,
    border: `2px solid ${RED}`,
    boxShadow: '6px 6px 0 #000, 0 0 48px rgba(0,0,0,0.6)',
  },
  confirmTitle: {
    fontFamily: HEAVY,
    fontSize: '24px',
    fontWeight: 400,
    color: '#fff',
    letterSpacing: '0.04em',
    marginBottom: '14px',
    textTransform: 'uppercase',
    transform: 'skewX(-7deg)',
    transformOrigin: 'left center',
    WebkitTextStroke: '1.5px #000',
    paintOrder: 'stroke fill',
    textShadow: `2px 2px 0 #000, 0 0 22px ${RED}66`,
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
    background: 'rgba(0,0,0,0.45)',
    border: `1px solid ${DIM}`,
    padding: '10px 18px',
    cursor: 'pointer',
    transition: 'color 0.15s, border-color 0.15s, background 0.15s',
  },
  confirmGo: {
    fontFamily: HEAVY,
    fontSize: '13px',
    letterSpacing: '0.1em',
    color: '#fff',
    background: RED,
    border: '2px solid #000',
    boxShadow: '3px 3px 0 #000',
    padding: '9px 20px',
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
};
