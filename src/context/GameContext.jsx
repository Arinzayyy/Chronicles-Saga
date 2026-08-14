import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import {
  saveGame,
  loadGame,
  clearSave,
  saveToSlot,
  loadFromSlot,
  clearSlot,
} from '../saveState';

const initialState = {
  gamePhase: 'mainmenu',       // mainmenu | prologue | playing | gameover
  viewerIdentity: null,        // Dara | Zael | Seun | Fox | null
  currentBeat: null,
  currentContext: 'desk',      // desk | phone | computer
  currentApp: null,            // sms | email | files | terminal | gallery | settings | null

  // Keyed by character id (char_murna, char_kelvin, …)
  // Seeded by Engine.initialize() from story characters[].trust_initial
  trustScores: {},

  // Capital keys match story.json alignment_axes values exactly
  alignmentScores: {
    Integration: 0,
    Dominion:    0,
    Calibration: 0,
  },

  // { threadId: [ { id, sender, threadId, body, timestamp, isGhost, isSystem, isRead, isPhoto?, photoId? } ] }
  messageThreads: {},

  // { threadId: string[] }  — character ids currently showing typing indicator
  typingIndicators: {},

  // { threadId: { id, isGroup, members: string[] } }
  threads: {},

  // { threadId: timestamp } — story-driven "bump to top of inbox" (Ch 8 dead thread)
  threadBumps: {},

  unlockedApps: ['sms', 'gallery', 'settings'],
  unlockedComputerApps: [],

  // Files and photos unlocked via story beats
  unlockedFiles:  [],
  unlockedPhotos: [],

  // Settings entries mutated by story directives: { key: value }
  settings: {},

  // Whether the player has established a silence pattern
  silencePattern: false,

  // Emails from story beats: [ { id, from, subject, body, threadId, isRead } ]
  emails: [],

  flags: {},

  // Narration overlay lines for the current beat: [{ id, body, rogue }]
  narration: [],

  // Ordered log of executed beat ids
  beatHistory: [],
};

