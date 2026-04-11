import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { playClick } from '../utils/sound';

const SYS = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

function fmtTime() {
  const d = new Date(), h = d.getHours() % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2,'0')} ${d.getHours()>=12?'PM':'AM'}`;
}

// Derive unlocked photos from message threads
function usePhotoEntries(messageThreads) {
  const seen = new Set(), photos = [];
  for (const msgs of Object.values(messageThreads)) {
    for (const m of msgs) {
      if (m.isPhoto && m.photoId && !seen.has(m.photoId)) {
        seen.add(m.photoId);
        photos.push({ photoId: m.photoId, caption: m.caption ?? null });
      }
    }
  }
  return photos;
}

// ─── Expanded photo view ────────────────────────────────────────────────────
function PhotoDetail({ photo, onClose }) {
  return (
    <div style={s.root}>
      <StatusBar />
      <div style={s.detailNav}>
        <button style={s.detailBackBtn} onClick={() => { playClick(); onClose(); }}>
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none" stroke="#0A84FF"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 1L1 8l6.5 7"/>
          </svg>
        </button>
        <span style={s.detailTitle}>Photo</span>
        <button style={s.shareBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A84FF" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
          </svg>
        </button>
      </div>

      {/* Full photo placeholder */}
      <div style={s.photoFull}>
        <div style={s.photoFullInner}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(255,255,255,0.18)" stroke="none"/>
            <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={s.photoFullId}>{photo.photoId.replace('photo_','').replace(/_/g,' ')}</span>
        </div>
      </div>

      {photo.caption && <p style={s.detailCaption}>{photo.caption}</p>}

      {/* Bottom info bar */}
      <div style={s.detailFooter}>
        <span style={s.detailDate}>{new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</span>
      </div>
    </div>
  );
}

// ─── Main screen ────────────────────────────────────────────────────────────
export default function GalleryApp() {
  const { state, setApp }         = useGame();
  const photos                    = usePhotoEntries(state.messageThreads);
  const [expanded, setExpanded]   = useState(null);

  if (expanded !== null && photos[expanded]) {
    return <PhotoDetail photo={photos[expanded]} onClose={() => setExpanded(null)} />;
  }

  return (
    <div style={s.root}>
      <StatusBar />

      {/* iOS Photos-style header */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => { playClick(); setApp(null); }} aria-label="Back">
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none" stroke="#0A84FF"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 1L1 8l6.5 7"/>
          </svg>
        </button>
        <span style={s.headerTitle}>Library</span>
        <button style={s.selectBtn}>Select</button>
      </div>

      {/* Section header */}
      {photos.length > 0 && (
        <div style={s.sectionHeader}>
          <span style={s.sectionTitle}>Recents</span>
          <span style={s.sectionCount}>{photos.length}</span>
        </div>
      )}

      {photos.length === 0 ? (
        <div style={s.empty}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(255,255,255,0.15)" stroke="none"/>
            <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={s.emptyTitle}>No Photos</span>
          <span style={s.emptyText}>Photos will appear here when received.</span>
        </div>
      ) : (
        <div style={s.grid}>
          {photos.map((photo, i) => (
            <PhotoTile key={photo.photoId} photo={photo} onClick={() => { playClick(); setExpanded(i); }} />
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoTile({ photo, onClick }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      style={{ ...s.tile, opacity: pressed ? 0.75 : 1 }}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      <div style={s.tileInner}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(255,255,255,0.12)" stroke="none"/>
          <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </button>
  );
}

function StatusBar() {
  return (
    <div style={s.statusBar}>
      <span style={s.statusTime}>{fmtTime()}</span>
      <div style={s.statusRight}>
        <svg width="15" height="11" viewBox="0 0 17 12" fill="white">
          <rect x="0" y="7"  width="3" height="5" rx="0.8"/>
          <rect x="4" y="4"  width="3" height="8" rx="0.8"/>
          <rect x="8" y="1"  width="3" height="11" rx="0.8"/>
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
  statusRight: { display:'flex', alignItems:'center', gap:'5px' },

  header: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'8px 16px 10px',
    borderBottom:'1px solid rgba(84,84,88,0.4)',
    flexShrink:0,
  },
  backBtn: {
    background:'none', border:'none', cursor:'pointer',
    display:'flex', alignItems:'center', minWidth:40, padding:'4px 0',
  },
  headerTitle: { fontSize:'17px', fontWeight:'600', color:'#fff' },
  selectBtn:   { fontSize:'17px', color:'#0A84FF', background:'none', border:'none', cursor:'pointer', fontFamily:SYS, minWidth:40, textAlign:'right' },

  sectionHeader: {
    display:'flex', alignItems:'baseline', justifyContent:'space-between',
    padding:'14px 16px 8px',
  },
  sectionTitle: { fontSize:'20px', fontWeight:'700', color:'#fff' },
  sectionCount: { fontSize:'14px', color:'#8E8E93' },

  grid: {
    flex:1, display:'grid',
    gridTemplateColumns:'repeat(3, 1fr)',
    gap:'2px', padding:'2px',
    overflowY:'auto', alignContent:'start',
  },
  tile: {
    border:'none', background:'#1C1C1E', cursor:'pointer',
    padding:0, transition:'opacity 0.12s', aspectRatio:'1',
  },
  tileInner: {
    width:'100%', height:'100%', background:'#1C1C1E',
    display:'flex', alignItems:'center', justifyContent:'center',
  },

  empty: {
    flex:1, display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    gap:10, padding:'0 40px',
  },
  emptyTitle: { fontSize:'18px', fontWeight:'600', color:'#fff' },
  emptyText:  { fontSize:'14px', color:'#8E8E93', textAlign:'center', lineHeight:1.4 },

  // Detail view
  detailNav: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'8px 16px 10px', borderBottom:'1px solid rgba(84,84,88,0.4)', flexShrink:0,
  },
  detailBackBtn: { background:'none', border:'none', cursor:'pointer', padding:'4px', display:'flex', alignItems:'center' },
  detailTitle:   { fontSize:'17px', fontWeight:'600', color:'#fff' },
  shareBtn:      { background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center' },
  photoFull: {
    flex:1, display:'flex', alignItems:'center', justifyContent:'center',
    background:'#000',
  },
  photoFullInner: {
    width:'90%', aspectRatio:'4/3', background:'#1C1C1E', borderRadius:'4px',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10,
  },
  photoFullId: { fontSize:'11px', color:'rgba(255,255,255,0.25)', letterSpacing:'0.06em' },
  detailCaption: { fontSize:'15px', color:'#8E8E93', padding:'12px 20px', margin:0, textAlign:'center' },
  detailFooter:  { padding:'12px 20px 20px', borderTop:'1px solid rgba(84,84,88,0.3)', flexShrink:0 },
  detailDate:    { fontSize:'13px', color:'#8E8E93' },
};
