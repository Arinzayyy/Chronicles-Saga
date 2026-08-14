#!/usr/bin/env node
/**
 * convert-story.js (v2) — MASTER script → story.json chapter converter.
 *
 * Usage:
 *   node scripts/convert-story.js docs/chapters/CH1_MASTER.md --out /tmp/ch1.json
 *
 * v2 additions over v1:
 *   - [IF ...] / [ELSE IF ...] / [ELSE] / [ENDIF] → conditional directives (nested OK)
 *     conditions: "pattern X", "flag KEY", "flag KEY = VALUE", "flag KEY VALUE", "beat ID"
 *   - [IF TRUST char ≥ N → beatA / else → beatB]  (optionally "AND NOT beat ID") → trust_check
 *   - [TRUST Name ±N] → update_trust
 *   - [SLOT highest-trust]: body / [SLOT lowest-trust]: body → send_text_slot
 *   - [NOTIF Title] body → notify;  [NOTIF-DM name] body → send_text into that DM thread
 *   - [SCREEN name detail] → screen
 *   - [FILE id "name"] → file_unlock
 *   - [GHOST 0s] → persistent ghost (auto_delete_ms 0)
 *   - [NARRATE R] → narrate with rogue: true
 *   - choice effects: (flag: key value|+1|true|false), (pattern: x) → set_flags
 *
 * Always run `npm run validate` on the merged story.json afterwards.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const inPath = args.find(a => !a.startsWith('--'));
const outIdx = args.indexOf('--out');
const outPath = outIdx >= 0 ? args[outIdx + 1] : null;
if (!inPath) {
  console.error('Usage: node scripts/convert-story.js <CHN_MASTER.md> [--out file.json]');
  process.exit(1);
}

const SPEAKER_MAP = {
  halima: 'char_halima_phone',          // pre-reveal sender (Murna on Halima's phone)
  'halima (audio)': 'char_halima_audio',
  murna: 'char_murna', kelvin: 'char_kelvin', pitch: 'char_pitch',
  ayo: 'char_ayo', loray: 'char_loray', vi: 'char_vi',
  viewer: 'player', unknown: 'char_unknown', admin: 'char_admin',
  courier: 'char_courier',
};
const charOf = n => SPEAKER_MAP[n.toLowerCase()] ?? `char_${n.toLowerCase()}`;
const norm = s => s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/−/g, '-').trim();

// ── Condition parser ───────────────────────────────────────────────────────────
function parseCondition(text) {
  text = norm(text).replace(/^\[?IF\s+/i, '').replace(/\]$/, '').trim();
  // AND chains
  if (/\sAND\s/i.test(text)) {
    return { kind: 'all', conds: text.split(/\sAND\s/i).map(parseCondition) };
  }
  let m;
  if ((m = text.match(/^NOT\s+beat\s+(\S+)/i)))       return { kind: 'not_beat', id: m[1] };
  if ((m = text.match(/^pattern\s+(\w+)/i)))           return { kind: 'pattern', name: m[1].toLowerCase() };
  if ((m = text.match(/^beat\s+(\S+)/i)))              return { kind: 'beat', id: m[1] };
  if ((m = text.match(/^TRUST\s+(\w+)\s*[≥>=]+\s*(\d+)/i)))
    return { kind: 'trust', character: charOf(m[1]), min: parseInt(m[2], 10) };
  if ((m = text.match(/^flag\s+(\S+)\s*=?\s*(.*)$/i))) {
    const key = m[1];
    let value = m[2].trim();
    if (value === '' ) return { kind: 'flag', key };
    if (value === 'true')  return { kind: 'flag', key, value: true };
    if (value === 'false') return { kind: 'flag', key, value: false };
    return { kind: 'flag', key, value };
  }
  return { kind: 'flag', key: `__unparsed__${text}` };
}

function parseEffects(tail, choice) {
  for (const fx of norm(tail).matchAll(/\(([^)]+)\)/g)) {
    const body = fx[1].trim();
    if (/^Trust:/i.test(body)) {
      for (const t of body.replace(/^Trust:/i, '').split(',')) {
        const m = t.trim().match(/^(\w+)\s*([+-]\d+)/);
        if (m) (choice.trust_effects ??= []).push({ character: charOf(m[1]), delta: parseInt(m[2], 10) });
      }
    } else if (/^(Integration|Dominion|Calibration)/i.test(body)) {
      const m = body.match(/^(\w+)\s*([+-]\d+)/);
      if (m) (choice.alignment_effects ??= []).push({
        axis: m[1][0].toUpperCase() + m[1].slice(1).toLowerCase(),
        delta: parseInt(m[2], 10),
      });
    } else if (/^pattern:/i.test(body)) {
      (choice.set_flags ??= []).push({ key: `pattern__player__${body.replace(/^pattern:/i, '').trim()}`, value: '+1' });
    } else if (/^flag:/i.test(body)) {
      const parts = body.replace(/^flag:/i, '').trim().split(/\s+/);
      const key = parts[0];
      let value = parts.slice(1).join(' ') || true;
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      (choice.set_flags ??= []).push({ key, value });
    }
  }
}

// ── Load & split beat blocks ───────────────────────────────────────────────────
const raw = readFileSync(inPath, 'utf8');
const beatBlocks = [...raw.matchAll(
  /^### BEAT:\s*(\S+)[^\n]*\nContext:\s*(\w+)\s*\/\s*(\w+)\s*(?:\((\w+)\))?[^\n]*\n+```\n([\s\S]*?)```/gm
)];
if (!beatBlocks.length) {
  console.error('No beat blocks found in', inPath);
  process.exit(1);
}
const labelOf = {};
for (const m of raw.matchAll(/^### BEAT:\s*(\S+)\s*—\s*"([^"]+)"/gm)) labelOf[m[1]] = m[2];

const warnings = [];
const beats = [];

for (const [, id, context, app, thread, body] of beatBlocks) {
  const beat = { id, label: labelOf[id] ?? id, context, app };
  const rootDirectives = [];
  // Conditional stack: each frame = { branches:[{condition,directives}], else:[], mode }
  const stack = [];
  const target = () => {
    if (!stack.length) return rootDirectives;
    const top = stack[stack.length - 1];
    return top.mode === 'else' ? top.else : top.branches[top.branches.length - 1].directives;
  };
  const push = d => target().push(d);

  for (let rawLine of body.split('\n')) {
    const line = norm(rawLine).replace(/\s*\[EDIT[^\]]*\]\s*$/i, ''); // strip edit markers
    if (!line || /^\[RETRY LOOP/i.test(line)) continue;
    let m;

    // ── Conditional structure ──────────────────────────────────────────────
    // Beat-level trust gate: [IF TRUST x ≥ N → a / else → b]
    if ((m = line.match(/^\[IF\s+(.+?)\s*→\s*(\S+)\s*\/\s*else\s*→\s*(\S+)\s*\]/i))) {
      push({ type: 'trust_check', condition: parseCondition(m[1]), on_pass: m[2], on_fail: m[3] });
      continue;
    }
    if ((m = line.match(/^\[IF\s+(.+)\]$/i))) {
      stack.push({ branches: [{ condition: parseCondition(m[1]), directives: [] }], else: [], mode: 'if' });
      continue;
    }
    if ((m = line.match(/^\[ELSE IF\s+(.+)\]$/i))) {
      const top = stack[stack.length - 1];
      if (top) { top.branches.push({ condition: parseCondition(m[1]), directives: [] }); top.mode = 'if'; }
      continue;
    }
    if (/^\[ELSE\]$/i.test(line)) {
      const top = stack[stack.length - 1];
      if (top) top.mode = 'else';
      continue;
    }
    if (/^\[ENDIF\]$/i.test(line)) {
      const frame = stack.pop();
      if (frame) push({ type: 'conditional', branches: frame.branches, else: frame.else });
      continue;
    }

    // ── Flow ───────────────────────────────────────────────────────────────
    if ((m = line.match(/^→\s*(\S+)\s*(.*)$/))) {
      if (/STUB|is_ending/i.test(m[2])) beat.is_ending = true;
      else beat.on_complete = m[1];
      continue;
    }
    if ((m = line.match(/^>\s*(.+?)\s*→\s*(\S+)\s*(.*)$/))) {
      const choice = { label: m[1].replace(/^"|"$/g, ''), on_select: m[2] };
      parseEffects(m[3], choice);
      (beat.player_choices ??= []).push(choice);
      continue;
    }

    // ── Stage directions ───────────────────────────────────────────────────
    if ((m = line.match(/^\[PAUSE\s+([\d.]+)s\]/i))) { push({ type: 'pause', duration_ms: Math.round(parseFloat(m[1]) * 1000) }); continue; }
    if ((m = line.match(/^\[SYSTEM\]\s*(.*)$/i)))    { push({ type: 'system_message', body: m[1] }); continue; }
    if ((m = line.match(/^\[GHOST\s*(\d+)s?\]\s*(.*)$/i))) {
      push({ type: 'ghost_message', thread_id: thread ?? 'thread_group', body: m[2], auto_delete_ms: parseInt(m[1], 10) * 1000 });
      continue;
    }
    if ((m = line.match(/^\[TYPING\s+(\w+)\s+(start|stop)\]/i))) {
      push({ type: 'typing_indicator', thread_id: thread ?? 'thread_group', from: charOf(m[1]), action: m[2].toLowerCase() });
      continue;
    }
    if ((m = line.match(/^\[(PHOTO|VIDEO)\s+(\S+)\s*"([^"]*)"\]/i))) {
      push({ type: 'send_photo', thread_id: thread ?? 'thread_group', from: 'char_halima_phone', photo_id: m[2], caption: m[3] || null, media: m[1].toLowerCase() });
      continue;
    }
    if ((m = line.match(/^\[NARRATE(\s+R)?(?:\s+(?:photo|video)\s+\S+)?\]\s*(.*)$/i))) {
      push({ type: 'narrate', body: m[2], rogue: !!m[1] });
      continue;
    }
    if ((m = line.match(/^\[NOTIF-DM\s+(\w+)\]\s*(.*)$/i))) {
      // Cross-thread DM: real message into that character's DM thread; banner fires on its own
      push({ type: 'send_text', from: charOf(m[1]), thread_id: `thread_${m[1].toLowerCase()}`, body: m[2] });
      continue;
    }
    if ((m = line.match(/^\[NOTIF\s+([^\]]*)\]\s*(.*)$/i))) {
      push({ type: 'notify', title: m[1].trim(), body: m[2] || null });
      continue;
    }
    if ((m = line.match(/^\[SCREEN\s+(\w+)\s*([^\]]*)\]/i))) { push({ type: 'screen', screen: m[1], detail: m[2].trim() || null }); continue; }
    if ((m = line.match(/^\[TRUST\s+(\w+)\s*([+-]\d+)\]/i))) { push({ type: 'update_trust', character: charOf(m[1]), delta: parseInt(m[2], 10) }); continue; }
    if ((m = line.match(/^\[SLOT\s+(highest|lowest)-trust\]:\s*(.*)$/i))) {
      push({ type: 'send_text_slot', slot: m[1].toLowerCase(), thread_id: thread ?? 'thread_group', body: m[2] });
      continue;
    }
    if ((m = line.match(/^\[GROUP\s+(\S+):\s*([^\]]+)\]/i))) {
      push({ type: 'create_group_thread', thread_id: m[1], members: m[2].split(',').map(s => charOf(s.trim())) });
      continue;
    }
    if ((m = line.match(/^\[JOIN\s+(\S+):\s*(\w+)\]/i))) { push({ type: 'add_to_group_thread', thread_id: m[1], character: charOf(m[2]) }); continue; }
    if ((m = line.match(/^\[LEAVE\s+(\S+):\s*(\w+)\]/i))) { push({ type: 'remove_from_group_thread', thread_id: m[1], character: charOf(m[2]) }); continue; }
    if ((m = line.match(/^\[BUMP\s+(\S+)\]/i))) { push({ type: 'bump_thread', thread_id: m[1] }); continue; }
    if ((m = line.match(/^\[RECEIPTS\s+(\S+)\s+([\d.]+)s\]/i))) { push({ type: 'mark_read_receipts', thread_id: m[1], stagger_ms: Math.round(parseFloat(m[2]) * 1000) }); continue; }
    if ((m = line.match(/^\[COMPOSER\s+scramble\s+([\d.]+)s\]/i))) { push({ type: 'composer_effect', mode: 'scramble', duration_ms: Math.round(parseFloat(m[1]) * 1000) }); continue; }
    if (/^\[COMPOSER\s+clear\]/i.test(line)) { push({ type: 'composer_effect', mode: 'clear' }); continue; }
    if ((m = line.match(/^\[REVEAL\s+(\S+):/i)))         { push({ type: 'resolve_alias', thread_id: m[1], from: 'char_halima_phone', to: 'char_murna' }); continue; }
    if ((m = line.match(/^\[UNLOCK\s+(\w+)\]/i))) {
      const a = m[1].toLowerCase();
      push(['email', 'files', 'terminal'].includes(a) ? { type: 'unlock_computer_app', app: a } : { type: 'unlock_app', app: a });
      continue;
    }
    if ((m = line.match(/^\[FILE\s+(\S+)\s*"([^"]*)"\]/i))) { push({ type: 'file_unlock', file_id: m[1], name: m[2] }); continue; }
    if ((m = line.match(/^\[MINIGAME\s+"([^"]+)"\s+(\d+)s\s*→\s*success:\s*(\S+)\s*\/\s*failure:\s*(\S+)\]/i))) {
      push({ type: 'trigger_minigame', label: m[1], time_limit_seconds: parseInt(m[2], 10), on_success: m[3], on_failure: m[4] });
      continue;
    }
    if (/^\[VIBRATE\]/i.test(line)) { push({ type: 'phone_vibrate' }); continue; }

    // ── Dialogue ───────────────────────────────────────────────────────────
    if ((m = line.match(/^([A-Za-z]+(?:\s*\(audio\))?):\s*(.*)$/))) {
      const sender = SPEAKER_MAP[m[1].toLowerCase()];
      if (sender) {
        push({ type: 'send_text', from: sender, thread_id: thread ?? 'thread_group', body: m[2] });
        continue;
      }
    }

    warnings.push(`[${id}] unrecognized: ${line.slice(0, 90)}`);
    push({ type: 'narrator_note', note: `TODO(convert): ${line}` });
  }

  if (stack.length) warnings.push(`[${id}] UNCLOSED [IF] block — ${stack.length} frame(s) dropped`);
  beat.directives = rootDirectives;
  beats.push(beat);
}

const chapterNum = (beats[0]?.id.match(/^ch(\d+)/) ?? [])[1] ?? 'X';
const title = (raw.match(/^# CHAPTER \d+\s*—\s*"([^"]+)"/m) ?? [])[1] ?? `Chapter ${chapterNum}`;
const output = { id: `chapter_${String(chapterNum).padStart(2, '0')}`, title, beats };

const json = JSON.stringify(output, null, 2);
if (outPath) { writeFileSync(outPath, json); console.log(`Wrote ${beats.length} beats to ${outPath}`); }
else console.log(json);

if (warnings.length) {
  console.error(`⚠ ${warnings.length} warning(s):`);
  warnings.forEach(w => console.error('   ' + w));
} else {
  console.error('Clean parse — no unrecognized lines.');
}
