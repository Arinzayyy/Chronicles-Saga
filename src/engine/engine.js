/**
 * Engine — beat sequencer, directive executor, trust manager.
 *
 * Reads src/data/story.json as the canonical story source.
 * On construction it flattens all chapters into a single beatMap
 * so any beat can be looked up by id in O(1).
 *
 * Directive execution is sequential: a running `offset` cursor
 * advances after each directive so messages/pauses feel natural.
 *
 *   const engine = new Engine(actions, stateRef);
 *   engine.initialize();          // seeds trust scores from characters[]
 *   engine.loadBeat('beat_s1_001');
 */

import storyData from '../data/story.json';

// ms added to the offset cursor after each directive type.
// narrate / send_text / send_text_slot are NOT taken from this table — they
// are computed per-line from their text length by _staggerFor(), so short
// lines stay snappy and long lines get room to breathe. These constants are
// the fallback for fixed-length directives.
const STAGGER = {
  send_text:        650,
  send_text_slot:   650,
  typing_indicator: 380,
  system_message:   120,
  ghost_message:    400,
  narrate:          900,
  notify:           300,
  mark_read_receipts:      1200,
  bump_thread:              400,
  remove_from_group_thread: 200,
  composer_effect:          300,
  default:            0,
};

/**
 * Rough human reading time for a snippet of text, clamped to sane bounds.
 * ~200 wpm baseline (300ms/word) plus an optional fixed acquisition cost.
 */
function readingMs(text, { base = 0, perWord = 300, min = 0, max = Infinity } = {}) {
  const words = text ? String(text).trim().split(/\s+/).filter(Boolean).length : 0;
  return Math.max(min, Math.min(max, base + words * perWord));
}

export class Engine {
  /**
   * @param {Object} actions  - GameContext action helpers
   * @param {Object} stateRef - { current: gameState } ref, kept fresh by EngineContext
   */
  constructor(actions, stateRef) {
    this.actions  = actions;
    this.stateRef = stateRef;
    this.beatMap  = this._buildBeatMap();
    this._timers  = [];
    this._seedSeq = 0;   // orders back-dated "backlog" messages
  }

