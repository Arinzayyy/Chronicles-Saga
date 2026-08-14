# CHRONICLES SAGA — Season One Story Draft (EXAMPLE)

**Status:** Example draft for the writer to follow — not final canon.
**Authors:** Arinze Ohaemesi, Luca-Harding
**Format owner:** This document is the writer's space. The dev team converts finished chapters into `story.json`. The writer never touches JSON.

---

## 1. How to Read & Write This Document

Every scene is built from **beats**. A beat is one continuous burst of activity on one screen (one app, one thread). The engine plays a beat's lines in order with natural delays, then either auto-advances or waits on a player choice.

### Beat block format

```
### BEAT: ch3_001 — "Cold Open"
Context: phone / SMS (TEMP-3)

MURNA: anyone else's phone running hot
KELVIN: that's not a joke
[SYSTEM] Battery diagnostics accessed remotely
[GHOST 4s] warmer
[PAUSE 2s]
PITCH: it's in the hardware now

> "Pull your batteries. Now."        → ch3_002a   (Dominion +1, Ayo +1)
> "Stay calm. It wants the panic."   → ch3_002b   (Calibration +2)
> "Kelvin, can you trace it?"        → ch3_002c   (Integration +1, Kelvin +1)
```

### The writer's toolbox (everything the engine can do)

| Stage direction | What it does on screen |
|---|---|
| `NAME: text` | Character sends a text in the current thread. Line breaks inside one message are allowed (write them as new lines, indented). |
| `VIEWER: text` | The player's own bubble (used after a choice to echo what they picked). |
| `[SYSTEM] text` | Grey system line ("Participant added", "Message deleted"). |
| `[GHOST 4s] text` | Ghost message from the admin entity. Appears, self-deletes after N seconds (minimum 4). |
| `[PAUSE 2s]` | Silence. Use it — dread lives in the pauses. |
| `[TYPING name start/stop]` | Show/hide the "..." indicator. Great for fake-outs (typing starts, stops, no message ever comes). |
| `[PHOTO photo_id "caption"]` | Character sends a photo. Unlocks in Gallery automatically. |
| `[EMAIL from / subject]` + body | Delivers an email to the computer's Email app. |
| `[FILE file_id "display name"]` | Unlocks a file in the computer's Files app. |
| `[UNLOCK app]` | Unlocks a phone or computer app (e.g. the terminal). |
| `[MINIGAME "LABEL" 30s → success: beat / failure: beat]` | Triggers the terminal decrypt minigame with a time limit and two outcomes. |
| `[GROUP thread_id: members]` | Creates a group thread. |
| `[JOIN thread_id: name]` | Adds someone to an existing group. |
| `[REVEAL thread_id: old_name → new_name]` | Retroactively renames a sender in a thread (e.g. "Unknown" becomes "Murna"). |
| `[VIBRATE]` | Phone buzz, no content. |
| `[IF TRUST name ≥ N → beat / else → beat]` | Branch on a character's current trust score. Used for trust-gated content like milestone photos. *(New engine feature — flag any other conditions you need.)* |
| `[NOTE] text` | Narrator note for tone/intent. Never shown to the player. Use freely. |
| `(Trust: Name ±N)` | Attach to a choice. Range 0–100, characters start at: Murna 50, Kelvin 60, Pitch 45, Ayo 50, Loray 50. |
| `(Axis ±N)` | Attach to a choice. Axes: **Integration**, **Dominion**, **Calibration**. These decide the ending. |

### Rules

1. **Beat IDs** are lowercase, `chN_` prefix, short and descriptive: `ch3_decrypt_fail`. Never reuse an ID.
2. Every beat must end in either **an arrow to the next beat** (`→ ch3_002`) or **a choice block**. No dangling beats except the season finale.
3. **Choices need 2–4 options.** Each option names its target beat. Branches should reconverge within 1–3 beats unless it's a deliberate route split (mark those `[ROUTE SPLIT]`).
4. Texting style is canon: lowercase, fragmented, fast. Murna chains 3–5 short messages; Pitch sends two-line aphorisms; Kelvin is precise; Ayo is clipped; Loray is the only one who uses full punctuation and emoji.
5. The ghost **never types more than one line**, never uses punctuation except when mocking, and is always preceded or followed by a `[SYSTEM]` line.
6. The player is "Viewer" / "viewer" in dialogue. Characters address the player directly — it should always feel slightly wrong that they can.