function reducer(state, action) {
  switch (action.type) {

    case 'START_GAME':
      return { ...state, gamePhase: 'playing', currentBeat: action.beatId ?? null };

    // Full reset to a fresh run. Fixes the bug where "New Game" kept the old
    // run's messages, trust, identity, and beatHistory in memory.
    case 'RESET_GAME':
      return { ...initialState, gamePhase: 'playing' };

    case 'SET_VIEWER_IDENTITY':
      return { ...state, viewerIdentity: action.identity, gamePhase: 'prologue' };

    case 'COMPLETE_PROLOGUE':
      return { ...state, gamePhase: 'playing', currentContext: 'desk' };

    case 'SET_BEAT':
      return {
        ...state,
        currentBeat: action.beatId,
        beatHistory: [...state.beatHistory, action.beatId],
        // Narration is per-beat; a new beat starts a clean slate
        narration: [],
      };

    case 'PUSH_NARRATION':
      return { ...state, narration: [...state.narration, action.line] };

    case 'SET_CONTEXT':
      return { ...state, currentContext: action.context, currentApp: null };

    case 'SET_APP':
      return { ...state, currentApp: action.app };

    // ── Trust ───────────────────────────────────────────────────────────────

    case 'UPDATE_TRUST': {
      const prev = state.trustScores[action.characterId] ?? 0;
      return {
        ...state,
        trustScores: {
          ...state.trustScores,
          [action.characterId]: Math.max(0, Math.min(100, prev + action.delta)),
        },
      };
    }

    case 'UPDATE_ALIGNMENT': {
      const prev = state.alignmentScores[action.axis] ?? 0;
      return {
        ...state,
        alignmentScores: {
          ...state.alignmentScores,
          [action.axis]: Math.max(-100, Math.min(100, prev + action.delta)),
        },
      };
    }

    // ── Messages ────────────────────────────────────────────────────────────

    case 'ADD_MESSAGE': {
      const thread = state.messageThreads[action.threadId] ?? [];
      return {
        ...state,
        messageThreads: {
          ...state.messageThreads,
          [action.threadId]: [...thread, action.message],
        },
      };
    }

    case 'MARK_THREAD_READ': {
      const thread = (state.messageThreads[action.threadId] ?? []).map(m => ({
        ...m, isRead: true,
      }));
      return {
        ...state,
        messageThreads: { ...state.messageThreads, [action.threadId]: thread },
      };
    }

    case 'REMOVE_GHOST_MESSAGE': {
      const thread = (state.messageThreads[action.threadId] ?? []).filter(
        m => m.id !== action.messageId,
      );
      return {
        ...state,
        messageThreads: { ...state.messageThreads, [action.threadId]: thread },
      };
    }

    // Rename every message in a thread whose sender === fromId to toId.
    case 'RESOLVE_ALIAS': {
      const thread = (state.messageThreads[action.threadId] ?? []).map(m =>
        m.sender === action.fromId ? { ...m, sender: action.toId } : m,
      );
      return {
        ...state,
        messageThreads: { ...state.messageThreads, [action.threadId]: thread },
      };
    }

    // ── Typing indicators ───────────────────────────────────────────────────

    case 'SET_TYPING_INDICATOR': {
      const current = state.typingIndicators[action.threadId] ?? [];
      let next;
      if (action.isTyping) {
        next = current.includes(action.characterId)
          ? current
          : [...current, action.characterId];
      } else {
        next = current.filter(id => id !== action.characterId);
      }
      return {
        ...state,
        typingIndicators: { ...state.typingIndicators, [action.threadId]: next },
      };
    }

    // ── Thread metadata ─────────────────────────────────────────────────────

    case 'CREATE_GROUP_THREAD':
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.threadId]: {
            id:      action.threadId,
            isGroup: true,
            members: action.members,
          },
        },
      };

    case 'ADD_TO_GROUP_THREAD': {
      const existing = state.threads[action.threadId];
      if (!existing) return state;
      if (existing.members.includes(action.characterId)) return state;
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.threadId]: {
            ...existing,
            members: [...existing.members, action.characterId],
          },
        },
      };
    }

    case 'REMOVE_FROM_GROUP_THREAD': {
      const existing = state.threads[action.threadId];
      if (!existing) return state;
      if (!existing.members.includes(action.characterId)) return state;
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.threadId]: {
            ...existing,
            members: existing.members.filter(id => id !== action.characterId),
          },
        },
      };
    }

    // Story-driven inbox reorder: the bumped thread sorts to the top of the
    // thread list (Ch 8 — Halima's dead thread moves. Unprompted.)
    case 'BUMP_THREAD':
      return {
        ...state,
        threadBumps: { ...state.threadBumps, [action.threadId]: Date.now() },
      };

    // Read receipt on a single player-sent message (Ch 8 dead-thread payoff —
    // receipts land one by one, seconds apart. Distinct from isRead, which is
    // the player's own unread-count bookkeeping.)
    case 'MARK_MESSAGE_RECEIPT': {
      const thread = (state.messageThreads[action.threadId] ?? []).map(m =>
        m.id === action.messageId ? { ...m, receiptRead: true } : m,
      );
      return {
        ...state,
        messageThreads: { ...state.messageThreads, [action.threadId]: thread },
      };
    }

    // ── Apps / Files / Photos ───────────────────────────────────────────────

    case 'UNLOCK_APP':
      if (state.unlockedApps.includes(action.app)) return state;
      return { ...state, unlockedApps: [...state.unlockedApps, action.app] };

    case 'UNLOCK_COMPUTER_APP':
      if (state.unlockedComputerApps.includes(action.app)) return state;
      return { ...state, unlockedComputerApps: [...state.unlockedComputerApps, action.app] };

    case 'UNLOCK_PHOTO':
      if (state.unlockedPhotos.includes(action.photoId)) return state;
      return { ...state, unlockedPhotos: [...state.unlockedPhotos, action.photoId] };

    case 'UNLOCK_FILE':
      return { ...state, unlockedFiles: [...state.unlockedFiles, action.file] };

    // ── Settings ────────────────────────────────────────────────────────────

    case 'MUTATE_SETTING':
      return { ...state, settings: { ...state.settings, [action.key]: action.value } };

    // ── Emails ──────────────────────────────────────────────────────────────

    case 'ADD_EMAIL':
      return { ...state, emails: [...state.emails, action.email] };

    case 'MARK_EMAIL_READ': {
      const emails = state.emails.map(e =>
        e.id === action.emailId ? { ...e, isRead: true } : e,
      );
      return { ...state, emails };
    }

    // ── Flags ────────────────────────────────────────────────────────────────

    case 'SET_FLAG':
      return { ...state, flags: { ...state.flags, [action.key]: action.value } };

    // ── Save / Load ─────────────────────────────────────────────────────────────
    // Replaces the entire state with what was read from localStorage.
    // We keep typingIndicators empty because those are live animation state —
    // restoring them mid-animation would look broken.
    case 'LOAD_SAVE':
      return {
        ...action.savedState,
        // Older saves predate threadBumps — never let it come back undefined
        threadBumps: action.savedState.threadBumps ?? {},
        typingIndicators: {},
        // Signal EngineContext to resume mid-beat progression after load
        flags: { ...(action.savedState.flags ?? {}), __pendingResume__: true },
      };

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Auto-save ──────────────────────────────────────────────────────────────
  // Fires on two triggers:
  //   1. beatHistory grows  → the story advanced to a new beat
  //   2. messageThreads changes → messages/threads have arrived in state
  //
  // We need BOTH because beats are recorded in state before their directive
  // timeouts fire. If we only saved on beat changes, the save could capture
  // the new beat ID but miss the messages that arrive 0–650ms later.
  // Saving on messageThreads too ensures thread_temp3 (and any group chat)
  // is always fully captured before a potential reload.
  useEffect(() => {
    if (state.gamePhase !== 'mainmenu') {
      saveGame(state);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.beatHistory, state.messageThreads, state.threads]);

  // ── Continue game (load from localStorage) ─────────────────────────────────
  // Reads the save file and restores the full game state in one dispatch.
  const continueGame = useCallback(() => {
    const savedState = loadGame();
    if (savedState) {
      dispatch({ type: 'LOAD_SAVE', savedState });
    }
  }, []);

  // ── New game helper (wipes autosave; manual slots are preserved) ───────────
  const newGame = useCallback(() => {
    clearSave();
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // ── Multi-slot save/load ───────────────────────────────────────────────────
  // Load any slot (autosave or a manual slot) into the running game.
  const loadSlot = useCallback((slotId) => {
    const saved = loadFromSlot(slotId);
    if (saved) {
      dispatch({ type: 'LOAD_SAVE', savedState: saved });
      return true;
    }
    return false;
  }, []);

  // Manually save the current state to a given slot (overwrites if occupied).
  // Returns true on success, false if called from the main menu or on failure.
  const saveSlot = useCallback((slotId) => {
    return saveToSlot(slotId, state);
  }, [state]);

  // Delete a slot's contents (used by "Delete" buttons in the slot-select UI).
  const deleteSlot = useCallback((slotId) => {
    clearSlot(slotId);
  }, []);

  const startGame = useCallback((beatId) => {
    dispatch({ type: 'START_GAME', beatId });
  }, []);

  const setViewerIdentity = useCallback((identity) => {
    dispatch({ type: 'SET_VIEWER_IDENTITY', identity });
  }, []);

  const completePrologue = useCallback(() => {
    dispatch({ type: 'COMPLETE_PROLOGUE' });
  }, []);

  const setBeat = useCallback((beatId) => {
    dispatch({ type: 'SET_BEAT', beatId });
  }, []);

  const setContext = useCallback((context) => {
    dispatch({ type: 'SET_CONTEXT', context });
  }, []);

  const setApp = useCallback((app) => {
    dispatch({ type: 'SET_APP', app });
  }, []);

  const updateTrust = useCallback((characterId, delta) => {
    dispatch({ type: 'UPDATE_TRUST', characterId, delta });
  }, []);

  const updateAlignment = useCallback((axis, delta) => {
    dispatch({ type: 'UPDATE_ALIGNMENT', axis, delta });
  }, []);

  const addMessage = useCallback((threadId, message) => {
    dispatch({ type: 'ADD_MESSAGE', threadId, message });
  }, []);

  const markThreadRead = useCallback((threadId) => {
    dispatch({ type: 'MARK_THREAD_READ', threadId });
  }, []);

  const removeGhostMessage = useCallback((threadId, messageId) => {
    dispatch({ type: 'REMOVE_GHOST_MESSAGE', threadId, messageId });
  }, []);

  const resolveAlias = useCallback((threadId, fromId, toId) => {
    dispatch({ type: 'RESOLVE_ALIAS', threadId, fromId, toId });
  }, []);

  const setTypingIndicator = useCallback((threadId, characterId, isTyping) => {
    dispatch({ type: 'SET_TYPING_INDICATOR', threadId, characterId, isTyping });
  }, []);

  const createGroupThread = useCallback((threadId, members) => {
    dispatch({ type: 'CREATE_GROUP_THREAD', threadId, members });
  }, []);

  const addToGroupThread = useCallback((threadId, characterId) => {
    dispatch({ type: 'ADD_TO_GROUP_THREAD', threadId, characterId });
  }, []);

  const removeFromGroupThread = useCallback((threadId, characterId) => {
    dispatch({ type: 'REMOVE_FROM_GROUP_THREAD', threadId, characterId });
  }, []);

  const bumpThread = useCallback((threadId) => {
    dispatch({ type: 'BUMP_THREAD', threadId });
  }, []);

  const markMessageReceipt = useCallback((threadId, messageId) => {
    dispatch({ type: 'MARK_MESSAGE_RECEIPT', threadId, messageId });
  }, []);

  const unlockApp = useCallback((app) => {
    dispatch({ type: 'UNLOCK_APP', app });
  }, []);

  const unlockComputerApp = useCallback((app) => {
    dispatch({ type: 'UNLOCK_COMPUTER_APP', app });
  }, []);

  const unlockPhoto = useCallback((photoId) => {
    dispatch({ type: 'UNLOCK_PHOTO', photoId });
  }, []);

  const unlockFile = useCallback((file) => {
    dispatch({ type: 'UNLOCK_FILE', file });
  }, []);

  const mutateSetting = useCallback((key, value) => {
    dispatch({ type: 'MUTATE_SETTING', key, value });
  }, []);

  const addEmail = useCallback((email) => {
    dispatch({ type: 'ADD_EMAIL', email });
  }, []);

  const markEmailRead = useCallback((emailId) => {
    dispatch({ type: 'MARK_EMAIL_READ', emailId });
  }, []);

  const setFlag = useCallback((key, value) => {
    dispatch({ type: 'SET_FLAG', key, value });
  }, []);

  const pushNarration = useCallback((line) => {
    dispatch({ type: 'PUSH_NARRATION', line });
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      startGame,
      continueGame,
      newGame,
      loadSlot,
      saveSlot,
      deleteSlot,
      setViewerIdentity,
      completePrologue,
      setBeat,
      setContext,
      setApp,
      updateTrust,
      updateAlignment,
      addMessage,
      markThreadRead,
      removeGhostMessage,
      resolveAlias,
      setTypingIndicator,
      createGroupThread,
      addToGroupThread,
      removeFromGroupThread,
      bumpThread,
      markMessageReceipt,
      unlockApp,
      unlockComputerApp,
      unlockPhoto,
      unlockFile,
      mutateSetting,
      addEmail,
      markEmailRead,
      setFlag,
      pushNarration,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within <GameProvider>');
  return ctx;
}
