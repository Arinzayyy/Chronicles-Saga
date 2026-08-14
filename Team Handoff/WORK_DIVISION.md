# CHRONICLES SAGA — Team Board

**Arinze** (the minigame system) · **Benjamin** (Chapter 12 endgame) · **Luca** (interface & polish)

This document exists so all three of us can see the *whole* project, not just our own lane. Read the parts that aren't yours — that's the point. Your work touches theirs in ways that aren't obvious from your own task list.

---

## 1. Where the project stands today

**The story is finished and in the game.** All twelve chapters — prologue through three endings — are written by Ben, converted, merged, and validating clean. 12 chapters, ~280 beats, three route-locked endings. `npm run validate` reports a fully playable graph with zero errors.

**What already works:**

- Phone OS: SMS, gallery, settings, lock screen, notifications
- Computer OS: email, files, terminal (hosts the Ch 5 decrypt minigame)
- Beat engine: sequential directives, natural message pacing, typing indicators, ghost messages that self-delete
- Trust (per character) and three alignment axes; trust-gated content and milestone photos
- Conditional branching on flags, patterns, visited beats, and trust thresholds
- Save/load with multiple slots and autosave
- Audio: BGM, SFX, volume control
- Season-one endgame mechanics: group membership changes, read receipts, inbox reordering, the Doubt composer effects

**What's missing (the whole remaining board):**

| Area | Item | Owner | Severity |
|---|---|---|---|
| Endings | No ending screen — season end just stops playback | Luca | **Defect** — every player, every route |
| Ch 12 | PC multi-feed interface unbuilt; endings play as chat + narration | Ben | Major presentation gap |
| Minigames | 9 proposed, 1 exists | Arinze | Enhancement |
| Apps | Lens + Feeds don't exist yet | Arinze | Needed before games ship |
| Polish | Admin renders as `---` though it signs "admin" from Ch 8 | Ben → Luca | Small |
| Polish | "admin is replying to…" is a system line, should be a quoted reply | Luca | Small |
| Polish | Prediction block (Ch 9/11) has no bespoke component | Luca | Small |
| QA | **Nobody has played the game end to end** | All three | Risk |
| Repo | ~50 files uncommitted | Arinze | Do first |

---

## 2. The three lanes

Each lane is a **whole system owned by one person**, not a stage in a pipeline. Nobody hands work to anybody. That's the point.

### ARINZE — The minigame system (build *and* wire)

Owns the full vertical: the host apps, the games, and the wiring that puts them in the story.

- **Host + three apps** — extract the reusable host from `Terminal.jsx` (it already implements the whole contract for the Ch 5 decrypt), then point Terminal / Lens / Feeds at it
- **All ten games:**
  - *Hacking / terminal* — Ch 2 Frequency Trace · Ch 5 Voice Memo *(exists)* · Ch 8 Salvage · Ch 9 Sift · Ch 9 Relay Trace · Ch 12 Failsafe Assist
  - *Sight & perception* — Ch 6 Marker Watch · Ch 7 Verify
  - *Live tactical* — Ch 3 Pattern Read · Ch 12 Drone Work
- **Wiring** — converter support for the extended `[MINIGAME]` syntax, master-file blocks, convert, validate, play
- **Design language and failure-cost tuning** across all three families

**Cadence: one or two games a week**, each carried all the way to playable-in-story before the next begins.

### BENJAMIN — Chapter 12 endgame

The endings are written and in the game; their *presentation* was never specified. He wrote them, so he defines them.

- **PC multi-feed interface** — spec first (4–5 cam panels, feeds going dark, how the layout differs across the three endings), then build if tooling allows. Largest undefined thing in the project
- **Three ending screens** — the copy Luca's frame will hold
- **Admin voice call** — `---` or `admin` from Ch 8 onward
- **Minigame proposal verdict** — he has veto
- **Seam lines** — reviewed in batches, not authored from scratch (see below)
- **Chapter 13** — open whenever he wants it

### LUCA — Interface & polish

Independent of the minigame system entirely, so nothing in his lane waits on a game existing.

