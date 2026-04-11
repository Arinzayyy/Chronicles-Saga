import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { playClick } from '../utils/sound';

// ─── File type icons (text-based) ─────────────────────────────────────────
const FILE_TYPE_ICONS = {
  txt:      '📄',
  log:      '📋',
  img:      '🖼',
  data:     '🗃',
  enc:      '🔒',
  default:  '📁',
};

function fileIcon(file) {
  if (!file) return FILE_TYPE_ICONS.default;
  const ext = file.id?.split('_').pop() ?? '';
  return FILE_TYPE_ICONS[ext] ?? FILE_TYPE_ICONS.default;
}

// ─── Document viewer ───────────────────────────────────────────────────────
function DocumentViewer({ file, onClose }) {
  return (
    <div style={s.root}>
      <ToolBar />
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => { playClick(); onClose(); }} aria-label="Back">
          <Chevron />
        </button>
        <span style={s.headerTitle}>{file.label ?? file.id}</span>
        <div style={{ width: 40 }} />
      </div>

      <div style={s.docViewer}>
        <div style={s.docMeta}>
          <span style={s.docType}>{(file.file_type ?? 'unknown').toUpperCase()}</span>
          <span style={s.docDot}>·</span>
          <span style={s.docId}>{file.id}</span>
        </div>
        <div style={s.docBody}>
          <p style={s.docContent}>
            {file.content_preview ?? '[ no preview available ]'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────
export default function FilesApp() {
  const { state, setApp } = useGame();
  const { unlockedFiles }  = state;
  const [openFile, setOpenFile] = useState(null);

  if (openFile) {
    return <DocumentViewer file={openFile} onClose={() => setOpenFile(null)} />;
  }

  return (
    <div style={s.root}>
      <ToolBar />
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => { playClick(); setApp(null); }} aria-label="Back">
          <Chevron />
        </button>
        <span style={s.headerTitle}>Files</span>
        <div style={{ width: 40 }} />
      </div>

      {unlockedFiles.length === 0 ? (
        <div style={s.empty}>
          <span style={s.emptyText}>no files</span>
        </div>
      ) : (
        <div style={s.fileList}>
          {unlockedFiles.map(file => (
            <FileRow
              key={file.id}
              file={file}
              onOpen={file.locked ? null : () => { playClick(); setOpenFile(file); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── File row ─────────────────────────────────────────────────────────────
function FileRow({ file, onOpen }) {
  const [hov, setHov] = useState(false);
  const locked = file.locked;

  return (
    <button
      style={{
        ...s.fileRow,
        background: hov && !locked ? 'rgba(255,255,255,0.03)' : 'transparent',
        cursor:     locked ? 'not-allowed' : 'pointer',
        opacity:    locked ? 0.45 : 1,
      }}
      onClick={onOpen ?? undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      disabled={locked}
    >
      <span style={s.fileIconGlyph}>{locked ? '🔒' : fileIcon(file)}</span>
      <div style={s.fileInfo}>
        <span style={s.fileName}>{file.label ?? file.id}</span>
        <span style={s.fileMeta}>
          {(file.file_type ?? 'unknown').toLowerCase()}
          {file.size ? ` · ${file.size}` : ''}
        </span>
      </div>
      {!locked && (
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1l6 6-6 6" />
        </svg>
      )}
    </button>
  );
}

// ─── Shared sub-components ─────────────────────────────────────────────────
function ToolBar() {
  return (
    <div style={s.toolbar}>
      <div style={s.toolbarDots}>
        <span style={s.toolbarDot} />
        <span style={s.toolbarDot} />
        <span style={s.toolbarDot} />
      </div>
      <span style={s.toolbarTitle}>FILES</span>
      <div style={{ width: 52 }} />
    </div>
  );
}

function Chevron() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1L2 9l6 8" />
    </svg>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    position:      'relative',
    width:         '100vw',
    height:        '100vh',
    background:    '#0b0b14',
    display:       'flex',
    flexDirection: 'column',
    overflow:      'hidden',
    fontFamily:    'var(--font-mono)',
    color:         'var(--text)',
  },
  toolbar: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '12px 16px 8px',
    borderBottom:   '1px solid rgba(255,255,255,0.05)',
    flexShrink:     0,
  },
  toolbarDots: { display: 'flex', gap: '6px' },
  toolbarDot: {
    display: 'inline-block', width: '10px', height: '10px',
    borderRadius: '50%', background: 'rgba(255,255,255,0.12)',
  },
  toolbarTitle: {
    fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)',
  },
  header: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '8px 16px 12px',
    borderBottom:   '1px solid rgba(255,255,255,0.07)',
    flexShrink:     0,
  },
  backBtn: {
    width: 40, height: 40,
    display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'rgba(255,255,255,0.7)', padding: 0,
  },
  headerTitle: {
    fontSize: '17px', fontWeight: 600,
    color: 'rgba(255,255,255,0.9)', letterSpacing: '0.02em',
  },

  empty: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emptyText: {
    fontSize: '13px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em',
  },

  fileList: { flex: 1, overflowY: 'auto' },
  fileRow: {
    width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
    padding: '14px 18px', background: 'none', border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    textAlign: 'left', color: 'inherit', transition: 'background 0.12s',
  },
  fileIconGlyph: { fontSize: '20px', flexShrink: 0, lineHeight: 1 },
  fileInfo: {
    flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px',
  },
  fileName: {
    fontSize: '14px', color: 'rgba(255,255,255,0.82)',
    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
  },
  fileMeta: { fontSize: '11px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em' },

  docViewer: { flex: 1, overflowY: 'auto', padding: '0 0 40px' },
  docMeta: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  docType: { fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.3)' },
  docDot:  { fontSize: '10px', color: 'rgba(255,255,255,0.15)' },
  docId:   { fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' },
  docBody: { padding: '24px 20px' },
  docContent: {
    fontSize: '13px', color: 'rgba(255,255,255,0.72)',
    lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)',
  },
};
