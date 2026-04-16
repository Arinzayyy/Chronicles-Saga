/**
 * PhoneShell — renders a realistic phone frame around all phone-context screens.
 *
 * The outer area is the "desk surface" (dark, subtle texture).
 * The phone body sits centered, sized to fit the viewport while maintaining
 * a real smartphone aspect ratio (393 × 852, ~iPhone 15 proportions).
 *
 * Children (PhoneHome, SMSApp, etc.) fill the inner screen area.
 * A Dynamic Island pill is overlaid at the top-center of the screen.
 */

import NotificationBanner from './NotificationBanner';

export default function PhoneShell({ children }) {
  return (
    <div style={s.outer}>
      {/* Desk surface texture */}
      <div style={s.surface} aria-hidden="true" />

      {/* ── Physical phone body ──────────────────────────────────────────── */}
      <div style={s.phone}>

        {/* Side buttons — cosmetic only */}
        <div style={{ ...s.btn, ...s.volUp   }} />
        <div style={{ ...s.btn, ...s.volDown }} />
        <div style={{ ...s.btn, ...s.power   }} />

        {/* ── Screen area ─────────────────────────────────────────────── */}
        <div style={s.screenWrap}>

          {/* Dynamic Island */}
          <div style={s.island} aria-hidden="true" />

          {/* Screen content — children fill this absolutely */}
          <div style={s.screenContent}>
            {children}
            {/* Notification banner lives here so it's clipped to the phone screen */}
            <NotificationBanner />
          </div>

          {/* Home indicator (decorative overlay, pointer-events off) */}
          <div style={s.homeOverlay} aria-hidden="true">
            <div style={s.homeBar} />
          </div>

        </div>
        {/* ── end screen ──────────────────────────────────────────────── */}

      </div>
      {/* ── end phone body ──────────────────────────────────────────────── */}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const PHONE_RADIUS  = '44px';
const SCREEN_RADIUS = '38px';

const s = {
  // Full-viewport container — the "desk surface"
  outer: {
    width:           '100%',
    height:          '100vh',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    background:      'radial-gradient(ellipse at 50% 38%, #1a1a26 0%, #06060c 100%)',
    position:        'relative',
    overflow:        'hidden',
    userSelect:      'none',
  },

  // Subtle scan-line / grain on the desk surface
  surface: {
    position:        'absolute',
    inset:           0,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 6px)',
    pointerEvents:   'none',
  },

  // The phone body itself
  phone: {
    position:    'relative',
    height:      'min(90vh, 830px)',
    aspectRatio: '393 / 852',
    background:  'linear-gradient(155deg, #2e2e32 0%, #1e1e21 45%, #131315 100%)',
    borderRadius: PHONE_RADIUS,
    boxShadow: [
      '0 0 0 1px rgba(255,255,255,0.14)',   // top highlight rim
      '0 0 0 2px rgba(0,0,0,0.85)',          // dark outer edge
      'inset 0 1px 0 rgba(255,255,255,0.1)', // inner top shine
      '0 50px 100px rgba(0,0,0,0.75)',       // depth shadow
      '0 12px 40px  rgba(0,0,0,0.6)',        // mid shadow
    ].join(', '),
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    overflow:      'visible',
    zIndex:        1,
    // top/bottom padding = the physical bezel shown above/below screen
    paddingTop:    '12px',
    paddingBottom: '12px',
  },

  // Shared button base
  btn: {
    position:     'absolute',
    borderRadius: '2px',
  },

  // Volume up (left side, upper)
  volUp: {
    left:       '-3px',
    top:        '20%',
    width:      '3px',
    height:     '38px',
    background: 'linear-gradient(to right, #101012, #2a2a2e)',
    boxShadow:  'inset 0 1px 0 rgba(255,255,255,0.06)',
  },

  // Volume down (left side, lower)
  volDown: {
    left:       '-3px',
    top:        'calc(20% + 52px)',
    width:      '3px',
    height:     '64px',
    background: 'linear-gradient(to right, #101012, #2a2a2e)',
    boxShadow:  'inset 0 1px 0 rgba(255,255,255,0.06)',
  },

  // Power / lock (right side)
  power: {
    right:      '-3px',
    top:        '22%',
    width:      '3px',
    height:     '72px',
    background: 'linear-gradient(to left, #101012, #2a2a2e)',
    boxShadow:  'inset 0 1px 0 rgba(255,255,255,0.06)',
  },

  // Screen bezel — the visible glass panel
  screenWrap: {
    flex:         1,
    width:        'calc(100% - 16px)',  // 8px bezel left + right
    position:     'relative',
    borderRadius: SCREEN_RADIUS,
    overflow:     'hidden',
    background:   '#000',
    // Subtle inner shadow to suggest depth / glass edge
    boxShadow:    'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 2px 4px rgba(0,0,0,0.4)',
  },

  // Dynamic Island — black pill at top-center of screen
  island: {
    position:        'absolute',
    top:             '14px',
    left:            '50%',
    transform:       'translateX(-50%)',
    width:           '118px',
    height:          '34px',
    background:      '#000',
    borderRadius:    '20px',
    zIndex:          20,
    boxShadow:       '0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.6)',
    pointerEvents:   'none',
  },

  // Content wrapper — children are absolutely positioned here
  screenContent: {
    position: 'absolute',
    inset:    0,
    overflow: 'hidden',
    // Push content down slightly so status bar text clears the island
    // Phone screens draw their own status bar; island floats over the center gap
  },

  // Home indicator overlay (over screen content, no pointer events)
  homeOverlay: {
    position:       'absolute',
    bottom:         0,
    left:           0,
    right:          0,
    height:         '32px',
    display:        'flex',
    alignItems:     'flex-end',
    justifyContent: 'center',
    paddingBottom:  '8px',
    pointerEvents:  'none',
    zIndex:         15,
    background:     'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 100%)',
  },

  homeBar: {
    width:        '130px',
    height:       '5px',
    borderRadius: '3px',
    background:   'rgba(255,255,255,0.22)',
  },
};
