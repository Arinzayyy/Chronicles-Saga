import { createContext, useContext, useRef, useEffect } from 'react';
import { Engine } from '../engine/engine.js';
import { useGame } from './GameContext';

const EngineContext = createContext(null);

export function EngineProvider({ children }) {
  const {
    state,
    setBeat, setContext, setApp,
    updateTrust, updateAlignment,
    addMessage, removeGhostMessage,
    resolveAlias, setTypingIndicator,
    createGroupThread, addToGroupThread,
    removeFromGroupThread, bumpThread, markMessageReceipt,
    unlockApp, unlockComputerApp, setFlag,
    pushNarration, unlockFile,
  } = useGame();

  // ── Resume after save-load ──────────────────────────────────────────────────
  // When LOAD_SAVE is dispatched, flags.__pendingResume__ is set to true.
  // We detect it here and re-fire the auto-advance for any beat that was
  // in-progress when the player refreshed (i.e. its on_complete timer was lost).
  // Beats with player_choices don't need this — the UI re-shows them from
  // state.currentBeat automatically.
  useEffect(() => {
    if (!state.flags?.__pendingResume__) return;

    // A save was just loaded: kill any in-flight timers from the abandoned
    // run so stale directives can't fire into the restored state.
    engineRef.current?._clearTimers();

    // Clear the flag immediately so this effect doesn't re-fire
    setFlag('__pendingResume__', false);

    const currentBeat = state.currentBeat;
    if (!currentBeat) return;

    const beat = engineRef.current?.beatMap?.[currentBeat];
    if (!beat) return;

    // If beat has player choices, the UI re-renders them — no advancement needed.
    // Its messages are already restored as history, so the NPC is "done": mark
    // the beat settled or the choices stay gated forever (they wait on the
    // __beatSettled__ signal that only fires while a beat is actively running).
    if (beat.player_choices?.length > 0) {
      setFlag('__beatSettled__', { beat: currentBeat, ts: Date.now() });
      return;
    }

    // If the beat was supposed to auto-advance but the on_complete beat never ran,
    // fire it now to unblock progression
    if (beat.on_complete && !state.beatHistory.includes(beat.on_complete)) {
      // Short delay so the restored state fully renders before the engine fires
      setTimeout(() => engineRef.current?.advanceBeat(beat.on_complete), 150);
    }
  }, [state.flags?.__pendingResume__]); // eslint-disable-line react-hooks/exhaustive-deps

  // Always-fresh state ref so Engine timers/closures see live state
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Engine is created once and lives for the session.
  // Engine imports storyData itself — do not pass it here.
  const engineRef = useRef(null);
  if (!engineRef.current) {
    engineRef.current = new Engine(
      {
        setBeat, setContext, setApp,
        updateTrust, updateAlignment,
        addMessage, removeGhostMessage,
        resolveAlias, setTypingIndicator,
        createGroupThread, addToGroupThread,
        removeFromGroupThread, bumpThread, markMessageReceipt,
        unlockApp, unlockComputerApp, setFlag,
        pushNarration, unlockFile,
      },
      stateRef,
    );
  }

  // Seed initial trust scores from story characters[] after mount
  useEffect(() => {
    engineRef.current.initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-start the story: once the player is in the game with an identity and
  // no beats have run (fresh run or post-RESET_GAME), load the season's first
  // beat. Replaces the old hardcoded loadBeat in SMSApp.
  useEffect(() => {
    if (state.gamePhase !== 'playing') return;
    if (!state.viewerIdentity) return;
    if (state.beatHistory.length > 0) return;
    const first = engineRef.current?.firstBeatId?.();
    if (first) engineRef.current.loadBeat(first);
  }, [state.gamePhase, state.viewerIdentity, state.beatHistory.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => engineRef.current?.destroy(), []);

  return (
    <EngineContext.Provider value={engineRef.current}>
      {children}
    </EngineContext.Provider>
  );
}

export function useEngine() {
  const engine = useContext(EngineContext);
  if (!engine) throw new Error('useEngine must be used within <EngineProvider>');
  return engine;
}