  /**
   * Timestamp for a seeded (backlog) message: a few hours in the past, with
   * each successive message nudged forward a couple of seconds so they keep
   * their order and still group under a single "earlier today" separator.
   */
  _seedTimestamp() {
    const base = Date.now() - 3 * 60 * 60 * 1000; // ~3 hours ago
    return base + (this._seedSeq++ * 1500);
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Seed initial trust scores from story characters[].trust_initial.
   * Must be called from a useEffect (not during render).
   */
  initialize() {
    for (const char of storyData.characters) {
      if (typeof char.trust_initial === 'number' && char.trust_initial !== 0) {
        this.actions.updateTrust(char.id, char.trust_initial);
      }
    }
  }

  loadBeat(beatId) {
    const beat = this.beatMap[beatId];
    if (!beat) {
      console.error(`[Engine] Unknown beat: "${beatId}"`);
      return;
    }

    this.actions.setBeat(beatId);
    if (beat.context) this.actions.setContext(beat.context);
    if (beat.app)     this.actions.setApp(beat.app);

    this._runDirectives(beat.directives ?? [], beat);
  }

  /**
   * Resolve a player choice: apply trust_effects, then advance to on_select beat.
   */
  resolveChoice(choice) {
    for (const fx of choice.trust_effects ?? []) {
      this.actions.updateTrust(fx.character, fx.delta);
    }
    for (const fx of choice.alignment_effects ?? []) {
      this.actions.updateAlignment(fx.axis, fx.delta);
    }
    for (const fx of choice.set_flags ?? []) {
      if (fx.value === '+1') {
        const cur = this.stateRef.current?.flags?.[fx.key];
        this.actions.setFlag(fx.key, (typeof cur === 'number' ? cur : 0) + 1);
      } else {
        this.actions.setFlag(fx.key, fx.value);
      }
    }
    if (choice.on_select) {
      this.advanceBeat(choice.on_select);
    }
  }

  /**
   * Jump to a beat directly, cancelling any in-flight timers.
   */
  advanceBeat(beatId) {
    if (!beatId) return;
    this._clearTimers();
    this.loadBeat(beatId);
  }

  // ─── Sequential Directive Runner ──────────────────────────────────────────

  /**
   * Schedule all directives in order, accumulating an offset cursor so that
   * pauses and message stagger produce natural timing.
   *
   * `pause` directives are never dispatched — they just advance the cursor.
   */
  /**
   * Evaluate a conditional directive's condition against live state.
   * Kinds: flag | pattern | beat | not_beat | trust | all (AND list)
   */
  _evalCond(cond) {
    const st = this.stateRef.current ?? {};
    if (!cond) return false;
    switch (cond.kind) {
      case 'all':
        return (cond.conds ?? []).every(c => this._evalCond(c));
      case 'flag': {
        const v = st.flags?.[cond.key];
        if (cond.value === undefined) return !!v;
        return v === cond.value;
      }
      case 'pattern': {
        // Patterns are counters; require 2+ occurrences before they shape Admin lines
        const v = st.flags?.[`pattern__player__${cond.name}`];
        return (typeof v === 'number' ? v : (v ? 1 : 0)) >= 2;
      }
      case 'beat':
        return (st.beatHistory ?? []).includes(cond.id);
      case 'not_beat':
        return !(st.beatHistory ?? []).includes(cond.id);
      case 'trust':
        return (st.trustScores?.[cond.character] ?? 0) >= cond.min;
      default:
        return false;
    }
  }

  /**
   * Flatten conditionals at schedule time: pick the first branch whose
   * condition passes, else the final else-branch.
   */
  _flatten(directives) {
    const out = [];
    for (const d of directives ?? []) {
      if (d.type === 'conditional') {
        let chosen = d.else ?? [];
        for (const br of d.branches ?? []) {
          if (this._evalCond(br.condition)) { chosen = br.directives ?? []; break; }
        }
        out.push(...this._flatten(chosen));
      } else {
        out.push(d);
      }
    }
    return out;
  }

  _runDirectives(rawDirectives, beat) {
    let offset = 0;
    // Track when the last *thread message* directive lands, separate from the
    // full beat length (which includes long inner-voice narration staggers).
    // Choice beats use this so options unlock as soon as the NPC stops texting,
    // not after the narration timing also finishes.
    let lastMsgOffset = 0;
    let sawMsg = false;
    const MSG_TYPES = new Set(['send_text', 'send_text_slot', 'send_photo', 'ghost_message']);
    const directives = this._flatten(rawDirectives);

    // Beat-level trust gate: route immediately, run nothing else
    const gate = directives.find(d => d.type === 'trust_check');
    if (gate) {
      const pass = this._evalCond(gate.condition);
      const target = pass ? gate.on_pass : gate.on_fail;
      const t = setTimeout(() => this.advanceBeat(target), 50);
      this._timers.push(t);
      return;
    }

    for (const directive of directives) {
      if (directive.type === 'pause') {
        offset += directive.duration_ms ?? 1000;
        continue;
      }

      // narrator_note is dev-only metadata, never dispatched to state
      if (directive.type === 'narrator_note') {
        if (import.meta.env.DEV) {
          console.info(`[Narrator] ${directive.note}`);
        }
        continue;
      }

      // Seeded directives are "backlog" — messages that were already waiting on
      // the phone before the player opened it. They drop in as an instant batch
      // (no stagger, no live surge) and don't advance the cursor.
      const seed = directive.seed === true || beat?.prefill === true;

      const at = offset;
      const t  = setTimeout(() => this.executeDirective(directive, seed), at);
      this._timers.push(t);

      offset += seed ? 0 : this._staggerFor(directive);

      if (MSG_TYPES.has(directive.type)) {
        sawMsg = true;
        lastMsgOffset = offset;
      }
    }

    // Auto-advance when the beat has on_complete and no player choices.
    // The final directive's own (now reading-aware) dwell is already baked into
    // `offset`, so the last line lingers; this gap is just a gentle breath
    // between beats so the cut doesn't feel abrupt.
    const hasChoices = beat?.player_choices?.length > 0;
    if (beat?.on_complete && !hasChoices) {
      const t = setTimeout(() => this.advanceBeat(beat.on_complete), offset + 600);
      this._timers.push(t);
    }

    // Choice beats: announce when the NPC is done texting so the UI can unlock
    // the player's options. Fire at the last *message* offset (not the full
    // beat length, which includes long narration), so trailing inner-voice
    // lines don't hold the choices hostage. Beats with no messages settle at
    // the full offset. The UI still also waits for its own reveal queue.
    if (hasChoices) {
      const settleAt = sawMsg ? lastMsgOffset : offset;
      const t = setTimeout(
        () => this.actions.setFlag('__beatSettled__', { beat: beat.id, ts: Date.now() }),
        settleAt + 120,
      );
      this._timers.push(t);
    }
  }

  /**
   * How long to wait after a directive before the next one lands.
   * Text-bearing directives scale with their length so the reader isn't
   * outrun; everything else uses the fixed STAGGER table.
   */
  _staggerFor(directive) {
    switch (directive.type) {
      case 'narrate':
        // The Viewer's inner voice. Short punches stay quick; long, cinematic
        // lines actually breathe instead of flashing past in 900ms. Lines
        // linger generously — they sit in the side panel, so giving them more
        // time costs nothing and lets the mood land.
        return readingMs(directive.body, { base: 1100, perWord: 280, min: 1900, max: 5400 });
      case 'send_text':
      case 'send_text_slot':
        // Texting bursts stay snappy, but a long paragraph gets room before the
        // next bubble piles on top of it.
        return readingMs(directive.body, { base: 480, perWord: 95, min: 540, max: 1900 });
      default:
        return STAGGER[directive.type] ?? STAGGER.default;
    }
  }

  // ─── Directive Executor ───────────────────────────────────────────────────

  executeDirective(directive, seed = false) {
    switch (directive.type) {

      // ── Messaging ─────────────────────────────────────────────────────────

      case 'send_text':
        this.actions.addMessage(directive.thread_id, {
          id:        `msg_${Date.now()}_${Math.random()}`,
          sender:    directive.from,
          threadId:  directive.thread_id,
          body:      directive.body,
          timestamp: seed ? this._seedTimestamp() : Date.now(),
          isGhost:   false,
          isSystem:  false,
          isRead:    false,
          isBacklog: seed,
        });
        break;

      case 'ghost_message': {
        const msgId = `ghost_${Date.now()}_${Math.random()}`;
        this.actions.addMessage(directive.thread_id, {
          id:        msgId,
          sender:    'char_admin',
          threadId:  directive.thread_id,
          body:      directive.body,
          timestamp: Date.now(),
          isGhost:   true,
          isSystem:  false,
          isRead:    false,
          flashOnly: directive.flash_only ?? false,
        });
        // auto_delete_ms === 0 → persistent ghost (it stays; that's the story point).
        // Otherwise floor at 4 s so ghost messages are always readable.
        if (directive.auto_delete_ms !== 0) {
          const ttl = Math.max(directive.auto_delete_ms ?? 4000, 4000);
          const t   = setTimeout(
            () => this.actions.removeGhostMessage(directive.thread_id, msgId),
            ttl,
          );
          this._timers.push(t);
        }
        break;
      }

      case 'send_photo':
        this.actions.addMessage(directive.thread_id, {
          id:        `photo_${Date.now()}_${Math.random()}`,
          sender:    directive.from,
          threadId:  directive.thread_id,
          body:      `[photo: ${directive.photo_id}]`,
          photoId:   directive.photo_id,
          caption:   directive.caption ?? null,
          timestamp: seed ? this._seedTimestamp() : Date.now(),
          isPhoto:   true,
          isGhost:   false,
          isSystem:  false,
          isRead:    false,
          isBacklog: seed,
        });
        break;

      case 'system_message':
        this.actions.addMessage('__system__', {
          id:        `sys_${Date.now()}_${Math.random()}`,
          sender:    '__system__',
          threadId:  '__system__',
          body:      directive.body,
          timestamp: Date.now(),
          isSystem:  true,
          isGhost:   false,
          isRead:    false,
        });
        break;

      case 'typing_indicator':
        this.actions.setTypingIndicator(
          directive.thread_id,
          directive.from,
          directive.action === 'start',
        );
        break;

      // ── Thread management ─────────────────────────────────────────────────

      case 'create_group_thread':
        this.actions.createGroupThread(directive.thread_id, directive.members ?? []);
        break;

      case 'add_to_group_thread':
        this.actions.addToGroupThread(directive.thread_id, directive.character);
        break;

      case 'remove_from_group_thread':
        this.actions.removeFromGroupThread(directive.thread_id, directive.character);
        break;

      // Story-driven inbox reorder — the thread silently sorts to the top of
      // the SMS thread list (Ch 8: Halima's dead thread moves. Unprompted.)
      case 'bump_thread':
        this.actions.bumpThread(directive.thread_id);
        break;

      // Read receipts land on the player's own sent messages, oldest first,
      // one per stagger interval (Ch 8: "All at once. Then in order.")
      case 'mark_read_receipts': {
        const msgs = (this.stateRef?.current?.messageThreads?.[directive.thread_id] ?? [])
          .filter(m => m.sender === 'player' && !m.receiptRead);
        const step = directive.stagger_ms ?? 2000;
        msgs.forEach((m, i) => {
          const t = setTimeout(
            () => this.actions.markMessageReceipt(directive.thread_id, m.id),
            i * step,
          );
          this._timers.push(t);
        });
        break;
      }

      // Doubt mechanic, physicalized: the message composer itself misbehaves.
      // mode 'scramble' — input bar glitches for duration_ms; choices hold.
      // mode 'clear'    — effect lifts instantly (Root Access: no hesitation).
      case 'composer_effect':
        this.actions.setFlag('__composerEffect__', {
          mode:        directive.mode,
          duration_ms: directive.duration_ms ?? 3000,
          ts:          Date.now(),
        });
        break;

      case 'resolve_alias':
        // Rename all messages from `from` → `to` in the given thread
        this.actions.resolveAlias(directive.thread_id, directive.from, directive.to);
        break;

      // ── Trust / Alignment ─────────────────────────────────────────────────

      case 'update_trust':
        this.actions.updateTrust(directive.character, directive.delta);
        break;

      case 'init_trust':
        // Purely informational in the story — trust is already seeded by initialize().
        // Re-emit as system messages so the UI can display the initial state.
        for (const entry of directive.entries ?? []) {
          this.actions.addMessage('__system__', {
            id:        `init_trust_${entry.character}_${Date.now()}`,
            sender:    '__system__',
            threadId:  '__system__',
            body:      `${entry.label}: ${entry.state}`,
            timestamp: Date.now(),
            isSystem:  true,
            isGhost:   false,
            isRead:    false,
          });
        }
        break;

      case 'display_trust_state':
        for (const entry of directive.entries ?? []) {
          this.actions.addMessage('__system__', {
            id:        `trust_state_${entry.character}_${Date.now()}`,
            sender:    '__system__',
            threadId:  '__system__',
            body:      `${entry.character.replace('char_', '')}: ${entry.state}`,
            timestamp: Date.now(),
            isSystem:  true,
            isGhost:   false,
            isRead:    false,
          });
        }
        break;

      // ── Flags / Metadata ──────────────────────────────────────────────────

      case 'log_pattern':
        this.actions.setFlag(
          `pattern__${directive.character}__${directive.pattern}`,
          true,
        );
        break;

      case 'set_flag':
        this.actions.setFlag(directive.key, directive.value);
        break;

      case 'unlock_app':
        this.actions.unlockApp(directive.app);
        break;

      case 'unlock_computer_app':
        this.actions.unlockComputerApp(directive.app);
        break;

      // ── Minigame trigger ─────────────────────────────────────────────────

      case 'trigger_minigame':
        this.actions.setFlag('__minigame__', {
          label:              directive.label ?? 'DECRYPT SEQUENCE',
          time_limit_seconds: directive.time_limit_seconds ?? 30,
          on_success:         directive.on_success ?? null,
          on_failure:         directive.on_failure ?? null,
        });
        break;

      // ── Narration / notifications / screens ─────────────────────────────

      case 'narrate':
        this.actions.pushNarration({
          id:    `narr_${Date.now()}_${Math.random()}`,
          body:  directive.body,
          rogue: directive.rogue ?? false,
        });
        break;

      case 'notify': {
        // Title-only banner (e.g. "🔔 Halima"). DM notifications are plain
        // send_texts into the DM thread — NotificationBanner picks those up itself.
        const title = directive.title ?? 'Notification';
        const body  = directive.body ?? '';
        // Optional explicit linger (ms); otherwise the banner auto-sizes its
        // dwell from the text length.
        this.actions.setFlag('__notify__', { title, body, ts: Date.now(), duration: directive.duration_ms ?? null });
        // Also accumulate into the lock-screen stack so the opening reads as a
        // pile of waiting notifications with a count, not a fly-by banner.
        const stack = this.stateRef.current?.flags?.__lockNotifs__ ?? [];
        this.actions.setFlag('__lockNotifs__', [
          ...stack,
          { id: `ln_${Date.now()}_${this._seedSeq++}`, title, body },
        ]);
        break;
      }

      case 'screen':
        this.actions.setFlag('__screen__', { screen: directive.screen, detail: directive.detail ?? null, ts: Date.now() });
        break;

      case 'file_unlock':
        this.actions.unlockFile({ id: directive.file_id, name: directive.name ?? directive.file_id });
        break;

      // ── Trust-slot speaker (resolved live from trust scores) ─────────────

      case 'send_text_slot': {
        const st     = this.stateRef.current ?? {};
        const scores = st.trustScores ?? {};
        const pool   = ['char_murna', 'char_kelvin', 'char_pitch', 'char_ayo', 'char_loray']
          .concat((scores.char_vi ?? 0) >= 20 ? ['char_vi'] : []);
        const sorted = [...pool].sort((a, b) => (scores[a] ?? 0) - (scores[b] ?? 0));
        const sender = directive.slot === 'highest' ? sorted[sorted.length - 1] : sorted[0];
        this.actions.addMessage(directive.thread_id, {
          id:        `slot_${Date.now()}_${Math.random()}`,
          sender,
          threadId:  directive.thread_id,
          body:      directive.body,
          timestamp: seed ? this._seedTimestamp() : Date.now(),
          isGhost:   false,
          isSystem:  false,
          isRead:    false,
          isBacklog: seed,
        });
        break;
      }

      // ── Visual-only / no-op directives ────────────────────────────────────

      case 'phone_vibrate':
      case 'notify_empty':
        break;

      // ── Already handled at scheduling time ────────────────────────────────

      case 'pause':
      case 'narrator_note':
        break;

      default:
        if (import.meta.env.DEV) {
          console.warn(`[Engine] Unhandled directive type: "${directive.type}"`, directive);
        }
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /** First beat of the first chapter — the season's entry point. */
  firstBeatId() {
    return storyData.chapters?.[0]?.beats?.[0]?.id ?? null;
  }

  _buildBeatMap() {
    const map = {};
    for (const chapter of storyData.chapters) {
      for (const beat of chapter.beats) {
        if (map[beat.id]) {
          console.warn(`[Engine] Duplicate beat id: "${beat.id}" (chapter: ${chapter.id})`);
        }
        map[beat.id] = beat;
      }
    }
    return map;
  }

  _clearTimers() {
    this._timers.forEach(clearTimeout);
    this._timers = [];
  }

  destroy() {
    this._clearTimers();
  }
}
