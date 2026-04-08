import { createContext, useContext, useReducer, useCallback } from 'react';

const initialState = {
  gamePhase: 'mainmenu',       // mainmenu | playing | gameover
  viewerIdentity: null,        // Sable | Cael | Riven | Yara | null
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

  // Ordered log of executed beat ids
  beatHistory: [],
};

function reducer(state, action) {
  switch (action.type) {

    case 'START_GAME':
      return { ...state, gamePhase: 'playing', currentBeat: action.beatId ?? null };

    case 'SET_VIEWER_IDENTITY':
      return { ...state, viewerIdentity: action.identity };

    case 'SET_BEAT':
      return {
        ...state,
        currentBeat: action.beatId,
        beatHistory: [...state.beatHistory, action.beatId],
      };

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

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startGame = useCallback((beatId) => {
    dispatch({ type: 'START_GAME', beatId });
  }, []);

  const setViewerIdentity = useCallback((identity) => {
    dispatch({ type: 'SET_VIEWER_IDENTITY', identity });
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

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      startGame,
      setViewerIdentity,
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
      unlockApp,
      unlockComputerApp,
      unlockPhoto,
      unlockFile,
      mutateSetting,
      addEmail,
      markEmailRead,
      setFlag,
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
