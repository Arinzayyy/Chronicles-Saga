// ─── Save State Utility ────────────────────────────────────────────────────────
//
// Handles reading and writing game progress to localStorage.
// This file has no React dependencies — it's plain JS so it can be imported
// anywhere without pulling in the full context tree.
//
// Multi-slot layout:
//   - 1 dedicated autosave slot (id: "autosave")
//   - 5 manual slots           (ids: "slot_1" … "slot_5")
//
// Each slot is stored under its own localStorage key:
//   chronicles_save_v2__autosave
//   chronicles_save_v2__slot_1
//   …
//   chronicles_save_v2__slot_5
//
// The stored value is JSON: { version, savedAt, state }
// SAVE_VERSION is bumped when the state shape changes in a breaking way,
// which automatically invalidates old saves rather than crashing on bad data.

const SAVE_KEY_PREFIX  = 'chronicles_save_v2';
const LEGACY_SAVE_KEY  = 'chronicles_save_v2';        // pre-multi-slot single-save key
const SAVE_VERSION     = 2;

export const AUTOSAVE_SLOT_ID = 'autosave';
export const MANUAL_SLOT_COUNT = 5;

// Ordered list of slot ids used by the UI (autosave first).
export const SLOT_IDS = [
  AUTOSAVE_SLOT_ID,
  ...Array.from({ length: MANUAL_SLOT_COUNT }, (_, i) => `slot_${i + 1}`),
];

function slotKey(slotId) {
  return `${SAVE_KEY_PREFIX}__${slotId}`;
}

// Fields we deliberately do NOT persist:
// - typingIndicators: live animation state, meaningless when restored
// Everything else in GameContext state is saved.
function serializeState(state) {
  return {
    gamePhase:            state.gamePhase,
    viewerIdentity:       state.viewerIdentity,
    currentBeat:          state.currentBeat,
    currentContext:       state.currentContext,
    currentApp:           state.currentApp,
    trustScores:          state.trustScores,
    alignmentScores:      state.alignmentScores,
    messageThreads:       state.messageThreads,
    threads:              state.threads,
    unlockedApps:         state.unlockedApps,
    unlockedComputerApps: state.unlockedComputerApps,
    unlockedFiles:        state.unlockedFiles,
    unlockedPhotos:       state.unlockedPhotos,
    settings:             state.settings,
    silencePattern:       state.silencePattern,
    emails:               state.emails,
    // Strip internal resume flag — it should never be persisted
    flags: Object.fromEntries(
      Object.entries(state.flags ?? {}).filter(([k]) => k !== '__pendingResume__'),
    ),
    beatHistory:          state.beatHistory,
  };
}

// ─── Legacy migration ──────────────────────────────────────────────────────────
// Old versions of the game wrote a single save under "chronicles_save_v2"
// (no suffix). On any slot read, if a legacy save is still sitting there,
// move it into the autosave slot so the player doesn't silently lose their
// in-progress run after upgrading.
//
// This is idempotent and cheap: after the first successful migration the
// legacy key is removed, so subsequent calls short-circuit on `!raw`.
function migrateLegacySave() {
  try {
    const raw = localStorage.getItem(LEGACY_SAVE_KEY);
    if (!raw) return;
    const autosaveKey = slotKey(AUTOSAVE_SLOT_ID);
    // Only migrate if autosave slot is empty — otherwise we'd overwrite newer data.
    if (!localStorage.getItem(autosaveKey)) {
      localStorage.setItem(autosaveKey, raw);
    }
    localStorage.removeItem(LEGACY_SAVE_KEY);
  } catch {
    /* no-op */
  }
}

// ─── Slot read/write ───────────────────────────────────────────────────────────

/**
 * Writes the given state to a specific slot.
 * @param {string} slotId  — "autosave" | "slot_1" | … | "slot_5"
 * @param {object} state   — the full GameContext state object
 */
export function saveToSlot(slotId, state) {
  if (!SLOT_IDS.includes(slotId)) {
    console.warn('[Chronicles] saveToSlot: invalid slot id', slotId);
    return false;
  }
  // Don't save on the main menu — there's nothing meaningful to capture.
  if (state?.gamePhase === 'mainmenu') return false;

  try {
    const payload = {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      state:   serializeState(state),
    };
    localStorage.setItem(slotKey(slotId), JSON.stringify(payload));
    return true;
  } catch (e) {
    // Storage quota exceeded or private browsing — fail silently.
    console.warn('[Chronicles] Failed to save game to', slotId, e);
    return false;
  }
}

/**
 * Reads a specific slot and returns the saved state, or null if missing/invalid.
 * @param {string} slotId
 * @returns {object|null}
 */
export function loadFromSlot(slotId) {
  migrateLegacySave();
  if (!SLOT_IDS.includes(slotId)) return null;

  try {
    const raw = localStorage.getItem(slotKey(slotId));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== SAVE_VERSION) return null;
    if (!parsed.state) return null;

    return parsed.state;
  } catch {
    return null;
  }
}

/**
 * Returns the full metadata record for a slot (even if empty) — used by the
 * slot-select UI so it can show "empty" slots alongside used ones.
 * @param {string} slotId
 * @returns {{ id: string, exists: boolean, savedAt: number|null, isAutosave: boolean }}
 */
export function getSlotMeta(slotId) {
  migrateLegacySave();
  const base = {
    id:         slotId,
    exists:     false,
    savedAt:    null,
    isAutosave: slotId === AUTOSAVE_SLOT_ID,
  };
  if (!SLOT_IDS.includes(slotId)) return base;

  try {
    const raw = localStorage.getItem(slotKey(slotId));
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== SAVE_VERSION || !parsed.state) return base;
    return {
      ...base,
      exists:  true,
      savedAt: typeof parsed.savedAt === 'number' ? parsed.savedAt : null,
    };
  } catch {
    return base;
  }
}

/** All slot metadata in UI order (autosave first, then slot_1…slot_5). */
export function getAllSlots() {
  return SLOT_IDS.map(getSlotMeta);
}

/** Delete a slot's save data. */
export function clearSlot(slotId) {
  if (!SLOT_IDS.includes(slotId)) return;
  try {
    localStorage.removeItem(slotKey(slotId));
  } catch {
    /* no-op */
  }
}

// ─── Legacy API (kept so existing callers don't break) ────────────────────────
// These still work — they just operate on the autosave slot now.

/**
 * Autosave: writes the current state to the dedicated autosave slot.
 * Called automatically by GameContext whenever a new beat is reached.
 */
export function saveGame(state) {
  return saveToSlot(AUTOSAVE_SLOT_ID, state);
}

/**
 * Loads the autosave slot (old "Continue" behavior).
 * Returns the saved state or null.
 */
export function loadGame() {
  return loadFromSlot(AUTOSAVE_SLOT_ID);
}

/** True if ANY slot (autosave or manual) contains a valid save. */
export function hasSave() {
  return getAllSlots().some(s => s.exists);
}

/**
 * Clears the autosave slot only. Used by "New Game" so a fresh run doesn't
 * instantly get clobbered by the previous run's autosave on the next tick.
 * Manual slots are never touched by this — they're only overwritten
 * when the player explicitly saves to them from the slot-select UI.
 */
export function clearSave() {
  clearSlot(AUTOSAVE_SLOT_ID);
}
