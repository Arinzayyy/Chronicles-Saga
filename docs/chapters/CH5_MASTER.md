# CHAPTER 5 — "What She Left Behind" (MASTER — conversion source)

Source: Benjamin's Ch 5. Edits applied:
- [EDIT-G] `perimeter_partner` divergence (#1): escort choice now actually assigns who goes with Vi — pays off across all of Ch 6
- [EDIT-H] Fragment recovery routed through a terminal decrypt minigame; success/failure = two cuts of Halima's voice memo (divergence #5, flag `recovery_quality`)
- [EDIT-I] Loray trust-milestone photo at chapter end (trust ≥ 70; also re-check slot for a missed Murna milestone)
- [EDIT-J] Vi intro acknowledges the player's Ch 4 vouch if they chose "we need Vi"
- [EDIT-C] Narration dosage applied

---

### BEAT: ch5_open — "We wait smart"
Context: phone / sms (thread_group)

```
[SYSTEM] Group Chat: Active
[SYSTEM] Members: You, Kelvin, Murna, Pitch, Ayo, Loray
[NARRATE] Morning. The dead zone is still forty kilometres northeast and nobody has slept well.
KELVIN: still running traces on the dead zone edges
KELVIN: it's like trying to read through frosted glass
MURNA: so we wait
KELVIN: we wait smart
KELVIN: there's a difference
LORAY: I've been thinking about the villages
LORAY: the sequence Ayo described
LORAY: one then the next then the next
LORAY: that's not random spread
LORAY: that's a direction
PITCH: northeast
LORAY: northeast
[NARRATE] Everything keeps pointing back to the same place.
KELVIN: adding someone
KELVIN: reached him this morning
KELVIN: he's useful for what we're dealing with
[IF beat ch4_zone_c]
KELVIN: viewer called it first anyway    [EDIT-J]
[ENDIF]
MURNA: how big is this group getting
KELVIN: as big as it needs to be
[SYSTEM] Vi added to the conversation
[JOIN thread_group: vi]
VI: morning
VI: what do we have
MURNA: hold on
MURNA: Vi?
MURNA: the blind Vi?
VI: the only Vi yes
MURNA: how are you texting right now
VI: ...
LORAY: 😭
VI: it's the 21st century Murna
MURNA: right
MURNA: right okay
MURNA: carry on
[SYSTEM] Trust Meter Updated
[SYSTEM] • Vi: 0 (Neutral — not yet established)
KELVIN: four villages. coordinated disappearances. no bodies. aura masking. scrubbed dead zone forty kilometres northeast. Halima walked into the middle of it.
VI: the aura masking
VI: describe it
AYO: shifting signature
AYO: every time we tried to lock it down it changed
VI: not shifting
VI: layered
AYO: what's the difference
VI: shifting is unstable
VI: layered is deliberate
VI: someone built it
KELVIN: can you read through it
VI: depends how close I can get
PITCH: noted

> "Vi. the dead zone. could something layer interference across a forty kilometre radius"  → ch5_vi_a   (Trust: Vi +1, Kelvin +1) (Calibration +2)
> "how long would something like that take to build"   → ch5_vi_b   (Trust: Vi +1, Loray +1) (Integration +1) (Calibration +1)
> "good to have you in Vi"                              → ch5_vi_c   (Trust: Vi +1, Loray +1)
```

### BEAT: ch5_vi_a
Context: phone / sms (thread_group)

```
VIEWER: Vi. the dead zone. could something layer interference across a forty kilometre radius
VI: not one something
VI: several
VI: working from fixed points
KELVIN: anchor points
VI: yeah
KELVIN: viewer that lines up with the frequency pattern from Halima's phone

→ ch5_implication
```

### BEAT: ch5_vi_b
Context: phone / sms (thread_group)

```
VIEWER: how long would something like that take to build
VI: weeks minimum
VI: you'd have to let it stabilise gradually
VI: anything faster would spike
LORAY: so this was running before the villages went quiet
VI: comfortably before

→ ch5_implication
```

### BEAT: ch5_vi_c
Context: phone / sms (thread_group)

```
VIEWER: good to have you in Vi
VI: likewise viewer
VI: Halima spoke highly of you
[PAUSE 1s]
VI: I'll reserve judgement
LORAY: that's the nicest thing he's said to a new person
VI: Loray I will find you
LORAY: 😇

→ ch5_implication
```

### BEAT: ch5_implication — "While we were occupied"
Context: phone / sms (thread_group)

```
MURNA: so whatever is in that dead zone has been building for weeks
MURNA: while we had no idea
AYO: while we were on other missions
PITCH: or occupied
[NARRATE] That implication sits.
KELVIN: I'm not confirming that until I have something concrete
KELVIN: but I'm not not looking into it
[PAUSE 2s]
[NARRATE] Then Halima's phone does something unexpected.
[SYSTEM] Fragment recovered — Halima's phone
[SYSTEM] Partial data. Corruption: 34%
[SYSTEM] Recovering...
KELVIN: viewer
KELVIN: something just cleared
KELVIN: fair warning — some of it is gone for good
KELVIN: I'm routing the reconstruction through your machine    [EDIT-H]
KELVIN: your sight reads the gaps better than my filters do
KELVIN: don't overthink it. work fast

→ ch5_decrypt
```

### BEAT: ch5_decrypt — "Reconstruction"   [EDIT-H]
Context: computer / terminal

```
[SYSTEM] FRAGMENT RECONSTRUCTION — HALIMA_PHONE
[MINIGAME "RECONSTRUCT — VOICE MEMO" 30s → success: ch5_fragment_full / failure: ch5_fragment_partial]
```

### BEAT: ch5_fragment_full — "Two days before she went dark"   (flag: recovery_quality high)
Context: phone / sms (thread_group)

```
[SYSTEM] FRAGMENT — Halima's phone. Voice memo. Timestamp: two days before she went dark
[NARRATE] Her voice. Quiet. Like she was recording somewhere she didn't want to be heard.
HALIMA (audio): ...can't identify the class. the aura reads wrong in a way I don't have language for. like it's wearing something that doesn't fit. I've been tracking the same signature for four days and every time I get close it just...
[SYSTEM] corruption — 6 seconds lost
HALIMA (audio): ...not hunting. I keep coming back to that. whatever this is — it's not hunting. the people aren't prey. they're...
[SYSTEM] corruption — 11 seconds lost
HALIMA (audio): ...if I'm right about the location then the bounty wasn't posted to find the creature. it was posted to find someone who could see past the interference. which means whoever posted it knows about sight-based abilities. which means they know about...
[SYSTEM] corruption — audio terminates
[NARRATE] Silence in the group chat. Long enough that it feels like everyone is listening to something that isn't there anymore.
MURNA: she already knew something was off before she went in
AYO: she went anyway
MURNA: yeah

→ ch5_react
```

### BEAT: ch5_fragment_partial — "Most of it is gone"   (flag: recovery_quality low)
Context: phone / sms (thread_group)

```
[SYSTEM] FRAGMENT — Halima's phone. Voice memo. Heavy corruption. Partial recovery only
[NARRATE] Her voice surfaces out of static — certain, fast, like she'd already decided something.
HALIMA (audio): ...wearing something that doesn't fit. four days on the same signature and every time I get close—
[SYSTEM] corruption — 19 seconds lost
HALIMA (audio): ...the bounty wasn't posted to find the creature. it was posted to find someone who could see past the interference. which means—
[SYSTEM] corruption — audio terminates
[NARRATE] That's all of it. The middle is gone for good — whatever she understood about the missing people went with it.
KELVIN: that's everything that survived
KELVIN: don't ask me for the rest. there is no rest
MURNA: she already knew something was off before she went in
AYO: she went anyway
MURNA: yeah

→ ch5_react
```

### BEAT: ch5_react — "Not prey"
Context: phone / sms (thread_group)

```
> "the bounty was posted for me. not for Halima."   → ch5_react_a   (Trust: Murna +1, Kelvin +1) (Calibration +2)
> "she said they're not prey. whatever is happening to those people — it isn't what we think"  → ch5_react_b   (Trust: Vi +1, Pitch +1) (Integration +2)
> "whoever posted that bounty knows about my sight. they've known this whole time."  → ch5_react_c   (Trust: Vi +1, Pitch +1, Kelvin +1) (Calibration +3)
```

### BEAT: ch5_react_a
Context: phone / sms (thread_group)

```
VIEWER: the bounty was posted for me. not for Halima.
KELVIN: elaborate
VIEWER: Halima said the bounty was to find someone who could see past the interference. she took the job and contacted me. whoever posted it knew she would. they were using her to get to me.
MURNA: ...
MURNA: so she went in there to protect you
[NARRATE] That lands like a stone.
AYO: Murna
MURNA: I'm fine

→ ch5_perimeter
```

### BEAT: ch5_react_b
Context: phone / sms (thread_group)

```
VIEWER: she said they're not prey. whatever is happening to those people — it isn't what we think
VI: she's right
VI: it's not predation
VI: it's collection
LORAY: collection for what
VI: depends who's buying
PITCH: the Enigmatic one
[PAUSE 2s]
KELVIN: I was hoping we weren't going to say that name yet

→ ch5_perimeter
```

### BEAT: ch5_react_c
Context: phone / sms (thread_group)

```
VIEWER: whoever posted that bounty knows about my sight. they've known this whole time.
KELVIN: which means every move we've made
KELVIN: they've been accounting for you specifically
VI: not just accounting
VI: planning around
LORAY: so the viewer is the variable they've been trying to control
PITCH: or acquire
[NARRATE] Nobody responds to that immediately.

→ ch5_perimeter
```

### BEAT: ch5_perimeter — "Eyes on the edges"   [EDIT-G: divergence #1 set here]
Context: phone / sms (thread_group)

```
KELVIN: okay
KELVIN: pulling the frequency pattern, the village locations, Vi's anchor point read
KELVIN: I need eyes on the dead zone perimeter
KELVIN: not inside
KELVIN: just the edges
KELVIN: if there are anchor points something physical should be marking them
VI: I'll go
MURNA: you sure
VI: Murna
MURNA: right. apps. got it.
VI: ...yeah

> "Vi take Ayo with you. don't go alone"    → ch5_escort_ayo    (flag: perimeter_partner ayo) (Trust: Ayo +1, Vi +1) (Integration +1)
> "Loray go with Vi"                        → ch5_escort_loray  (flag: perimeter_partner loray) (Trust: Vi +1, Loray +2) (Integration +1)
> "Vi works better alone. let him."         → ch5_escort_solo   (flag: perimeter_partner solo) (Trust: Vi +2) (Dominion +1)
> "Vi what are you looking for at the perimeter"  → ch5_escort_ask   (flag: perimeter_partner ayo) (Trust: Vi +1, Kelvin +1) (Calibration +2)
```

### BEAT: ch5_escort_ayo
Context: phone / sms (thread_group)

```
VIEWER: Vi take Ayo with you. don't go alone
AYO: already planning on it
VI: I don't need a babysitter
AYO: good
AYO: because I'm not one
VI: ...fair enough
AYO: Vi and I move at dusk
AYO: we go quiet

→ ch5_directions
```

### BEAT: ch5_escort_loray
Context: phone / sms (thread_group)

```
VIEWER: Loray go with Vi
VI: ...
[PAUSE 1s]
VI: tactically that makes sense
LORAY: Vi
VI: yes
LORAY: you can just say yes
VI: yes
MURNA: 😭
LORAY: dusk road trip with the blind guy. what could possibly go wrong 😈
VI: I can hear your emoji choices Loray

→ ch5_directions
```

### BEAT: ch5_escort_solo
Context: phone / sms (thread_group)

```
VIEWER: Vi works better alone. let him.
VI: ...thank you
AYO: viewer
AYO: nobody walks a dead zone edge alone
VIEWER: he reads better without noise around him. you said it yourself — we go quiet. nobody's quieter than one person.
AYO: ...
AYO: logged. and objected to.
VI: I move at dusk
VI: alone
[NARRATE] Nobody argues further. Somebody should have.

→ ch5_directions
```

### BEAT: ch5_escort_ask
Context: phone / sms (thread_group)

```
VIEWER: Vi what are you looking for at the perimeter
VI: anchor points have a physical presence
VI: modified terrain usually
VI: sometimes worse
KELVIN: worse how
VI: living hosts
KELVIN: ...
VI: I'll know it when I read it
AYO: Vi and I move at dusk
AYO: we go quiet

→ ch5_directions
```

### BEAT: ch5_directions — "Everyone has a direction"
Context: phone / sms (thread_group)

```
KELVIN: I'll keep working the frequency
KELVIN: viewer if anything else clears from Halima's phone I'll push it straight to you
MURNA: I'll rerun the village route
MURNA: see if we missed anything
PITCH: good
[NARRATE] Everyone has a direction. The dead zone is still forty kilometres northeast. But it feels closer than it did this morning.
LORAY: viewer
LORAY: that part where she said the people aren't prey
[PAUSE 1s]
LORAY: she sounded scared didn't she

> "yes. but she kept recording anyway"                                    → ch5_loray_a   (Trust: Loray +1) (Integration +1)
> "she sounded like someone who already knew what she was going to do about it"  → ch5_loray_b   (Trust: Loray +1, Murna +1) (Integration +1)
> "scared and certain at the same time"                                   → ch5_loray_c   (Trust: Loray +2) (Calibration +1)
```

### BEAT: ch5_loray_a
Context: phone / sms (thread_group)

```
VIEWER: yes. but she kept recording anyway
LORAY: yeah
LORAY: that sounds like her

→ ch5_close
```

### BEAT: ch5_loray_b
Context: phone / sms (thread_group)

```
VIEWER: she sounded like someone who already knew what she was going to do about it
LORAY: ...yeah
LORAY: that also sounds like her
MURNA: can we not talk about her in past tense
LORAY: sorry
LORAY: you're right

→ ch5_close
```

### BEAT: ch5_loray_c
Context: phone / sms (thread_group)

```
VIEWER: scared and certain at the same time
LORAY: yeah
LORAY: that's Halima

→ ch5_close
```

### BEAT: ch5_close — "You listen carefully"
Context: phone / sms (thread_group)

```
[NARRATE] The chat goes quiet as everyone starts moving. Halima's voice still somewhere in your head.
[NARRATE] "...the people aren't prey. they're..."
[IF flag recovery_quality high]
[NARRATE] Eleven seconds of corruption where the answer should be. You'll find it.
[ELSE]
[NARRATE] Nineteen seconds of corruption where the answer should be. More of her gone because you weren't fast enough. You'll find it anyway.
[ENDIF]
[SYSTEM] Unknown notification
[NARRATE] No sender. No preview.
[IF pattern silent]
[GHOST 4s] you listen the way she did
[ELSE]
[GHOST 4s] you listen carefully
[ENDIF]
[NARRATE] Gone.

→ ch5_milestone_check
```

### BEAT: ch5_milestone_check   [EDIT-I: Loray milestone + Murna re-check]
Context: phone / sms (thread_group)

```
[IF TRUST loray ≥ 70 → ch5_loray_photo / else → ch5_murna_recheck]
```

### BEAT: ch5_loray_photo — "Receipts"   [EDIT-I]
Context: phone / sms (thread_loray)

```
[SYSTEM] Private Message — Loray
LORAY: viewer. before tonight gets heavy
LORAY: evidence that we used to be normal people
[PHOTO loray_milestone "village run, three weeks ago. Ayo said no pictures. I respect Ayo deeply."]
LORAY: she's going to kill me for sending that
LORAY: worth it

→ ch5_end
```

### BEAT: ch5_murna_recheck
Context: phone / sms (thread_group)

```
[IF TRUST murna ≥ 70 AND NOT beat ch4_murna_photo → ch4_murna_photo / else → ch5_end]
```

### BEAT: ch5_end
Context: phone / sms (thread_group)

```
[SYSTEM] Chapter 5 Complete — "What She Left Behind"
[SYSTEM] Alignment Updated
[SYSTEM] Trust Updated
[SYSTEM] Vi: Active
[SYSTEM] Dead Zone Investigation: In Progress
[IF flag recovery_quality high]
[SYSTEM] Halima's Phone: 61% recovered
[ELSE]
[SYSTEM] Halima's Phone: 44% recovered
[ENDIF]

→ ch6_entry   [STUB — is_ending until Ch6 converts]
```

---

## Conversion notes
- `perimeter_partner` (ayo/loray/solo) drives the entire Ch 6 field sequence. The "ask" option defaults to Ayo (Benjamin's original outcome).
- The solo option is deliberately the riskiest-feeling pick; ch5_escort_solo's "Somebody should have." narration is the warning shot.
- recovery_quality low cut keeps the *plot-critical* line (bounty/sight) and loses the *emotional* one (not prey) — failure costs feeling, not progress, per divergence rules. It also feeds Ch 7's Halima-fate logic later.
- Murna milestone re-check here implements the "missable but recoverable once" rule.
