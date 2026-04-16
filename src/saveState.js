// ─── Save State Utility ────────────────────────────────────────────────────────
//
// Handles reading and writing game progress to localStorage.
// This file has no React dependencies — it's plain JS so it can be imported
// anywhere without pulling in the full context tree.
//
// localStorage stores one key: "chronicles_save_v2"
// The value is a JSON object: { version, savedAt, state }
//
// We bump SAVE_VERSION any time the shape of state changes in a breaking way,
// which automatically invalidates old saves rather than crashing on bad data.

const SAVE_KEY     = 'chronicles_save_v2';
const SAVE_VERSION = 2;

// Fields we deliberately do NOT persist:
// - typingIndicators: live animation state, meaningless when restored
// Everything else in GameContext state is saved.

/**
 * Writes the current game state to localStorage.
 * Called automatically by GameContext whenever a new beat is reached.
 *
 * @param {object} state - The full GameContext state object
 */
export function saveGame(state) {
  // Don't save on the main menu — there's nothing meaningful to save yet.
  if (state.gamePhase === 'mainmenu') return;

  try {
    const saveData = {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      state: {
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
        flags:                Object.fromEntries(
          Object.entries(state.flags ?? {}).filter(([k]) => k !== '__pendingResume__')
        ),
        beatHistory:          state.beatHistory,
      },
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (e) {
    // Storage quota exceeded or private browsing — fail silently.
    console.warn('[Chronicles] Failed to save game:', e);
  }
}

/**
 * Reads the save from localStorage and returns the saved state object.
 * Returns null if no save exists or the data is invalid/outdated.
 *
 * @returns {object|null} The saved state, or null
 */
export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
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
 * Returns true if a valid save exists for the Continue button.
 *
 * @returns {boolean}
 */
export function hasSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw);
    return (
      parsed &&
      parsed.version === SAVE_VERSION &&
      parsed.state?.gamePhase !== 'mainmenu'
    );
  } catch {
    return false;
  }
}

/**
 * Deletes the save from localStorage.
 * Called when the player starts a New Game so they don't accidentally
 * overwrite a fresh run with old save data.
 */
export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
