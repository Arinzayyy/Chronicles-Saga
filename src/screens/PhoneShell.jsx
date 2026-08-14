/**
 * PhoneShell — the in-game phone frame.
 *
 * Deliberately NOT an iPhone: an angular matte-steel slab with a red power-rim
 * down one edge, a slim custom sensor notch (no Dynamic Island), and low-radius
 * corners. Children (PhoneHome, SMSApp, …) fill the inner screen.
 */

import NotificationBanner from './NotificationBanner';
import { PHONE } from './phoneTheme';

export default function PhoneShell({ children }) {
  return (
    <div style={s.outer}>
      <div style={s.surface}  aria-hidden="true" />
      <div style={s.vignette} aria-hidden="true" />

      {/* ── Physical phone body ──────────────────────────────────────────── */}
      <div style={s.phone}>
        {/* Side buttons — cosmetic; the power key is red */}
        <div style={{ ...s.btn, ...s.volUp   }} />
        <div style={{ ...s.btn, ...s.volDown }} />
        <div style={{ ...s.btn, ...s.power   }} />
        {/* Red power-rim glow running down the right edge */}
        <div style={s.powerRim} aria-hidden="true" />

        {/* ── Screen ─────────────────────────────────────────────────────── */}
        <div style={s.screenWrap}>

          {/* Custom sensor notch */}
          <div style={s.notch} aria-hidden="true">
            <div style={s.notchSpeaker} />
            <div style={s.notchLed} />
          </div>

          {/* Screen content — children fill this absolutely */}
          <div style={s.screenContent}>
            {children}
            <NotificationBanner />
          </div>

          {/* Home indicator — a short angular red tab */}
          <div style={s.homeOverlay} aria-hidden="true">
            <div style={s.homeBar} />
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const PHONE_RADIUS  = '26px';
const SCREEN_RADIUS = '16px';

const s = {
  // Full-viewport "desk surface"
  outer: {
    width:          '100%',
    height:         '100vh',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    background:     'radial-gradient(ellipse at 50% 36%, #15151b 0%, #050507 100%)',
    position:       'relative',
    overflow:       'hidden',
    userSelect:     'none',
  },

  // Diagonal grain on the desk surface
  surface: {
    position:        'absolute',
    inset:           0,
    backgroundImage: 'repeating-linear-gradient(118deg, transparent, transparent 7px, rgba(255,255,255,0.012) 7px, rgba(255,255,255,0.012) 8px)',
    pointerEvents:   'none',
  },
  // Faint red vignette so the device sits in a charged space
  vignette: {
    position:      'absolute',
    inset:         0,
    background:    'radial-gradient(ellipse at 50% 50%, rgba(211,19,46,0.06) 0%, rgba(0,0,0,0) 55%)',
    pointerEvents: 'none',
  },

  // The phone body — angular matte steel
  phone: {
    position:    'relative',
    height:      'min(90vh, 830px)',
    aspectRatio: '393 / 852',
    background:  'linear-gradient(150deg, #2a2a30 0%, #1a1a1f 42%, #0c0c10 100%)',
    borderRadius: PHONE_RADIUS,
    boxShadow: [
      '0 0 0 1px rgba(255,255,255,0.10)',     // top edge highlight
      '0 0 0 2px #000',                        // hard dark edge
      'inset 0 1px 0 rgba(255,255,255,0.08)',  // inner shine
      `0 0 36px rgba(211,19,46,0.18)`,         // red ambient glow
      '0 46px 90px rgba(0,0,0,0.8)',           // depth
    ].join(', '),
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    overflow:      'visible',
    zIndex:        1,
    paddingTop:    '11px',
    paddingBottom: '11px',
  },

  btn: { position: 'absolute', borderRadius: '1px' },
  volUp: {
    left: '-3px', top: '21%', width: '3px', height: '40px',
    background: 'linear-gradient(to right, #0c0c0e, #2a2a2e)',
  },
  volDown: {
    left: '-3px', top: 'calc(21% + 54px)', width: '3px', height: '66px',
    background: 'linear-gradient(to right, #0c0c0e, #2a2a2e)',
  },
  // Power key — red
  power: {
    right: '-3px', top: '24%', width: '3px', height: '78px',
    background: `linear-gradient(to left, ${PHONE.RED_DEEP}, ${PHONE.RED})`,
    boxShadow: `0 0 10px ${PHONE.RED}aa`,
  },
  // Subtle red rim running down the right edge of the body
  powerRim: {
    position: 'absolute',
    right: '2px', top: '18%', bottom: '24%', width: '2px',
    background: `linear-gradient(to bottom, transparent, ${PHONE.RED}88, transparent)`,
    filter: 'blur(0.5px)',
    pointerEvents: 'none',
    zIndex: 2,
  },

  // The glass panel
  screenWrap: {
    flex:         1,
    width:        'calc(100% - 14px)',
    position:     'relative',
    borderRadius: SCREEN_RADIUS,
    overflow:     'hidden',
    background:   '#000',
    boxShadow:    'inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 2px 6px rgba(0,0,0,0.5)',
  },

  // Custom sensor notch — slim dark bar, not a pill island
  notch: {
    position:       'absolute',
    top:            '9px',
    left:           '50%',
    transform:      'translateX(-50%)',
    width:          '92px',
    height:         '18px',
    background:     '#000',
    borderRadius:   '5px',
    border:         '1px solid rgba(255,255,255,0.06)',
    zIndex:         20,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '10px',
    pointerEvents:  'none',
  },
  notchSpeaker: {
    width: '34px', height: '3px', borderRadius: '2px',
    background: 'rgba(255,255,255,0.12)',
  },
  notchLed: {
    width: '5px', height: '5px', borderRadius: '50%',
    background: PHONE.RED,
    boxShadow: `0 0 6px ${PHONE.RED}`,
  },

  screenContent: {
    position: 'absolute',
    inset:    0,
    overflow: 'hidden',
  },

  homeOverlay: {
    position:       'absolute',
    bottom:         0,
    left:           0,
    right:          0,
    height:         '30px',
    display:        'flex',
    alignItems:     'flex-end',
    justifyContent: 'center',
    paddingBottom:  '8px',
    pointerEvents:  'none',
    zIndex:         15,
    background:     'linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 100%)',
  },
  homeBar: {
    width:        '120px',
    height:       '5px',
    borderRadius: '1px',
    background:   'rgba(255,255,255,0.28)',
    transform:    PHONE.SKEW,
    boxShadow:    `0 0 8px rgba(211,19,46,0.4)`,
  },
};
