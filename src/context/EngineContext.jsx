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
    unlockApp, unlockComputerApp, setFlag,
  } = useGame();

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
        unlockApp, unlockComputerApp, setFlag,
      },
      stateRef,
    );
  }

  // Seed initial trust scores from story characters[] after mount
  useEffect(() => {
    engineRef.current.initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
