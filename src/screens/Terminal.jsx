import { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useEngine } from '../context/EngineContext';
import { playClick } from '../utils/sound';

// ─── Minigame generation ───────────────────────────────────────────────────
const HEX_CHARS = '0123456789ABCDEF';

function randHex2() {
  return HEX_CHARS[Math.floor(Math.random() * 16)] + HEX_CHARS[Math.floor(Math.random() * 16)];
}

function generateMinigame() {
  // Pick 4 unique target values
  const targets = [];
  while (targets.length < 4) {
    const v = randHex2();
    if (!targets.includes(v)) targets.push(v);
  }

  // Pick 4 distinct grid positions for the correct cells
  const positions = [];
  while (positions.length < 4) {
    const p = Math.floor(Math.random() * 36);
    if (!positions.includes(p)) positions.push(p);
  }

  // Build 36 cells; solution cells get target values, rest get filler
  const cells = Array.from({ length: 36 }, (_, i) => {
    const solIdx = positions.indexOf(i);
    if (solIdx !== -1) {
      return { char: targets[solIdx], targetIndex: solIdx, isSolution: true };
    }
    // Filler must not accidentally match any target
    let char;
    do { char = randHex2(); } while (targets.includes(char));
    return { char, targetIndex: -1, isSolution: false };
  });

  return { cells, targets };
}

