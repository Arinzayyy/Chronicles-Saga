#!/usr/bin/env node
/**
 * validate-story.js — story.json plumbing checker.
 *
 * Run:  npm run validate
 *
 * Confirms the story graph is playable before it ships:
 *   ERRORS (exit 1 — must fix):
 *     E1  duplicate beat ids
 *     E2  reference to a beat id that doesn't exist
 *         (on_complete, choice on_select, minigame on_success/on_failure)
 *     E3  unreachable beats (no path from any chapter entry point)
 *     E4  unknown character in a directive `from` or trust_effects
 *     E5  unknown alignment axis in alignment_effects
 *     E6  directive type the engine doesn't implement
 *     E7  choice with no on_select target
 *   WARNINGS (printed, exit 0):
 *     W1  dead-end beat (no on_complete, no choices) not marked "is_ending": true
 *     W2  choice count outside 2–4
 *     W3  trust delta outside the ±3 style band
 *     W4  thread referenced but never created by create_group_thread
 *         (fine for DM threads — listed so typos stand out)
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORY_PATH = process.argv[2] ?? join(__dirname, '..', 'src', 'data', 'story.json');

// Keep in sync with the switch in src/engine/engine.js
const KNOWN_DIRECTIVES = new Set([
  'send_text', 'ghost_message', 'send_photo', 'system_message',
  'typing_indicator', 'create_group_thread', 'add_to_group_thread',
  'resolve_alias', 'update_trust', 'init_trust', 'display_trust_state',
  'log_pattern', 'set_flag', 'unlock_app', 'unlock_computer_app',
  'trigger_minigame', 'phone_vibrate', 'notify_empty', 'pause',
  'narrator_note',
  // v2 (engine.js conditional/narration era)
  'narrate', 'notify', 'screen', 'file_unlock', 'send_text_slot',
  'conditional', 'trust_check',
  // v3 (Season One endgame mechanics)
  'remove_from_group_thread', 'bump_thread', 'mark_read_receipts', 'composer_effect',
]);

// Recursively walk directives, descending into conditional branches.
function* walkDirectives(directives) {
  for (const d of directives ?? []) {
    yield d;
    if (d.type === 'conditional') {
      for (const br of d.branches ?? []) yield* walkDirectives(br.directives);
      yield* walkDirectives(d.else);
    }
  }
}

const KNOWN_AXES = new Set(['Integration', 'Dominion', 'Calibration']);
const SPECIAL_SENDERS = new Set(['player', '__system__', 'char_admin', 'char_unknown']);

// ── Load ───────────────────────────────────────────────────────────────────────
let story;
try {
  story = JSON.parse(readFileSync(STORY_PATH, 'utf8'));
} catch (e) {
  console.error(`✖ Could not read/parse ${STORY_PATH}\n  ${e.message}`);
  process.exit(1);
}

const errors = [];
const warnings = [];
const err  = (code, msg) => errors.push(`E${code}  ${msg}`);
const warn = (code, msg) => warnings.push(`W${code}  ${msg}`);

// ── Collect beats ──────────────────────────────────────────────────────────────
const beats = new Map();          // id -> { beat, chapterId }
const entryPoints = [];

for (const chapter of story.chapters ?? []) {
  const chBeats = chapter.beats ?? [];
  if (chBeats.length) entryPoints.push(chBeats[0].id);
  for (const beat of chBeats) {
    if (beats.has(beat.id)) {
      err(1, `duplicate beat id "${beat.id}" (chapters: ${beats.get(beat.id).chapterId}, ${chapter.id})`);
    }
    beats.set(beat.id, { beat, chapterId: chapter.id });
  }
}

const characters = new Set((story.characters ?? []).map(c => c.id));

// Every outgoing edge of a beat: [targetId, description]
function edgesOf(beat) {
  const out = [];
  if (beat.on_complete) out.push([beat.on_complete, 'on_complete']);
  (beat.player_choices ?? []).forEach((c, i) => {
    if (c.on_select) out.push([c.on_select, `choice #${i + 1} "${c.label ?? ''}"`]);
  });
  for (const d of walkDirectives(beat.directives)) {
    if (d.on_success) out.push([d.on_success, `${d.type} on_success`]);
    if (d.on_failure) out.push([d.on_failure, `${d.type} on_failure`]);
    if (d.on_pass)    out.push([d.on_pass,    `${d.type} on_pass`]);
    if (d.on_fail)    out.push([d.on_fail,    `${d.type} on_fail`]);
  }
  return out;
}

// ── Per-beat checks ────────────────────────────────────────────────────────────
for (const [id, { beat, chapterId }] of beats) {
  const where = `[${chapterId} / ${id}]`;

  // E2: broken references
  for (const [target, desc] of edgesOf(beat)) {
    if (!beats.has(target)) err(2, `${where} ${desc} points to missing beat "${target}"`);
  }

  // E4/E6: directive checks (recursing into conditional branches)
  for (const d of walkDirectives(beat.directives)) {
    if (!KNOWN_DIRECTIVES.has(d.type)) {
      err(6, `${where} unknown directive type "${d.type}" — engine will ignore it`);
    }
    if (d.from && !characters.has(d.from) && !SPECIAL_SENDERS.has(d.from)) {
      err(4, `${where} directive "${d.type}" from unknown character "${d.from}"`);
    }
  }

  // Choice checks
  const choices = beat.player_choices ?? [];
  if (choices.length > 0 && (choices.length < 2 || choices.length > 4)) {
    warn(2, `${where} has ${choices.length} choice(s) — style guide says 2–4`);
  }
  choices.forEach((c, i) => {
    const cwhere = `${where} choice #${i + 1} "${c.label ?? ''}"`;
    if (!c.on_select) err(7, `${cwhere} has no on_select target — player gets stuck`);
    for (const fx of c.trust_effects ?? []) {
      if (!characters.has(fx.character)) err(4, `${cwhere} trust_effect on unknown character "${fx.character}"`);
      if (Math.abs(fx.delta) > 3) warn(3, `${cwhere} trust delta ${fx.delta} exceeds ±3 band`);
    }
    for (const fx of c.alignment_effects ?? []) {
      if (!KNOWN_AXES.has(fx.axis)) err(5, `${cwhere} unknown alignment axis "${fx.axis}"`);
    }
  });

  // W1: dead ends — beats routed by trust_check or minigame are not dead ends
  const hasRouting = [...walkDirectives(beat.directives)].some(
    d => d.type === 'trust_check' || d.on_success || d.on_failure,
  );
  if (!beat.on_complete && choices.length === 0 && !beat.is_ending && !hasRouting) {
    warn(1, `${where} is a dead end (no on_complete, no choices). Mark "is_ending": true if intentional.`);
  }
}

// ── E3: reachability ───────────────────────────────────────────────────────────
const reachable = new Set();
const stack = [...entryPoints];
while (stack.length) {
  const id = stack.pop();
  if (reachable.has(id) || !beats.has(id)) continue;
  reachable.add(id);
  for (const [target] of edgesOf(beats.get(id).beat)) stack.push(target);
}
for (const id of beats.keys()) {
  if (!reachable.has(id)) {
    err(3, `[${beats.get(id).chapterId} / ${id}] is unreachable — no path from any chapter start`);
  }
}

// ── W4: threads used vs created ────────────────────────────────────────────────
const createdThreads = new Set();
const usedThreads = new Set();
for (const { beat } of beats.values()) {
  for (const d of walkDirectives(beat.directives)) {
    if (d.type === 'create_group_thread') createdThreads.add(d.thread_id);
    else if (d.thread_id) usedThreads.add(d.thread_id);
  }
}
for (const t of usedThreads) {
  if (!createdThreads.has(t) && t !== '__system__') {
    warn(4, `thread "${t}" is used but never created via create_group_thread (fine for DM threads — check for typos)`);
  }
}

// ── Report ─────────────────────────────────────────────────────────────────────
console.log(`\nChronicles Saga story validator`);
console.log(`  file:     ${STORY_PATH}`);
console.log(`  chapters: ${(story.chapters ?? []).length}   beats: ${beats.size}   characters: ${characters.size}\n`);

if (warnings.length) {
  console.log(`⚠ ${warnings.length} warning(s):`);
  warnings.forEach(w => console.log(`   ${w}`));
  console.log('');
}
if (errors.length) {
  console.log(`✖ ${errors.length} error(s):`);
  errors.forEach(e => console.log(`   ${e}`));
  console.log('\nStory graph is BROKEN — fix errors before shipping.\n');
  process.exit(1);
}
console.log(`✔ Story graph is playable. No errors${warnings.length ? ` (${warnings.length} warning(s) above)` : ''}.\n`);
