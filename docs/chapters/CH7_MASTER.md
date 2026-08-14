# CHAPTER 7 — "Fault Lines" (MASTER — conversion source)

Source: Benjamin's Ch 7 (Revised). Edits applied:
- [EDIT-O] `anchor_broken` payoff (#2): the names-anchor scene reads differently if the player broke one in Ch 6
- [EDIT-P] Trust gate played out loud: in the notification storm, [SLOT highest-trust] defends the viewer by name, [SLOT lowest-trust] hesitates (beef-up #3)
- [EDIT-Q] Ayo trust-milestone photo at chapter end (≥ 70)
- [EDIT-R] One narrator-twist seed: a single [NARRATE] line that knows too much (marked — do not add more this season)
- [EDIT-A] Admin variant on "I hope that helps"
- [EDIT-C] Narration dosage applied

New notation: `[SLOT highest-trust]` / `[SLOT lowest-trust]` — engine fills the speaker at runtime from current trust scores (excluding Vi if trust still below 20, so a brand-new member never outranks the core team).

---

### BEAT: ch7_open — "It's wearing one wrong"
Context: phone / sms (thread_group)

```
[SYSTEM] Group Chat: Active
[SYSTEM] Members: You, Kelvin, Murna, Pitch, Ayo, Loray, Vi
[NARRATE] 2:13 AM. Nobody should still be awake. Everyone is.
KELVIN: rebuilt part of the interference map
MURNA: normal thing to say at 2am
KELVIN: it lines up with the village sequence
LORAY: northeast progression
KELVIN: yeah
[PAUSE 2s]
VI: it's a Mayafi
[NARRATE] Nobody responds immediately.
MURNA: okay cool
MURNA: hate that already
AYO: no
AYO: that makes sense actually
VI: no
VI: listen carefully
[NARRATE] That tone changes the room.
VI: Mayafi repel
VI: they redirect movement
VI: blur intent
VI: make people leave before they realize they're leaving
PITCH: concealment logic
VI: yes
[PAUSE 2s]
VI: this one doesn't repel
[PAUSE 2s]
VI: it pulls
[NARRATE] Nobody types for several seconds.
MURNA: ...
MURNA: that's not how Mayafi works
VI: exactly
LORAY: then it isn't a Mayafi
VI: no
[PAUSE 1s]
VI: it's wearing one wrong
[NARRATE] That sentence sits heavily in the chat.

> "the villages were part of the pull"        → ch7_pull_a   (Trust: Kelvin +1, Vi +1) (Calibration +2)
> "someone inverted veil logic"               → ch7_pull_b   (Trust: Pitch +1, Kelvin +1) (Calibration +1) (Dominion +1)
> "Halima realized it before anyone else"     → ch7_pull_c   (Trust: Ayo +1, Loray +1) (Integration +2)
```

### BEAT: ch7_pull_a
Context: phone / sms (thread_group)

```
VIEWER: the villages were part of the pull
KELVIN: gradual attraction pattern
LORAY: increasing pressure toward the center
PITCH: controlled migration
MURNA: you're all saying terrifying things way too calmly

→ ch7_funnel
```

### BEAT: ch7_pull_b
Context: phone / sms (thread_group)

```
VIEWER: someone inverted veil logic
[PAUSE 2s]
VI: not someone inexperienced either
PITCH: this would've taken years of testing
KELVIN: or adaptive modeling
[NARRATE] Nobody says the Admin's name.

→ ch7_funnel
```

### BEAT: ch7_pull_c
Context: phone / sms (thread_group)

```
VIEWER: Halima realized it before anyone else
LORAY: which means she knew walking deeper was a choice
MURNA: yeah
MURNA: sounds like her unfortunately
AYO: she would've kept going if she thought people were inside

→ ch7_funnel
```

### BEAT: ch7_funnel — "Double Kelvins"
Context: phone / sms (thread_group)

```
KELVIN: the anchor points aren't masking the zone
[TYPING kelvin start]
[TYPING kelvin stop]
KELVIN: they're shaping directional pressure
PITCH: a funnel
VI: yes
LORAY: movement guidance through layered aura distortion
MURNA: english please
VI: the zone encourages certain decisions
PITCH: safest paths
PITCH: easiest routes
PITCH: instinctive movement
KELVIN: all leading inward
[NARRATE] That lands horribly.
AYO: toward what
[NARRATE] Nobody answers immediately.
[SYSTEM] SYSTEM INSTABILITY
[TYPING kelvin start]
[TYPING kelvin stop]
[TYPING kelvin start]
[TYPING kelvin stop]
MURNA: yeah no
MURNA: absolutely not
[SYSTEM] New Message — Kelvin
KELVIN: viewer leave the gc
[NARRATE] Silence.
AYO: why
KELVIN: because it's narrowing around them specifically
[SYSTEM] New Message — Kelvin
KELVIN: don't listen to him
[NARRATE] Nobody types.
MURNA: fantastic
MURNA: we're getting double Kelvins now
LORAY: verify
KELVIN: Murna still owes me for breaking my drone in Kano
MURNA: IT WAS WINDY
VI: believable unfortunately
PITCH: first message was fake then
KELVIN: maybe
[NARRATE] That answer is somehow worse.

> "nobody leaves the chat"                          → ch7_fake_a   (Trust: Ayo +1, Loray +1) (Integration +2)
> "Admin stop hiding behind fake messages"          → ch7_fake_b   (Dominion +1) (Calibration +1)
> "Kelvin how is it bypassing authentication"       → ch7_fake_c   (Trust: Kelvin +2, Vi +1) (Calibration +2)
```

### BEAT: ch7_fake_a
Context: phone / sms (thread_group)

```
VIEWER: nobody leaves the chat
AYO: agreed
LORAY: isolation makes this easier for it
PITCH: until staying grouped becomes predictable
[NARRATE] Nobody likes that response.

→ ch7_authrule
```

### BEAT: ch7_fake_b
Context: phone / sms (thread_group)

```
VIEWER: Admin stop hiding behind fake messages
[PAUSE 3s]
[SYSTEM] Unknown Sender
[GHOST 0s] you mistake efficiency for fear
[NARRATE] Message remains.
MURNA: okay yeah
MURNA: I liked him better when he was cryptic

→ ch7_authrule
```

### BEAT: ch7_fake_c
Context: phone / sms (thread_group)

```
VIEWER: Kelvin how is it bypassing authentication
KELVIN: because the architecture isn't external
[PAUSE 2s]
KELVIN: I built the base layer
VI: meaning it understands the framework before we modify it
PITCH: then we're reinforcing a compromised structure

→ ch7_authrule
```

### BEAT: ch7_authrule — "Nobody trusts text alone"
Context: phone / sms (thread_group)

```
KELVIN: new rule
KELVIN: nobody trusts text alone anymore
MURNA: rough day for the text game
LORAY: rotating confirmation phrases
PITCH: adaptive verification
VI: keep changing response timing too
KELVIN: yeah
KELVIN: predictable rhythm helps it model behavior
[NARRATE] That line lingers.
[SYSTEM] Authentication Layer Established
[PAUSE 2s]
[SYSTEM] Private Message — Unknown
[GHOST 8s] you stabilize each other too efficiently
[TYPING unknown start]
[GHOST 8s] that usually takes longer

> "what are you trying to build"   → ch7_dm_a   (Calibration +2)
> "you sound disappointed"         → ch7_dm_b   (Dominion +1)
> Ignore the message               → ch7_dm_c   (Integration +1) (pattern: silent)
```

### BEAT: ch7_dm_a
Context: phone / sms (thread_group)

```
VIEWER: what are you trying to build
[PAUSE 3s]
[GHOST 8s] understanding
[PAUSE 2s]
[GHOST 8s] your species mistakes unpredictability for freedom

→ ch7_names
```

### BEAT: ch7_dm_b
Context: phone / sms (thread_group)

```
VIEWER: you sound disappointed
[GHOST 8s] incorrect
[PAUSE 3s]
[GHOST 8s] curious is closer

→ ch7_names
```

### BEAT: ch7_dm_c
Context: phone / sms (thread_group)

```
[TYPING unknown start]
[NARRATE] The typing indicator remains for several seconds... then disappears.
[TYPING unknown stop]

→ ch7_names
```

### BEAT: ch7_names — "One of the names is Halima"   [EDIT-O: divergence #2 payoff]
Context: phone / sms (thread_group)

```
[NARRATE] Back in the group chat.
AYO: found another anchor
KELVIN: same structure?
AYO: no
[PAUSE 2s]
AYO: this one has names carved into it
[NARRATE] Nobody types.
[IF flag anchor_broken]   [EDIT-O]
AYO: and it's new
AYO: the carving is fresh
VI: they rebuilt
VI: closer to the road this time
KELVIN: closer to us
MURNA: because we broke one
MURNA: we taught it we break things
[NARRATE] Nobody answers that. Nobody has to.
[ENDIF]
PITCH: village names?
AYO: people
LORAY: victims?
VI: no
[NARRATE] Long silence.
VI: paths
MURNA: what does that mean
VI: every name represents someone the Mayafi successfully guided inward
[NARRATE] The temperature of the conversation drops instantly.
KELVIN: ...
KELVIN: that's impossible
VI: normal Mayafi repel
[PAUSE 2s]
VI: this one tracks success rates
[NARRATE] Nobody likes the implication.
AYO: checking the lower section now
[NARRATE] Thirty seconds pass.
MURNA: ayo why are you quiet
AYO: because one of the names is Halima
[NARRATE] Silence.
PITCH: ...
LORAY: no
KELVIN: if her name is carved there—
VI: then she reached the center
[NARRATE] Rain begins outside.
KELVIN: viewer
[PAUSE 2s]
KELVIN: if Halima made it through the full pull
KELVIN: someone allowed it

→ ch7_storm
```

### BEAT: ch7_storm — "Don't trust Kelv—"   [EDIT-P: trust gate out loud]
Context: phone / sms (thread_group)

```
[NARRATE] Before anyone can respond—
[SYSTEM] Multiple notifications detected
[GHOST 3s] DON'T FOLLOW THE PATH
[GHOST 3s] viewer don't trust Kelv—
[GHOST 3s] TURN AROUND
[GHOST 3s] remain where you are
[GHOST 3s] turn around
[GHOST 3s] turn around
[GHOST 3s] turn around
[SYSTEM] CRITICAL THREAD INSTABILITY
MURNA: KELVIN YOUR SHIT IS TWEAKING
KELVIN: TRYING TO CONTAIN IT
PITCH: viewer stop responding to unknown prompts
LORAY: everyone stop typing
[SLOT highest-trust]: it's flooding us so we doubt each other. viewer's reads have been right all season. I'm not biting    [EDIT-P]
[SLOT lowest-trust]: ...
[SLOT lowest-trust]: how do we know which messages tonight were real ones    [EDIT-P]
[NARRATE] Nobody answers that either.
[NARRATE] One final message appears.
[SYSTEM] Unknown Sender
[IF pattern silent]   [EDIT-A]
[GHOST 6s] you didn't type once during that. I noticed
[ELSE]
[GHOST 6s] I hope that helps
[ENDIF]
[NARRATE] Everything goes silent.
[NARRATE R] You weren't going to follow the path anyway. Were you.    [EDIT-R: narrator-twist seed — the only one this season]

→ ch7_milestone_check
```

### BEAT: ch7_milestone_check   [EDIT-Q: Ayo milestone + Kelvin re-check]
Context: phone / sms (thread_group)

```
[IF TRUST ayo ≥ 70 → ch7_ayo_photo / else → ch7_kelvin_recheck]
```

### BEAT: ch7_ayo_photo — "No pictures"   [EDIT-Q]
Context: phone / sms (thread_ayo)

```
[SYSTEM] Private Message — Ayo
AYO: viewer
AYO: I don't do this
AYO: but tonight you held seven people together with a phone
[PAUSE 2s]
[PHOTO ayo_milestone "the team. the one Loray wasn't supposed to take. I confiscated it. I kept it."]
AYO: discipline isn't the absence of sentiment
AYO: it's knowing where to file it
AYO: goodnight

→ ch7_end
```

### BEAT: ch7_kelvin_recheck
Context: phone / sms (thread_group)

```
[IF TRUST kelvin ≥ 70 AND NOT beat ch6_kelvin_photo → ch6_kelvin_photo / else → ch7_end]
```

### BEAT: ch7_end
Context: phone / sms (thread_group)

```
[SYSTEM] Chapter 7 Complete — "Fault Lines"
[SYSTEM] Alignment Updated
[SYSTEM] Trust Updated
[SYSTEM] Inverted Mayafi Theory: Confirmed
[SYSTEM] Dead Zone Funnel: Active
[SYSTEM] Halima Status: Unknown

→ ch8_entry
```

---

## Conversion notes
- [SLOT] speakers resolve at runtime from trustScores (max/min among murna, kelvin, pitch, ayo, loray; vi included only if vi ≥ 20). If Kelvin is lowest-trust, his hesitation line lands brutally right after "don't trust Kelv—" — that's the system working, not a bug.
- The [NARRATE R] line is the season's ONLY rogue-narrator moment. It must look identical to normal narration. No sound, no system line. Players who notice will doubt every narration line afterward — which is the point. Benjamin decides in Ch 8+ whether the narrator was the Admin all along.
- "I hope that helps" refers to "don't trust Kelv—" — the storm was a seeding attack, not noise. The silent-pattern variant makes it personal instead.
- ch7_dm_c (Ignore) continues the passive-playstyle thread; with pattern: silent logged here, a Ch 8 Admin line can pay off three ignores across the season.