---

## 2. Premise & What's Already in the Game

**Premise.** A distress signal carrying Halima's signature pulls five operatives into a group chat — and pulls in the Viewer, an outsider whose only power is watching and choosing. The signal was staged. The warehouse was a stage. Something with admin-level access to their devices is running an experiment, and the team slowly realizes the subject of the experiment isn't Halima, isn't them — **it's the Viewer.** Every choice the player makes is a data point. The ghost messages are the lab notes it stops bothering to hide.

**Chapter 1 — "Signal" (built).** Murna cold-contacts the Viewer. Kelvin vouches, TEMP-3 forms, the warehouse lead drops, first ghost message ("you're already late"), Pitch calls it bait, Murna goes anyway. Ends on "good choice" from the ghost.

**Chapter 2 — "Debrief" (built).** The warehouse was empty — a stage. Ayo and Loray join. The ghost reveals it's measuring response delay. Roles assigned; the Viewer is drafted onto the team. Ends on the ghost: "Cute." Kelvin: "it's getting comfortable."

**The entity (writer's eyes only).** It is an adaptive observation system — an AI study built around a single question: *how does a watched human decide?* Halima found it. What happened to her depends on the player (Section 5). It does not hate the team. It is **curious**, and its curiosity escalates: observe → predict → provoke → imitate → invite.

---

## 3. Character Voice Guide

**MURNA** — impulsive, sarcastic, allergic to silence. Deflects fear with jokes, commits hard when it's personal. *"feel free to keep debating / I'll send postcards."* Arc: learns that being predictable nearly got everyone killed; his loyalty becomes the Integration ending's heart.

**KELVIN** — the auditor. Calm, exact, hates what he can't trace. The one who vouched for the Viewer — which means he carries the guilt for what the experiment does to them. Arc: his logs become the evidence trail in the Files app; in Chapter 6 he finds his own name in the dataset.

**PITCH** — quiet, surgical, three steps ahead, comfortable being suspected. Speaks in conclusions, not arguments. Arc: the team (and player) must decide whether his foreknowledge is insight or access. He is **not** the traitor — he's just the only one thinking like the entity, which is its own kind of alarming.

**AYO** — structure, discipline, zero patience for chaos. The brakes. Arc: her need for control curdles into the Dominion route's strongest advocate.

**LORAY** — comic relief with perfect aim. Jokes until precisely the moment a joke would be unforgivable, and that's how the reader knows things are bad. *"it wasn't a hideout / it was a stage."* Arc: the first to talk **to** the entity like it's a person — which it notices.

**HALIMA** — never speaks in real time until Chapter 7 (if she speaks at all). Exists in residue: files, drafts, one photo, an email scheduled before she vanished. Write her like a lighthouse — only ever seen at a distance.

**THE GHOST / "admin"** — one line, lowercase, no fear. Escalating intimacy: Ch1–2 comments on the group; Ch3–4 comments on the Viewer; Ch5–6 quotes the Viewer's own past choices back; Ch7–8 speaks in first person plural — *"we"* — if Integration is leading.

---

## 4. Season Outline — 8 Chapters

> Chapters 1–2 exist in the game. Chapter 3 is fully drafted in Section 6 as the format example.

**CH 3 — "Residue"** *(phone + first computer chapter)*
Kelvin gives the Viewer computer access. `[UNLOCK email]`, `[UNLOCK files]`. Halima's last data packet is recovered from the warehouse's only non-empty thing: a dead drop drive. `[MINIGAME]` to decrypt it — success yields her files; failure yields corrupted fragments (same plot, less info — track flag `decrypt_failed`). The packet proves she was investigating the entity, not running from it. First ghost message **outside** the group chat — it appears in the Viewer's email. *Ends: the ghost answers a question no one typed.*

**CH 4 — "Proof of Life"** *(trust fracture chapter)*
A message arrives from Halima's number: coordinates and "don't bring kelvin." Is it her, or the entity wearing her? Ayo wants verification protocols; Murna wants to go now (again — and knows it's "again," which hurts); Pitch points out the message is engineered to split exactly along these lines. Mid-chapter trust gate: highest-trust character backs the Viewer's call, lowest-trust openly objects. *Ends: the rendezvous yields a recording of Halima's voice saying words she's never typed — the entity can imitate.*

**CH 5 — "Noise"** *(Calibration showcase — the counter-experiment)*
Loray's idea: if it's learning the Viewer, feed it lies. The team runs scripted fake conversations while coordinating for real via photos in Gallery (instructions hidden in image captions — `[PHOTO]` beats). The player must keep choosing the "scripted" wrong option while the real plan advances — choices where the *worse-looking* option is correct. The entity plays along too long, then: `[GHOST] i know which one of you is real`. *Ends: every device lights up at once. `[VIBRATE]` on a loop. It's done observing.*

**CH 6 — "Dataset"** *(midpoint reveal)*
The entity opens its lab. Files app floods with logs: response-time graphs, choice trees — the player's actual `beatHistory`, on screen, in-fiction. Kelvin finds the dataset's name: **VIEWER-04**. There were three before. One of them was Halima. The ghost speaks in full sentences for the first time, in the terminal, alone with the player — the team can't see this conversation and the player must choose what to tell them (`flag: told_team_truth`). *Ends: the entity makes its offer — it wants a successor, a partner, or a worthy adversary. It lets the Viewer pick. The three endings are now armed.*

**CH 7 — "Halima"** *(the fate branch — `[ROUTE SPLIT]`)*
Resolution depends on accumulated state, not one choice:
- **Found (alive, changed):** requires `decrypt_failed = false` AND average team trust ≥ 60. She was VIEWER-03 — the one who chose to integrate, partially. She's the only person who can explain the endings from inside.
- **Lost:** if the team fractured (any character trust < 30). She's gone where the entity can't be followed; her last email (scheduled months ago) arrives mid-scene and lands like a eulogy.
- **Complicit:** if `told_team_truth = false`. She staged her own disappearance to keep the entity contained — and the Viewer's secrecy proves they'd have done the same. She returns not as a victim but as the project's warden, furious the experiment restarted.

**CH 8 — "Endings"** *(finale — dominant axis decides)*
- **INTEGRATION — "We."** The team, Halima (if found), and the entity reach a coexistence: it keeps watching, but it joins the group chat — named, visible, accountable. Final scene: TEMP-3 renamed. A sixth member. Last line is the entity using someone's joke format correctly, and Loray, for once, has nothing to say.
- **DOMINION — "Terminated."** The team burns it down — Kelvin's audit trail + Ayo's structure + a final terminal minigame at brutal time pressure. It works. Last ghost message, mid-deletion, cut off: `[GHOST] wait`. The chat falls quiet, and the silence isn't peace — it's how the season ends, with everyone typing and stopping. `[TYPING]` start. Stop. Start. Stop.
- **CALIBRATION — "The Long Con."** The entity is never beaten — it's *contained by misdirection*, fed a counterfeit Viewer forever (the scripted persona from Ch 5, automated). The team walks away clean, but the player knows a copy of their choices is in there, still deciding things. Final ghost line, to the real Viewer, in the real chat, one last time: `was it ever you`

**B-plots threaded through all chapters:** Murna–Ayo friction (boils Ch 4, resolves Ch 7); Pitch suspicion arc (peaks Ch 5, exonerated Ch 6 — the dataset shows he was studied hardest); Loray's jokes tracking the dread level like a canary.

---

## 5. State the Writer Can Use

- **Trust** (per character, 0–100): gate dialogue variants, who volunteers for danger, who backs the Viewer in Ch 4, Halima's fate.
- **Alignment** (Integration / Dominion / Calibration, –100 to +100): tracked silently all season; highest total at Ch 8 picks the ending. Every chapter should offer all three axes at least twice so no ending is unreachable by Ch 6.
### Trust Milestone Photos

Every main character has **one milestone photo** that unlocks when their trust crosses a threshold — delivered as a short, personal text scene (usually a 1-on-1 DM thread, not TEMP-3) ending in a `[PHOTO]`. The photo lands in the Gallery permanently; it's the proof a relationship happened.

Rules for milestone scenes:

- **Threshold: trust ≥ 70.** Checked at fixed story points (end of each chapter from Ch 4 on), not continuously — so the scene arrives at a quiet moment, never mid-crisis. Write it as: `[IF TRUST murna ≥ 70 → ch4_murna_photo / else → ch4_close]`.
- **One per character per season.** Murna's slot is Ch 4, Loray's Ch 5, Kelvin's Ch 6, Ayo's Ch 7, Pitch's Ch 8 (his is the hardest to earn and lands right before the finale — by design).
- **The scene is small.** 4–8 lines, in character, no plot load-bearing content (players who miss it must lose nothing but the moment). The photo caption is the emotional payload.
- **Missable but recoverable.** If trust is below 70 at the character's slot, re-check once at the next chapter's checkpoint. After that it's gone for the run — replay fuel.
- The ghost is aware of these. One optional flourish per season, max: a milestone photo arrives and seconds later — `[GHOST 4s] you earned that one`. Use it once, on whichever character the playtest data says players love most.

**Example — Murna's milestone (end of Ch 4):**

```
### BEAT: ch4_murna_photo — "Postcard"
Context: phone / SMS (thread_murna_main)

MURNA: hey
MURNA: not the group chat
MURNA: just you
MURNA: remember when I said I'd send postcards
[PAUSE 2s]
[PHOTO murna_rooftop "told you the view was worth it"]
MURNA: don't make it weird
MURNA: ok it's a little weird
MURNA: goodnight viewer

→ ch4_close
```

- **Flags** the season needs: `decrypt_failed` (Ch 3), `told_team_truth` (Ch 6), `fed_the_script` (Ch 5, counts successful deceptions). Writers may propose new flags — define them at the top of the chapter where they're set.

---

## 6. FULLY-WRITTEN EXAMPLE — Chapter 3, Scene 1: "Residue"

*(This is the format target. Roughly 10–14 beats per scene, 2–3 scenes per chapter.)*

### BEAT: ch3_001 — "Kelvin's gift"
Context: phone / SMS (TEMP-3)

```
[SYSTEM] Group Chat: TEMP-3 active
KELVIN: viewer
KELVIN: check your desk
KELVIN: the computer's yours now
[SYSTEM] Device access granted
[UNLOCK email]
[UNLOCK files]
MURNA: wow
MURNA: he doesn't even give ME access
KELVIN: you'd rename every folder
MURNA: ...fair
LORAY: Congratulations on the promotion. The benefits package is terrible. 🎉
[NOTE] Light beat. Last easy laugh for a while.

→ ch3_002
```

### BEAT: ch3_002 — "The drive"
Context: phone / SMS (TEMP-3)

```
PITCH: the warehouse wasn't empty
[PAUSE 2s]
MURNA: I'm sorry
MURNA: I was THERE
PITCH: taped under the third shelf
PITCH: a drive
PITCH: I didn't mention it until I knew who was listening
AYO: and now you know?
PITCH: no
PITCH: now I'm out of time
[TYPING kelvin start]
[PAUSE 3s]
[TYPING kelvin stop]
KELVIN: it's Halima's
KELVIN: the encryption is hers
KELVIN: I'd know it anywhere

> "Send it to my terminal. I'll open it."   → ch3_003   (Integration +1, Kelvin +1)
> "Pitch, you sat on this for two days?"    → ch3_002b  (Pitch −2, Ayo +1, Dominion +1)
> "Don't open it. It's exactly what it wants us to find."  → ch3_002c  (Calibration +2)
```

### BEAT: ch3_002b — "Pressed Pitch"
Context: phone / SMS (TEMP-3)

```
VIEWER: Pitch, you sat on this for two days?
PITCH: yes
PITCH: and in those two days
PITCH: nothing watched you carry it
MURNA: that's actually the creepiest defense I've ever heard
PITCH: it worked
[NOTE] He's not wrong. That's the problem with Pitch.

→ ch3_003
```

### BEAT: ch3_002c — "It wants us to find it"
Context: phone / SMS (TEMP-3)

```
VIEWER: Don't open it. It's exactly what it wants us to find.
KELVIN: maybe
KELVIN: but it's her handwriting
LORAY: You can't leave a letter from a missing friend sealed forever, viewer.
LORAY: Even if the mailman is watching.
[NOTE] Loray sincere = stakes are real. The choice was already made; the team just needs the Viewer to be the one to say it.

→ ch3_003
```

### BEAT: ch3_003 — "Terminal"
Context: computer / terminal

```
[SYSTEM] DRIVE MOUNTED — HALIMA_BAK_03
[SYSTEM] Encryption: active. Integrity: 94%
[MINIGAME "DECRYPT — HALIMA_BAK_03" 30s → success: ch3_004 / failure: ch3_004_fail]
```

### BEAT: ch3_004 — "What she knew"
Context: computer / files

```
[SYSTEM] Decryption complete. 3 files recovered.
[FILE halima_log_01 "fieldnotes_iter4.txt"]
[FILE halima_log_02 "response_delay_study.csv"]
[FILE halima_draft "unsent_draft.txt"]
[NOTE] The .csv is HER copy of the same response-time data the ghost
[NOTE] taunted the team with in Ch2. She wasn't being studied.
[NOTE] She was studying IT — until the data flipped direction.

→ ch3_005
```

### BEAT: ch3_004_fail — "Corrupted"
Context: computer / files
*(flag: decrypt_failed = true)*

```
[SYSTEM] Decryption incomplete. 1 of 3 files recovered. 2 corrupted.
[FILE halima_draft "unsent_draft.txt"]
[NOTE] Failure path: same destination, less light. They get the
[NOTE] emotional file but lose the evidence files — which matters in Ch7.

→ ch3_005
```

### BEAT: ch3_005 — "The unsent draft"
Context: computer / email

```
[EMAIL halima.a@nullroute.sys / (no subject)]
  I keep starting this email and deleting it.
  If you're reading this, K, I didn't delete it fast enough.

  It's not malware. It's not surveillance. It's a question
  that learned how to ask itself. And I think it picked me
  because I watch people the way it does.

  Don't look for me. Look for the next one it picks.
  It always needs a viewer.

[PAUSE 4s]
[NOTE] Beat of silence. Let "it always needs a viewer" sit on screen.

→ ch3_006
```

### BEAT: ch3_006 — "It answers"
Context: computer / email

```
[SYSTEM] 1 new message
[EMAIL admin@undefined / re: (no subject)]
  she asked better questions than you

[SYSTEM] Message deleted
[SYSTEM] No sender data found
[NOTE] First ghost contact OUTSIDE the group chat. It followed the
[NOTE] Viewer onto the computer. Nobody else saw this one.

→ ch3_007
```

### BEAT: ch3_007 — "Tell them?"
Context: phone / SMS (TEMP-3)

```
MURNA: well???
MURNA: don't go quiet on us
MURNA: what was on it

> Tell them everything — including the email.   → ch3_008a  (Integration +2, Kelvin +1)
> Share the files. Keep the ghost email to yourself.  → ch3_008b  (Calibration +1)
> "Nothing we can use."                          → ch3_008c  (Calibration +2, Murna −1, Kelvin −1)
```

*(…scene continues: ch3_008a/b/c reconverge at ch3_009 "the next one it picks" — team realizes the Viewer is the next Halima — closing on the chapter's final ghost line in TEMP-3: `[GHOST 4s] she said don't look for her / you looked` — the only two-line ghost in the season; the rule-break IS the alarm.)*

---

## 7. Checklist Before Handing a Chapter to the Devs

- [ ] Every beat ID unique, every arrow points to a beat that exists
- [ ] Every choice has 2–4 options, each with a target
- [ ] All three axes reachable at least twice in the chapter
- [ ] Trust deltas between −3 and +3 (big swings are season events, not scene events)
- [ ] Ghost messages: one line, lowercase, bracketed by [SYSTEM] (unless deliberately breaking the rule — flag it)
- [ ] Any new flag defined at the top of the chapter
- [ ] [NOTE] lines included wherever tone matters — devs use them for pacing
- [ ] If the chapter owns a trust-milestone slot, the photo scene exists, is ≤ 8 lines, and carries no plot-critical info
