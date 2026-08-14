# MINIGAME PROPOSAL — Chapters 1–4, 6, 7

*From Arinze & dev team. Proposal only — nothing implemented. Rule inherited from the Ch 5 decrypt (the season's only existing minigame): failure never blocks the plot. It degrades quality, costs a trust point, or swaps a few lines. Ben's dialogue is never touched — every insertion below sits in a seam where the script currently says "give me a minute" or narrates work happening off-screen.*

*One design law governs all of these: minigames live where the VIEWER acts — their machine, their sight, their screen. Never where a teammate acts. That's the POV line Ben's writing keeps all season, and it's why some chapters below get a "skip."*

**Delivery surface (decided): all minigames play on the in-game DESKTOP, never the phone.** The phone is for reading and choosing; the computer is where the Viewer *works*. Every minigame is a context switch to the desk — which the engine already does for the Ch 5 decrypt (trigger_minigame → Terminal). Fiction-wise this is free: Kelvin has been pushing work to the Viewer's machine since Ch 2. Practically it means each minigame is a computer-side view sharing one host surface, and they all become siblings of the Ch 12 PC interface when that gets built — same screen family, built once.

---

## Chapter 1 — "You Did Screw Up" — SKIP

The hook chapter. Phone only, no computer, no tools, and the dread depends on the player being helpless — they wake up too late and can only read what Halima left. Any gameplay here teaches the wrong lesson (that this is a game you can win) before the story teaches the right one (you watch, you choose, you live with it). The interactive moment Ch 1 already has — texting the dead thread — is doing more work than any minigame could.

**Verdict: keep clean. The season should teach choices first, minigames only after tools unlock.**

---

## Chapter 2 — "No Aura Trail" — FREQUENCY TRACE (recommended)

**The seam:** `ch2_fragment`. Kelvin clears a fragment from Halima's phone: "it's not a signal, more like the shape where one used to be." This chapter is where the computer becomes real (Files unlocks here, the case file lands on the Viewer's machine). Currently the frequency work is Kelvin narrating results.

**The game:** the existing terminal grid, reskinned. Kelvin routes the corrupted signal through the Viewer's machine; the player finds the cells where the signal *used to be* — reading absence, which is literally the Viewer's power.

**Success:** cleaner location fix. Kelvin: one extra line of respect. Sets `frequency_read: high`.
**Failure:** Kelvin brute-forces it — same location, an hour "later," one dry Kelvin line. No plot change.

**Why here:** Ch 5's reconstruction minigame quotes this exact fiction ("your sight reads the gaps better than my filters do"). Planting the mechanic in Ch 2 turns Ch 5 into a *returning* mechanic instead of a one-off — and `frequency_read` can feed `recovery_quality` so the two minigames talk to each other.

**Build cost: near zero — reuses Terminal.jsx as-is.**

---

## Chapter 3 — "It's Getting Comfortable" — LIVE PATTERN READ (recommended)

**The seam:** the ambush — the fight where the team realizes "someone was directing from the back." The Viewer's role in this chapter is watching the fight's *shape* while the team is inside it. Note: the writer's toolbox document used `ch3_decrypt_fail` as its example beat ID — a Ch 3 minigame was sketched from day one and never built.

**The game:** a timed read, played on the desktop. Kelvin mirrors the team's comms to the Viewer's machine mid-fight ("I want clean logs" is already his instinct) — the formation tells stream across the screen and the player has a short window to call the tell ("they're rotating left / the rear is thin / they're herding you") before the window closes. First time the game asks the player to be *fast*, which is exactly what this chapter is about: the enemy is modeling reaction speed. The mid-fight cut from phone to desk is itself a beat — the moment the Viewer stops spectating and starts operating.

**Success:** the Viewer's call lands, the team pushes the rear, trust +1 with whoever acted on it. The existing "I saw hesitation from whoever was directing them" choice becomes earned.
**Failure (timeout):** someone takes a graze; one line of cost; the Admin's model gets a free data point — a later ghost line variant ("you decide before you understand" already exists in the pattern system) lands harder.

**Build cost: medium — needs a countdown on the choice UI. No new screen.**

---

## Chapter 4 — "Before We Knew" — SKIP

Ben's own framing: "A quiet chapter. No feeds. No footage. Just conversation." Its interactivity is already correct — the unredacted village reports land in the Files app (`ch4_collection`) and the reading feeds the chapter's big choice ("they're inventory"). A timer anywhere in this chapter would break it.

**Verdict: protected, same status as Ch 11. If anything, deepen the Files reading — no game.**

---

## Chapter 6 — "Pattern Recognition" — MARKER WATCH (recommended — best of the six)

**The seam:** the stone markers. Vi: "the formation is changing every time I rest my reading… there's no one here to watch them for me." That line is an open request in the fiction that nobody answers. The Viewer can answer it.

**The game:** a watch-and-spot game on the desktop — a map view on the Viewer's machine. The player plots the marker positions from Loray's descriptions. The screen forces a look-away (a phone notification pulls focus — the game's whole language of attention, and the desk/phone split makes the look-away *physical*). Then: which ones moved? The player marks the changed positions from memory.

**Success:** the Viewer catches the drift vector — and it points *inward*. This quietly pre-loads the Ch 7 funnel reveal, so when Vi says "it pulls," the player who did the work already felt it. Vi +1, Loray +1.
**Failure:** the plot is wrong; in Ch 7 Kelvin corrects the Viewer's map with one line. A humility beat, not a punishment — and thematically perfect, because the zone *wants* to be misread.

**Why it's the best:** it fills an actual hole in the scene (someone must watch while Vi rests), it's built from the chapter's own horror (things move when you don't look), and its success state makes the season's biggest reveal land as confirmation instead of exposition.

**Build cost: medium-high — new small UI (map + mark), no engine changes beyond the existing minigame trigger pattern.**

---

## Chapter 7 — "Fault Lines" — VERIFY (recommended)

**The seam:** the double-Kelvin attack. "New rule: nobody trusts text alone anymore." Currently the fake is resolved by Murna's drone question — the *team* authenticates. The player just watches.

**The game:** when the second "Kelvin" message lands, the desktop opens an authentication console — fiction says Kelvin built it ("nobody trusts text alone anymore" — of course he shipped the team a tool). The two messages present side by side with the chapter's own evidence: response timing, phrasing tells (Kelvin's precision, his refusal to use ellipses), routing metadata. Pick the fake.