// ─── Main screen ───────────────────────────────────────────────────────────
export default function Terminal() {
  const { state, setApp, setFlag } = useGame();
  const engine = useEngine();

  // Minigame config from engine flag; null = idle
  const minigameCfg = state.flags.__minigame__ ?? null;

  const [game,        setGame]        = useState(null);   // generated grid data
  const [nextTarget,  setNextTarget]  = useState(0);      // 0..3
  const [timeLeft,    setTimeLeft]    = useState(0);
  const [gameOver,    setGameOver]    = useState(null);   // null | 'success' | 'failure'
  const [wrongFlash,  setWrongFlash]  = useState(false);
  const timerRef = useRef(null);

  // Start the minigame when the engine fires trigger_minigame
  useEffect(() => {
    if (!minigameCfg || game) return;
    const newGame = generateMinigame();
    setGame(newGame);
    setNextTarget(0);
    setTimeLeft(minigameCfg.time_limit_seconds ?? 30);
    setGameOver(null);
  }, [minigameCfg]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer
  useEffect(() => {
    if (!game || gameOver) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleGameEnd(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [game, gameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGameEnd = useCallback((success) => {
    if (gameOver) return;
    setGameOver(success ? 'success' : 'failure');
    clearInterval(timerRef.current);
    const cfg = state.flags.__minigame__;
    const beatId = success ? cfg?.on_success : cfg?.on_failure;
    setTimeout(() => {
      setFlag('__minigame__', null);
      setGame(null);
      if (beatId) engine.advanceBeat(beatId);
    }, 1800);
  }, [gameOver, state.flags.__minigame__, engine, setFlag]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleCellClick(cell) {
    if (!game || gameOver) return;
    playClick();
    if (!cell.isSolution || cell.targetIndex !== nextTarget) {
      // Wrong cell — brief flash
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 220);
      return;
    }
    const next = nextTarget + 1;
    setNextTarget(next);
    if (next >= 4) {
      handleGameEnd(true);
    }
  }

  // ── Minigame active ────────────────────────────────────────────────────
  if (game && minigameCfg) {
    return (
      <MinigameView
        game={game}
        config={minigameCfg}
        nextTarget={nextTarget}
        timeLeft={timeLeft}
        gameOver={gameOver}
        wrongFlash={wrongFlash}
        onCellClick={handleCellClick}
      />
    );
  }

  // ── Idle terminal ──────────────────────────────────────────────────────
  return (
    <IdleTerminal onBack={() => setApp(null)} />
  );
}

// ─── Minigame view ─────────────────────────────────────────────────────────
function MinigameView({ game, config, nextTarget, timeLeft, gameOver, wrongFlash, onCellClick }) {
  const timerPct = timeLeft / (config.time_limit_seconds ?? 30);
  const timerColor = timerPct > 0.5 ? '#39ff14' : timerPct > 0.25 ? '#EF9F27' : '#fc5c5c';

  return (
    <div style={mg.root}>
      <div style={mg.header}>
        <div>
          <p style={mg.missionLabel}>{config.label}</p>
          <p style={mg.missionSub}>click sequence in order</p>
        </div>
        <div style={{ ...mg.timer, color: timerColor, borderColor: timerColor }}>
          <span style={mg.timerNum}>{String(timeLeft).padStart(2,'0')}</span>
          <span style={mg.timerUnit}>s</span>
        </div>
      </div>

      {/* Target sequence display */}
      <div style={mg.sequenceRow}>
        {game.targets.map((t, i) => (
          <div
            key={i}
            style={{
              ...mg.seqCell,
              color: i < nextTarget
                ? 'rgba(255,255,255,0.22)'
                : i === nextTarget
                ? '#39ff14'
                : 'rgba(255,255,255,0.5)',
              borderColor: i < nextTarget
                ? 'rgba(255,255,255,0.1)'
                : i === nextTarget
                ? '#39ff14'
                : 'rgba(255,255,255,0.2)',
              textDecoration: i < nextTarget ? 'line-through' : 'none',
              boxShadow: i === nextTarget ? '0 0 8px rgba(57,255,20,0.4)' : 'none',
            }}
          >
            {t}
          </div>
        ))}
        <span style={mg.seqArrow}>→ {nextTarget}/4</span>
      </div>

      {/* Hex grid */}
      <div style={{
        ...mg.grid,
        border: wrongFlash ? '1px solid rgba(252,92,92,0.5)' : '1px solid rgba(57,255,20,0.1)',
        transition: 'border-color 0.1s',
      }}>
        {game.cells.map((cell, i) => (
          <HexCell
            key={i}
            cell={cell}
            isCurrentTarget={cell.isSolution && cell.targetIndex === nextTarget}
            isSolved={cell.isSolution && cell.targetIndex < nextTarget}
            onClick={() => onCellClick(cell)}
            gameOver={!!gameOver}
          />
        ))}
      </div>

      {/* Result overlay */}
      {gameOver && (
        <div style={mg.resultOverlay}>
          <p style={{
            ...mg.resultText,
            color: gameOver === 'success' ? '#39ff14' : '#fc5c5c',
          }}>
            {gameOver === 'success' ? '[ ACCESS GRANTED ]' : '[ ACCESS DENIED ]'}
          </p>
        </div>
      )}

      <style>{mgCss}</style>
    </div>
  );
}

function HexCell({ cell, isCurrentTarget, isSolved, onClick, gameOver }) {
  const [hov, setHov] = useState(false);

  const bg = isSolved
    ? 'rgba(57,255,20,0.06)'
    : isCurrentTarget && hov
    ? 'rgba(57,255,20,0.18)'
    : isCurrentTarget
    ? 'rgba(57,255,20,0.08)'
    : hov
    ? 'rgba(255,255,255,0.06)'
    : 'transparent';

  const color = isSolved
    ? 'rgba(57,255,20,0.25)'
    : isCurrentTarget
    ? '#39ff14'
    : 'rgba(255,255,255,0.45)';

  return (
    <button
      style={{
        ...mg.cell,
        background:   bg,
        color,
        borderColor:  isCurrentTarget ? 'rgba(57,255,20,0.4)' : 'rgba(255,255,255,0.06)',
        cursor:       gameOver ? 'default' : 'pointer',
        animation:    isCurrentTarget && !isSolved ? 'hexPulse 1.6s ease-in-out infinite' : 'none',
      }}
      onClick={gameOver ? undefined : onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {cell.char}
    </button>
  );
}

// ─── Idle terminal ─────────────────────────────────────────────────────────
function IdleTerminal({ onBack }) {
  const [cursorOn, setCursorOn] = useState(true);
  const [lines, setLines] = useState([
    { text: 'CHRONICLES SAGA OS  v0.1.0', color: '#39ff14' },
    { text: '─────────────────────────', color: 'rgba(57,255,20,0.3)' },
    { text: 'system ready.', color: '#EF9F27' },
    { text: 'no active processes.', color: 'rgba(255,255,255,0.3)' },
  ]);

  useEffect(() => {
    const id = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const delays = [800, 1600, 2800];
    const messages = [
      { text: 'waiting for signal...', color: 'rgba(255,255,255,0.22)' },
      { text: 'network: encrypted', color: 'rgba(57,255,20,0.5)' },
      { text: 'standby.', color: 'rgba(239,159,39,0.6)' },
    ];
    const timers = delays.map((d, i) =>
      setTimeout(() => setLines(prev => [...prev, messages[i]]), d),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={t.root}>
      {/* Scanlines */}
      <div style={t.scanlines} aria-hidden="true" />

      {/* Terminal output */}
      <div style={t.output}>
        {lines.map((line, i) => (
          <p key={i} style={{ ...t.line, color: line.color }}>{line.text}</p>
        ))}
        <p style={t.prompt}>
          <span style={t.promptChar}>&gt; </span>
          <span style={{ ...t.cursor, opacity: cursorOn ? 1 : 0 }}>_</span>
        </p>
      </div>

      {/* Back button */}
      <div style={t.footer}>
        <button style={t.backBtn} onClick={() => { playClick(); onBack(); }}>
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke="currentColor"
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 1L2 7l6 6" />
          </svg>
          <span style={t.backLabel}>back</span>
        </button>
      </div>

      <style>{tCss}</style>
    </div>
  );
}

// ─── Styles: Idle terminal ─────────────────────────────────────────────────
const t = {
  root: {
    position:      'relative',
    width:         '100vw',
    height:        '100vh',
    background:    '#0a0f0a',
    display:       'flex',
    flexDirection: 'column',
    overflow:      'hidden',
    fontFamily:    'var(--font-mono)',
    userSelect:    'none',
  },
  scanlines: {
    position:        'absolute',
    inset:           0,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57,255,20,0.02) 2px, rgba(57,255,20,0.02) 4px)',
    pointerEvents:   'none',
    zIndex:          0,
  },
  output: {
    flex:      1,
    padding:   '32px 28px 0',
    overflowY: 'auto',
    position:  'relative',
    zIndex:    1,
    display:   'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  line: {
    fontSize:      '13px',
    letterSpacing: '0.06em',
    margin:        0,
    lineHeight:    1.6,
    fontFamily:    'var(--font-mono)',
  },
  prompt: {
    fontSize:      '14px',
    color:         '#39ff14',
    margin:        '12px 0 0',
    display:       'flex',
    alignItems:    'center',
  },
  promptChar: { opacity: 0.7 },
  cursor: {
    display:    'inline-block',
    transition: 'opacity 0.05s',
    color:      '#39ff14',
  },
  footer: {
    padding:    '16px 24px 28px',
    borderTop:  '1px solid rgba(57,255,20,0.08)',
    position:   'relative',
    zIndex:     1,
    flexShrink: 0,
  },
  backBtn: {
    display:    'flex',
    alignItems: 'center',
    gap:        '6px',
    background: 'none',
    border:     'none',
    cursor:     'pointer',
    color:      'rgba(57,255,20,0.45)',
    fontSize:   '12px',
    letterSpacing: '0.1em',
    padding:    '4px 0',
    transition: 'color 0.15s',
  },
  backLabel: {},
};

// ─── Styles: Minigame ──────────────────────────────────────────────────────
const mg = {
  root: {
    position:       'relative',
    width:          '100vw',
    height:         '100vh',
    background:     '#0a0f0a',
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '20px',
    fontFamily:     'var(--font-mono)',
    overflow:       'hidden',
    userSelect:     'none',
    padding:        '20px',
  },
  header: {
    display:        'flex',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
    width:          '100%',
    maxWidth:       '400px',
  },
  missionLabel: {
    fontSize:      '13px',
    letterSpacing: '0.2em',
    color:         '#EF9F27',
    margin:        0,
  },
  missionSub: {
    fontSize:      '10px',
    color:         'rgba(255,255,255,0.28)',
    letterSpacing: '0.1em',
    margin:        '4px 0 0',
  },
  timer: {
    display:        'flex',
    alignItems:     'baseline',
    gap:            '3px',
    border:         '1px solid',
    borderRadius:   '4px',
    padding:        '4px 10px',
    transition:     'color 0.3s, border-color 0.3s',
  },
  timerNum: { fontSize: '22px', fontWeight: 700, lineHeight: 1 },
  timerUnit: { fontSize: '11px', opacity: 0.7 },

  sequenceRow: {
    display:    'flex',
    alignItems: 'center',
    gap:        '8px',
    width:      '100%',
    maxWidth:   '400px',
  },
  seqCell: {
    width:         '44px',
    height:        '36px',
    border:        '1px solid',
    borderRadius:  '4px',
    display:       'flex',
    alignItems:    'center',
    justifyContent:'center',
    fontSize:      '14px',
    fontWeight:    700,
    letterSpacing: '0.05em',
    transition:    'color 0.2s, border-color 0.2s, box-shadow 0.2s',
  },
  seqArrow: {
    fontSize:   '11px',
    color:      'rgba(255,255,255,0.25)',
    marginLeft: 'auto',
    letterSpacing: '0.06em',
  },

  grid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap:                 '3px',
    width:               '100%',
    maxWidth:            '400px',
    padding:             '8px',
    borderRadius:        '6px',
    background:          'rgba(0,0,0,0.4)',
  },
  cell: {
    height:        '44px',
    border:        '1px solid',
    borderRadius:  '3px',
    fontSize:      '12px',
    fontWeight:    700,
    letterSpacing: '0.04em',
    transition:    'background 0.1s, color 0.15s, border-color 0.15s',
    fontFamily:    'var(--font-mono)',
  },

  resultOverlay: {
    position:       'absolute',
    inset:          0,
    background:     'rgba(10,15,10,0.88)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    zIndex:         50,
    animation:      'fadeInResult 0.3s ease',
  },
  resultText: {
    fontSize:      '20px',
    letterSpacing: '0.3em',
    fontWeight:    700,
    textAlign:     'center',
  },
};

const tCss = `
  @keyframes blinkCursor {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
`;

const mgCss = `
  @keyframes hexPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.55; }
  }
  @keyframes fadeInResult {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;