- **Hosted build for Ben** — one hour, unblocks Ben's entire lane
- **Ending screen** — the one live defect; frame now, Ben's copy later
- **Presentation polish** — quoted-reply bubble, Admin display name, prediction block (Ch 9/11)
- **The bug list** — he's the closest thing to QA; plays every chapter as it lands

---

## 3. How the lanes interlock

Very little, deliberately. What connections remain:

```
LUCA's hosted build ──────► unblocks BEN entirely        (1 hour, do it first)

ARINZE drafts seam lines ──► BEN rewrites in batches ──► ARINZE drops them in
        (never blocking in either direction)

BEN's ending copy ────────► LUCA's ending screen frame   (frame built without it)
BEN's Ch 12 spec ─────────► built by BEN, or LUCA if tooling doesn't allow
```

Practical consequences:

- **A minigame is done when Arinze says it's done.** Build, wire, validate, play — one person, one slice, no handoff. This is the biggest change from the earlier plan and the reason the cadence is realistic.
- **Seam dialogue never blocks.** Arinze writes placeholder lines in Ben's voice while he's already in the master file; Ben rewrites them in batches of two or three whenever it suits him. Placeholders ship if they have to.
- **Luca builds frames, not contents.** The ending screen gets built empty and filled when Ben's copy arrives.
- **Nobody hand-edits `story.json`.** See §5.

---

## 4. Roadmap

**Step 0 — today (Arinze, 10 min).** Commit the working tree. Everything below assumes a clean base.

**Step 1 — this week: all three play the full season.** Separately, start to finish, taking notes. This is the highest-value thing the team can do right now and it costs a day. We have a finished twelve-chapter game that none of us has experienced end to end; every priority call below gets sharper afterward, and the minigame slots in particular should be confirmed against where the pacing *actually* sags.

**Step 2 — close the defect.** Ending screen, plus whatever the playthrough surfaces. At this point Season One is complete and shippable on its own terms.

**Step 3 — three independent tracks open.**
- **Arinze:** generalise the host out of `Terminal.jsx` → Marker Watch → wire it end to end. That first complete slice proves the pipeline; everything after is the same five steps.
- **Luca:** ending screen frame → presentation polish → bug list.
- **Ben:** proposal verdict → Ch 12 feed interface spec → ending copy.

**Step 4 — cadence.** Arinze at one to two games a week in whatever order the playthrough justified (Terminal family batches fastest). Ben's Ch 12 work and Luca's polish run alongside at their own pace.

---

## 5. Working agreements

**The minigame contract still stands** — `docs/MINIGAME_CONTRACT.md`. A game is a pure component taking `config`, `timeLeft`, `onResolve`; games never touch the engine, advance beats, write flags, or run their own timer. Arinze now owns both sides of it, so it's no longer a coordination device between two people — it's his own discipline. Keep it anyway: ten games that all resolve the same way are ten games that can be re-tuned, re-ordered, or cut without touching the host.

**File ownership** (this is what keeps concurrent work from turning into merge hell):

- **Arinze** — `src/screens/minigames/*`, `Terminal.jsx`, the Lens and Feeds apps, `scripts/convert-story.js`, and `[MINIGAME]` blocks in the CH masters
- **Luca** — ending screen, `SMSApp.jsx`, phone/desktop UI, presentation components
- **Ben** — documents; the Ch 12 feed interface if he builds it
- **Touched by two people:** `ComputerHome` (Arinze registers apps, Luca styles) and `engine.js` (rare, small). Shout before either.

**`story.json` is a build artifact.** 13k generated lines; hand-merging it is misery. Never edit directly. On any conflict, take either side wholesale and re-run the converter over all masters. Masters are the only source of truth.

**Branches:** `feat/minigames` (Arinze), `feat/ui` (Luca), `feat/ch12` (Ben). Rebase onto main often — the file split keeps rebases clean.

---

## 6. Open calls (10 minutes, then everyone proceeds)

1. **App names** — recommend **Terminal / Lens / Feeds**. Terminal already exists in-fiction; Feeds' shell becomes the Ch 12 interface.
2. **Idle screens** — recommend blank plus one dormant line (`NO ACTIVE READ` / `NO LIVE FEED` / blinking cursor) so the apps read as dormant rather than broken.

Neither blocks a start.