**Success:** the player flags it before Murna's drone check confirms — Kelvin +1, and the Admin's seeding attack lands weaker (the existing `scrutinize` pattern ghost line "you check everything twice. it didn't help her" becomes its retort — the system already has the ammunition).
**Failure:** a short window where the player trusted the fake; the Admin gets one ghost line of quiet satisfaction. Nothing else changes — the storm proceeds as written.

**Why here:** authentication is the chapter's entire theme, and this makes the player *do* the thing the team spends the chapter inventing rules for. It also sharpens the Ch 11 Doubt payoff: a player who's been verifying all season reads the Admin's predictions differently.

**Build cost: medium — a two-card compare UI; the tells already exist in Ben's dialogue style guide (Rule 4 of the beat format doc).**

---

## Recap — where this leaves the season

| Ch | Minigame | Status |
|----|----------|--------|
| 1 | — | skip (protected hook) |
| 2 | Frequency Trace | proposed — reuses terminal grid |
| 3 | Live Pattern Read | proposed — timed choice |
| 4 | — | skip (protected quiet chapter) |
| 5 | Voice Memo Reconstruct | **exists** |
| 6 | Marker Watch | proposed — best fit |
| 7 | Verify | proposed |
| 8 | Terminal Salvage | slotted (prior analysis) |
| 9 | Correspondence Sift + Relay Trace | slotted (prior analysis) |
| 10 | — | skip (Kelvin's arc) |
| 11 | — | skip (route lock) |
| 12 | Failsafe Assist (Root Access), Drone Work (Command Line) | slotted; Uniform stays gameless by design |

Rhythm check: with all proposals in, the season alternates — game, game, breathe, game, game, game, breathe, breathe — and every quiet chapter (1, 4, 11) is quiet on purpose. Uniform's gamelessness becomes a statement the player can feel, because every other route gives them their hands back.
