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

// ms added to the offset cursor after each directive type
const STAGGER = {
  send_text:        650,
  typing_indicator: 380,
  system_message:   120,
  ghost_message:    400,
  default:            0,
};

export class Engine {
  /**
   * @param {Object} actions  - GameContext action helpers
   * @param {Object} stateRef - { current: gameState } ref, kept fresh by EngineContext
   */
  constructor(actions, stateRef) {
    this.actions     = actions;
    this.stateRef    = stateRef;
    this.beatMap     = this._buildBeatMap();
    this._timers     = [];
    // Incremented every time timers are cleared. Directive callbacks capture
    // the generation at scheduling time and bail out if it no longer matches,
    // preventing stale directives from an old beat from corrupting new state.
    this._generation = 0;
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
  _runDirectives(directives, beat) {
    let offset = 0;

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

      const at  = offset;
      const gen = this._generation;
      const t   = setTimeout(() => {
        if (this._generation !== gen) return; // beat was superseded — drop
        this.executeDirective(directive);
      }, at);
      this._timers.push(t);

      offset += STAGGER[directive.type] ?? STAGGER.default;
    }

    // Auto-advance when the beat has on_complete and no player choices
    const hasChoices = beat?.player_choices?.length > 0;
    if (beat?.on_complete && !hasChoices) {
      const gen = this._generation;
      const t   = setTimeout(() => {
        if (this._generation !== gen) return; // beat was superseded — drop
        this.advanceBeat(beat.on_complete);
      }, offset + 300);
      this._timers.push(t);
    }
  }

  // ─── Directive Executor ───────────────────────────────────────────────────

  executeDirective(directive) {
    switch (directive.type) {

      // ── Messaging ─────────────────────────────────────────────────────────

      case 'send_text':
        this.actions.addMessage(directive.thread_id, {
          id:        `msg_${Date.now()}_${Math.random()}`,
          sender:    directive.from,
          threadId:  directive.thread_id,
          body:      directive.body,
          timestamp: Date.now(),
          isGhost:   false,
          isSystem:  false,
          isRead:    false,
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
        // Floor at 4 s so ghost messages are always readable regardless of story value
        const ttl = Math.max(directive.auto_delete_ms ?? 4000, 4000);
        const t   = setTimeout(
          () => this.actions.removeGhostMessage(directive.thread_id, msgId),
          ttl,
        );
        this._timers.push(t);
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
          timestamp: Date.now(),
          isPhoto:   true,
          isGhost:   false,
          isSystem:  false,
          isRead:    false,
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

  _buildBeatMap() {
    const map = {};
    for (const chapter of storyData.chapters) {
      for (const beat of chapter.beats) {
        if (map[beat.id]) {
          console.error(`[Engine] Duplicate beat id: "${beat.id}" (chapter: ${chapter.id})`);
        }
        map[beat.id] = beat;
      }
    }
    return map;
  }

  _clearTimers() {
    this._timers.forEach(clearTimeout);
    this._timers = [];
    this._generation++;
  }

  destroy() {
    this._clearTimers();
  }
}
