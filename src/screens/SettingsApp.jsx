import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { playClick } from '../utils/sound';
import {
  getVolume, setVolume,
  getMuted,  setMuted,
  subscribe as subscribeVolume,
} from '../utils/volumeStore';
import SaveSlotSelect from './SaveSlotSelect';
import ch1 from '../assets/viewer_select/CH1.png';
import ch2 from '../assets/viewer_select/CH2.png';
import ch3 from '../assets/viewer_select/CH3.png';
import ch4 from '../assets/viewer_select/CH4.png';

const CHAR_IMAGES = { Dara: ch1, Zael: ch2, Seun: ch3, Fox: ch4 };

const MONO = '"SF Mono", "Fira Code", "Courier New", monospace';

const SYS = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

function fmtTime() {
  const d = new Date(), h = d.getHours() % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2,'0')} ${d.getHours()>=12?'PM':'AM'}`;
}

// ─── Default setting rows ──────────────────────────────────────────────────
const DEFAULT_SECTIONS = [
  {
    key:  'profile',
    rows: [
      { key:'account',     label:'Account',          value:'anonymous' },
      { key:'device_name', label:'Device Name',       value:'unknown device' },
    ],
  },
  {
    key:  'system',
    title:'',  // no header for first group after profile
    rows: [
      { key:'notifications', label:'Notifications',   value:'On',  icon:'🔔', iconBg:'#FF3B30' },
      { key:'sounds',        label:'Sounds & Haptics', value:'On', icon:'🔊', iconBg:'#FF3B30' },
    ],
  },
];

export default function SettingsApp() {
  const { state, setApp } = useGame();
  const mutated = state.settings ?? {};
  const charImage = CHAR_IMAGES[state.viewerIdentity] ?? null;
  const [confirmPending, setConfirmPending] = useState(false);
  const [soundsOpen,     setSoundsOpen]     = useState(false);
  // null | 'save' | 'load' — when non-null, SaveSlotSelect takes over.
  const [slotUIMode,     setSlotUIMode]     = useState(null);

  // Volume store local mirrors — subscribed below so other UIs updating
  // volume (e.g. MainMenuSettings) stay in sync with this panel.
  const [volume, setVolState] = useState(getVolume());
  const [muted,  setMutedSt]  = useState(getMuted());
  useEffect(() => subscribeVolume(s => {
    setVolState(s.volume);
    setMutedSt(s.muted);
  }), []);

  const volumePct = Math.round(volume * 100);

  function handleSoundsClick() {
    playClick();
    setSoundsOpen(o => !o);
  }

  function handleVolumeChange(e) {
    setVolume(Number(e.target.value) / 100);
  }

  function handleMuteToggle() {
    playClick();
    setMuted(!muted);
  }

  function handleConfirmReturn() {
    // window.location.reload() is the only way to reset gamePhase back to
    // 'mainmenu' without a RESET reducer action in GameContext — it fully
    // clears all in-memory state (beats, messages, scores, module flags).
    window.location.reload();
  }

  // When the slot-select screen is active, render it instead of settings.
  // - Save mode: onClose returns to settings (the save was applied in place).
  // - Load mode: if the player actually loads a slot, the game reducer
  //   replaces state entirely; PhoneShell/SettingsApp will unmount on its
  //   own because currentContext/currentApp change. onClose handles the
  //   "player backed out" case.
  if (slotUIMode) {
    return (
      <SaveSlotSelect
        mode={slotUIMode}
        onClose={() => setSlotUIMode(null)}
      />
    );
  }

  // Merge mutations from engine. The 'sounds' row also reflects live volume
  // state (from the volume store) so the user gets immediate feedback.
  const sections = DEFAULT_SECTIONS.map(sec => ({
    ...sec,
    rows: sec.rows.map(row => {
      if (row.key === 'sounds') {
        return {
          ...row,
          value:   muted ? 'Muted' : `${volumePct}%`,
          mutated: false,
        };
      }
      return {
        ...row,
        value:   mutated[row.key] ?? row.value,
        mutated: row.key in mutated,
      };
    }),
  }));

  return (
    <div style={s.root}>
      <StatusBar />
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => { playClick(); setApp(null); }} aria-label="Back">
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none" stroke="#0A84FF"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 1L1 8l6.5 7"/>
          </svg>
        </button>
        <span style={s.headerTitle}>Settings</span>
        <div style={{ minWidth:40 }} />
      </div>

      <div style={s.scroll}>
        {/* Profile row */}
        <div style={s.profileCard}>
          <div style={s.profileAvatar}>
            {charImage
              ? <img src={charImage} alt={state.viewerIdentity} style={s.profileAvatarImg} />
              : <span style={s.profileAvatarText}>V</span>
            }
          </div>
          <div style={s.profileInfo}>
            <p style={s.profileName}>{state.viewerIdentity ?? 'Viewer'}</p>
            <p style={s.profileSub}>Apple ID, iCloud, Media &amp; Purchases</p>
          </div>
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="rgba(84,84,88,0.8)"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l5 5-5 5"/>
          </svg>
        </div>

        {/* Setting sections */}
        {sections.slice(1).map((sec, si) => (
          <div key={sec.key} style={s.section}>
            <div style={s.sectionCard}>
              {sec.rows.map((row, ri) => {
                const isLast = ri === sec.rows.length - 1;
                if (row.key === 'sounds') {
                  // The sounds row is expandable — clicking it reveals a
                  // volume slider + mute toggle inline, iOS-style.
                  return (
                    <SoundsRowGroup
                      key={row.key}
                      row={row}
                      isLast={isLast}
                      open={soundsOpen}
                      onToggle={handleSoundsClick}
                      volumePct={volumePct}
                      muted={muted}
                      onVolumeChange={handleVolumeChange}
                      onMuteToggle={handleMuteToggle}
                    />
                  );
                }
                return (
                  <SettingRow
                    key={row.key}
                    row={row}
                    isLast={isLast}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* System section — save + destructive actions */}
        <div style={s.section}>
          <p style={s.sectionHeader}>SYSTEM</p>
          <div style={s.sectionCard}>
            {/* Save Game — opens slot select in "save" mode so the player
                can pick any of the 5 manual slots (overwriting if occupied). */}
            <SaveRow
              onOpen={() => { playClick(); setSlotUIMode('save'); }}
            />
            {/* Load Game — opens slot select in "load" mode. Disabled rows
                inside the picker reflect empty slots. */}
            <LoadRow
              onOpen={() => { playClick(); setSlotUIMode('load'); }}
            />
            {/* Return to Main Menu row */}
            <ReturnRow
              confirmPending={confirmPending}
              onRequest={() => { playClick(); setConfirmPending(true); }}
              onConfirm={() => { playClick(); handleConfirmReturn(); }}
              onCancel={() => { playClick(); setConfirmPending(false); }}
            />
          </div>
        </div>

        <p style={s.version}>
          Chronicles Saga OS · v0.1.0
        </p>
      </div>
    </div>
  );
}

// ─── Expandable "Sounds & Haptics" row ────────────────────────────────────────
// Renders the normal row, then (when open) an inline panel with a volume
// slider and mute toggle. Both controls write to volumeStore so the change
// is live across BGM and click sounds.
function SoundsRowGroup({
  row, isLast, open, onToggle,
  volumePct, muted,
  onVolumeChange, onMuteToggle,
}) {
  const [hov, setHov] = useState(false);
  return (
    <>
      <div
        style={{
          ...s.row,
          background:   hov ? 'rgba(255,255,255,0.03)' : 'transparent',
          borderBottom: (isLast && !open) ? 'none' : '1px solid rgba(84,84,88,0.35)',
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onToggle}
        aria-expanded={open}
        role="button"
      >
        {row.icon && (
          <div style={{ ...s.rowIcon, background: row.iconBg }}>
            <span style={{ fontSize:'15px', lineHeight:1 }}>{row.icon}</span>
          </div>
        )}
        <span style={s.rowLabel}>{row.label}</span>
        <div style={s.rowRight}>
          <span style={{ ...s.rowValue, color: muted ? '#FF3B30' : '#0A84FF' }}>
            {row.value}
          </span>
          {/* Chevron rotates when open (down). */}
          <svg
            width="7" height="12" viewBox="0 0 7 12" fill="none"
            stroke="rgba(84,84,88,0.8)" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
            style={{
              transform: open ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          >
            <path d="M1 1l5 5-5 5"/>
          </svg>
        </div>
      </div>

      {open && (
        <div style={s.soundsPanel}>
          {/* Volume row */}
          <div style={s.soundsBlock}>
            <div style={s.soundsBlockHead}>
              <span style={s.soundsBlockLabel}>Volume</span>
              <span style={s.soundsBlockValue}>
                {muted ? 'Muted' : `${volumePct}%`}
              </span>
            </div>
            <div style={s.soundsSliderRow}>
              <span style={s.soundsSliderIcon}>🔈</span>
              <input
                className="sa-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={volumePct}
                onChange={onVolumeChange}
                disabled={muted}
                aria-label="Volume"
                style={{
                  ...s.soundsSlider,
                  opacity: muted ? 0.4 : 1,
                  background: `linear-gradient(to right, #0A84FF 0%, #0A84FF ${volumePct}%, rgba(84,84,88,0.55) ${volumePct}%, rgba(84,84,88,0.55) 100%)`,
                }}
              />
              <span style={s.soundsSliderIconLg}>🔊</span>
            </div>
          </div>

          {/* Mute toggle row */}
          <div
            style={{ ...s.soundsBlock, cursor: 'pointer' }}
            onClick={onMuteToggle}
          >
            <div style={s.soundsBlockHead}>
              <span style={s.soundsBlockLabel}>Mute All</span>
              <span
                style={{
                  ...s.soundsSwitch,
                  background: muted ? '#30D158' : 'rgba(120,120,128,0.32)',
                }}
                aria-hidden="true"
              >
                <span
                  style={{
                    ...s.soundsSwitchKnob,
                    transform: muted ? 'translateX(20px)' : 'translateX(2px)',
                  }}
                />
              </span>
            </div>
            <p style={s.soundsHint}>
              // silences music and interface clicks
            </p>
          </div>

          {/* Slider thumb styling (webkit + firefox) */}
          <style>{`
            input[type="range"].sa-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px; height: 20px;
              background: #ffffff;
              border-radius: 50%;
              box-shadow: 0 1px 3px rgba(0,0,0,0.4);
              cursor: pointer;
              border: none;
            }
            input[type="range"].sa-slider::-moz-range-thumb {
              width: 20px; height: 20px;
              background: #ffffff;
              border-radius: 50%;
              box-shadow: 0 1px 3px rgba(0,0,0,0.4);
              cursor: pointer;
              border: none;
            }
          `}</style>
        </div>
      )}
    </>
  );
}

