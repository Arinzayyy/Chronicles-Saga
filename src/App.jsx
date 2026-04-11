import { useState, useEffect, useRef } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { EngineProvider } from './context/EngineContext';
import { tryPlay, fadeOut } from './audioController';
import MainMenu        from './screens/MainMenu';
import Prologue        from './screens/Prologue';
import CharacterSelect from './screens/CharacterSelect';
import DeskScene       from './screens/DeskScene';
import PhoneShell      from './screens/PhoneShell';
import PhoneHome       from './screens/PhoneHome';
import SMSApp          from './screens/SMSApp';
import GalleryApp      from './screens/GalleryApp';
import SettingsApp     from './screens/SettingsApp';
import ComputerHome    from './screens/ComputerHome';
import EmailApp        from './screens/EmailApp';
import FilesApp        from './screens/FilesApp';
import Terminal            from './screens/Terminal';
import NotificationBanner  from './screens/NotificationBanner';
import './App.css';

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────
// Wraps any incoming screen: starts at opacity 0, transitions to 1 after paint.
function FadeIn({ children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let r1, r2;
    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#0a0a0f',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>
      {children}
    </div>
  );
}

// ─── Audio lifecycle ──────────────────────────────────────────────────────────
// Starts BGM on first interaction; fades it out only when leaving the prologue.
function AudioManager() {
  const { state } = useGame();
  const { gamePhase } = state;
  const fadedRef    = useRef(false);
  const prevPhaseRef = useRef(null);

  // Attempt autoplay immediately; fall back to first user gesture.
  useEffect(() => {
    tryPlay();
    function onInteract() { tryPlay(); }
    window.addEventListener('click',   onInteract, { once: true });
    window.addEventListener('keydown', onInteract, { once: true });
    return () => {
      window.removeEventListener('click',   onInteract);
      window.removeEventListener('keydown', onInteract);
    };
  }, []);

  // Fade out only when transitioning out of the prologue into playing (only once).
  useEffect(() => {
    const wasInPrologue = prevPhaseRef.current === 'prologue';
    prevPhaseRef.current = gamePhase;

    if (wasInPrologue && gamePhase === 'playing' && !fadedRef.current) {
      fadedRef.current = true;
      fadeOut(800);
    }
  }, [gamePhase]);

  return null;
}

// ─── Router ───────────────────────────────────────────────────────────────────
function GameRouter() {
  const { state } = useGame();
  const { gamePhase, viewerIdentity, currentContext, currentApp } = state;

  // ── Main menu ────────────────────────────────────────────────────────────
  if (gamePhase === 'mainmenu') return <MainMenu />;

  // ── Prologue ─────────────────────────────────────────────────────────────
  if (gamePhase === 'prologue') return <Prologue />;

  if (gamePhase === 'playing') {

    // ── Character select (must choose identity before entering game) ─────
    if (!viewerIdentity) {
      return (
        <FadeIn key="charselect">
          <CharacterSelect />
        </FadeIn>
      );
    }

    // ── Desk hub (no FadeIn — it manages its own entrance) ───────────────
    if (currentContext === 'desk') return <DeskScene />;

    // ── Phone context — all screens rendered inside PhoneShell ───────────
    // A single stable key means PhoneShell persists across app switches;
    // only remounts (and fades in) when first entering phone context.
    if (currentContext === 'phone') {
      return (
        <FadeIn key="phone-context">
          <PhoneShell>
            {!currentApp               && <PhoneHome />}
            {currentApp === 'sms'      && <SMSApp />}
            {currentApp === 'gallery'  && <GalleryApp />}
            {currentApp === 'settings' && <SettingsApp />}
          </PhoneShell>
        </FadeIn>
      );
    }

    // ── Computer context ─────────────────────────────────────────────────
    if (currentContext === 'computer') {
      if (currentApp === 'email')    return <FadeIn key="computer-email"><EmailApp /></FadeIn>;
      if (currentApp === 'files')    return <FadeIn key="computer-files"><FilesApp /></FadeIn>;
      if (currentApp === 'terminal') return <FadeIn key="computer-terminal"><Terminal /></FadeIn>;
      return <FadeIn key="computer-home"><ComputerHome /></FadeIn>;
    }
  }

  return null;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <GameProvider>
      <EngineProvider>
        <AudioManager />
        <GameRouter />
        <NotificationBanner />
      </EngineProvider>
    </GameProvider>
  );
}