function SettingRow({ row, isLast }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        ...s.row,
        background:   hov ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderBottom: isLast ? 'none' : '1px solid rgba(84,84,88,0.35)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Icon */}
      {row.icon && (
        <div style={{ ...s.rowIcon, background: row.iconBg }}>
          <span style={{ fontSize:'15px', lineHeight:1 }}>{row.icon}</span>
        </div>
      )}

      {/* Label */}
      <span style={s.rowLabel}>{row.label}</span>

      {/* Value + chevron */}
      <div style={s.rowRight}>
        {row.value !== '' && (
          <span style={{ ...s.rowValue, color: row.mutated ? '#0A84FF' : '#8E8E93' }}>
            {row.value}
          </span>
        )}
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="rgba(84,84,88,0.8)"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1l5 5-5 5"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Save Game row ────────────────────────────────────────────────────────────
// Opens the slot-select UI in "save" mode. The slot picker itself is
// responsible for confirming an overwrite if the target slot is occupied.
function SaveRow({ onOpen }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      style={{
        ...s.row,
        borderBottom: '1px solid rgba(84,84,88,0.35)',
        background: hov ? 'rgba(48,209,88,0.06)' : 'transparent',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onOpen}
    >
      <div style={{ ...s.saveIconWrap, background: 'rgba(48,209,88,0.15)' }}>
        {/* Floppy disk / save icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="rgba(48,209,88,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
      </div>
      <div style={s.returnLabelWrap}>
        <span style={{ ...s.saveLabel, color: 'rgba(48,209,88,0.95)' }}>
          Save Game
        </span>
        <span style={s.saveSub}>
          // pick a slot · overwrite allowed
        </span>
      </div>
    </div>
  );
}

// ─── Load Game row ────────────────────────────────────────────────────────────
// Opens the slot-select UI in "load" mode. Occupied slots become clickable;
// empty slots stay disabled with an "// empty" hint.
function LoadRow({ onOpen }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      style={{
        ...s.row,
        borderBottom: '1px solid rgba(84,84,88,0.35)',
        background: hov ? 'rgba(10,132,255,0.06)' : 'transparent',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onOpen}
    >
      <div style={s.loadIconWrap}>
        {/* Folder-open icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="rgba(10,132,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div style={s.returnLabelWrap}>
        <span style={s.loadLabel}>Load Game</span>
        <span style={s.loadSub}>// restore from a save slot</span>
      </div>
    </div>
  );
}

// ─── Return to Main Menu row ───────────────────────────────────────────────
function ReturnRow({ confirmPending, onRequest, onConfirm, onCancel }) {
  const [hov, setHov] = useState(false);

  if (confirmPending) {
    return (
      <div style={s.confirmWrap}>
        <p style={s.confirmText}>
          are you sure? unsaved progress will be lost.
        </p>
        <div style={s.confirmBtns}>
          <button style={s.confirmYes} onClick={onConfirm}>confirm</button>
          <button style={s.confirmNo}  onClick={onCancel}>cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...s.row,
        background: hov ? 'rgba(233,69,96,0.08)' : 'transparent',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onRequest}
    >
      <div style={s.returnIconWrap}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="rgba(233,69,96,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </div>
      <div style={s.returnLabelWrap}>
        <span style={s.returnLabel}>Return to Main Menu</span>
        <span style={s.returnSub}>// exit current session</span>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div style={s.statusBar}>
      <span style={s.statusTime}>{fmtTime()}</span>
      <div style={s.statusIcons}>
        <svg width="15" height="11" viewBox="0 0 17 12" fill="white">
          <rect x="0" y="7" width="3" height="5" rx="0.8"/>
          <rect x="4" y="4" width="3" height="8" rx="0.8"/>
          <rect x="8" y="1" width="3" height="11" rx="0.8"/>
          <rect x="12" y="0" width="3" height="12" rx="0.8" opacity="0.3"/>
        </svg>
        <svg width="23" height="11" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/>
          <rect x="2" y="2" width="16" height="8" rx="2" fill="white"/>
          <path d="M23 4v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

const s = {
  root: {
    position:'relative', width:'100%', height:'100%',
    background:'#000', display:'flex', flexDirection:'column',
    overflow:'hidden', fontFamily:SYS, color:'#fff',
  },
  statusBar: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'14px 20px 2px', flexShrink:0,
  },
  statusTime:  { fontSize:'15px', fontWeight:'600' },
  statusIcons: { display:'flex', alignItems:'center', gap:'5px' },

  header: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'8px 16px 10px',
    borderBottom:'1px solid rgba(84,84,88,0.4)',
    flexShrink:0,
  },
  backBtn: {
    background:'none', border:'none', cursor:'pointer',
    display:'flex', alignItems:'center', padding:'4px', minWidth:40,
  },
  headerTitle: { fontSize:'17px', fontWeight:'600', color:'#fff' },

  scroll: { flex:1, overflowY:'auto', padding:'0 0 40px' },

  // Profile card
  profileCard: {
    display:'flex', alignItems:'center', gap:'14px',
    padding:'14px 16px',
    background:'#1C1C1E', margin:'16px 16px 4px',
    borderRadius:'10px', cursor:'pointer',
  },
  profileAvatar: {
    width:56, height:56, borderRadius:'50%',
    background:'linear-gradient(135deg, #5856D6, #0A84FF)',
    display:'flex', alignItems:'center', justifyContent:'center',
    flexShrink:0,
  },
  profileAvatarText: { fontSize:'24px', fontWeight:'600', color:'#fff' },
  profileAvatarImg: {
    width:'100%', height:'100%', borderRadius:'50%',
    objectFit:'cover', objectPosition:'center top', display:'block',
  },
  profileInfo: { flex:1, minWidth:0 },
  profileName: { fontSize:'20px', fontWeight:'400', color:'#fff', margin:0 },
  profileSub:  { fontSize:'12px', color:'#8E8E93', margin:'2px 0 0', lineHeight:1.3 },

  // Section
  section:       { margin:'16px 16px 0' },
  sectionCard:   { background:'#1C1C1E', borderRadius:'10px', overflow:'hidden' },
  sectionHeader: {
    fontSize:'12px', fontWeight:'400', letterSpacing:'0.06em',
    color:'rgba(84,84,88,0.9)', textTransform:'uppercase',
    margin:'0 0 6px 4px', padding:0, fontFamily:SYS,
  },

  row: {
    display:'flex', alignItems:'center', gap:'12px',
    padding:'12px 14px', cursor:'pointer', transition:'background 0.1s',
  },
  rowIcon: {
    width:28, height:28, borderRadius:'7px',
    display:'flex', alignItems:'center', justifyContent:'center',
    flexShrink:0,
  },
  rowLabel: { flex:1, fontSize:'16px', color:'#fff' },
  rowRight:  { display:'flex', alignItems:'center', gap:'6px' },
  rowValue:  { fontSize:'16px', transition:'color 0.2s' },

  version: {
    textAlign:'center', fontSize:'12px',
    color:'rgba(84,84,88,0.7)', padding:'28px 0 0',
    fontFamily:SYS,
  },

  // Save Game row
  saveIconWrap: {
    width:28, height:28, borderRadius:'7px',
    display:'flex', alignItems:'center', justifyContent:'center',
    flexShrink:0, transition:'background 0.2s',
  },
  saveLabel: { fontSize:'16px', lineHeight:1, transition:'color 0.2s' },
  saveSub: {
    fontSize:'10px', color:'rgba(48,209,88,0.45)',
    fontFamily:MONO, letterSpacing:'0.06em',
  },

  // Load Game row
  loadIconWrap: {
    width:28, height:28, borderRadius:'7px',
    background:'rgba(10,132,255,0.15)',
    display:'flex', alignItems:'center', justifyContent:'center',
    flexShrink:0,
  },
  loadLabel: { fontSize:'16px', lineHeight:1, color:'rgba(10,132,255,0.95)' },
  loadSub: {
    fontSize:'10px', color:'rgba(10,132,255,0.45)',
    fontFamily:MONO, letterSpacing:'0.06em',
  },

  // Return to Main Menu row
  returnIconWrap: {
    width:28, height:28, borderRadius:'7px',
    background:'rgba(233,69,96,0.15)',
    display:'flex', alignItems:'center', justifyContent:'center',
    flexShrink:0,
  },
  returnLabelWrap: { flex:1, display:'flex', flexDirection:'column', gap:'2px' },
  returnLabel:     { fontSize:'16px', color:'rgba(233,69,96,0.95)', lineHeight:1 },
  returnSub: {
    fontSize:'10px', color:'rgba(233,69,96,0.45)',
    fontFamily:MONO, letterSpacing:'0.06em',
  },

  // Sounds & Haptics expansion panel
  soundsPanel: {
    padding: '8px 14px 14px',
    background: 'rgba(0,0,0,0.25)',
    borderTop: '1px solid rgba(84,84,88,0.35)',
  },
  soundsBlock: {
    padding: '10px 2px',
    borderBottom: '1px solid rgba(84,84,88,0.2)',
  },
  soundsBlockHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  soundsBlockLabel: {
    fontSize: '14px',
    color: '#fff',
    fontFamily: SYS,
  },
  soundsBlockValue: {
    fontSize: '13px',
    color: '#8E8E93',
    fontFamily: SYS,
    fontVariantNumeric: 'tabular-nums',
  },
  soundsSliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '4px 2px',
  },
  soundsSliderIcon:   { fontSize: '14px', opacity: 0.6 },
  soundsSliderIconLg: { fontSize: '16px', opacity: 0.85 },
  soundsSlider: {
    WebkitAppearance: 'none',
    appearance: 'none',
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  soundsHint: {
    margin: '4px 0 0',
    fontSize: '11px',
    color: 'rgba(142,142,147,0.7)',
    fontFamily: MONO,
    letterSpacing: '0.03em',
  },
  soundsSwitch: {
    position: 'relative',
    display: 'inline-block',
    width: '44px',
    height: '26px',
    borderRadius: '13px',
    transition: 'background 0.2s',
    flexShrink: 0,
  },
  soundsSwitchKnob: {
    position: 'absolute',
    top: '2px',
    left: 0,
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s',
  },

  // Inline confirm prompt
  confirmWrap: {
    padding:'14px 16px',
    background:'rgba(233,69,96,0.06)',
    borderLeft:'2px solid rgba(233,69,96,0.4)',
  },
  confirmText: {
    margin:'0 0 12px',
    fontSize:'13px', color:'rgba(255,255,255,0.6)',
    fontFamily:MONO, letterSpacing:'0.03em', lineHeight:1.5,
  },
  confirmBtns: { display:'flex', gap:'10px' },
  confirmYes: {
    padding:'6px 16px',
    fontFamily:MONO, fontSize:'12px', letterSpacing:'0.08em',
    color:'rgba(233,69,96,0.95)',
    background:'rgba(233,69,96,0.12)',
    border:'1px solid rgba(233,69,96,0.4)',
    borderRadius:'4px', cursor:'pointer',
  },
  confirmNo: {
    padding:'6px 16px',
    fontFamily:MONO, fontSize:'12px', letterSpacing:'0.08em',
    color:'rgba(255,255,255,0.45)',
    background:'transparent',
    border:'1px solid rgba(84,84,88,0.35)',
    borderRadius:'4px', cursor:'pointer',
  },
};
