# CHAPTER 6 — "Pattern Recognition" (MASTER — conversion source)

Source: Benjamin's Ch 6. Edits applied:
- [EDIT-G] `perimeter_partner` payoff (#1): the entire field sequence plays in the voice of whoever the player sent — Ayo (Benjamin's original, verbatim), Loray, or Vi alone
- [EDIT-K] `anchor_broken` flag set on "destroy one" (divergence #2 — pays off Ch 7)
- [EDIT-L] "Leave the message or delete it" is now the PLAYER's call, not Loray's (divergence #6, flag `kept_message`)
- [EDIT-M] `pitch_dm_secret` payoff (#3): Kelvin's private-contact question
- [EDIT-N] Kelvin trust-milestone photo at chapter end (≥ 70)
- [EDIT-A] Admin variants on both intrusion lines
- [EDIT-C] Narration dosage applied

Partner notation: `[IF flag perimeter_partner = X]` blocks. PARTNER-line = the field operative's lines.

---

### BEAT: ch6_open — "Moving now"
Context: phone / sms (thread_group)

```
[SYSTEM] Group Chat: Active
[SYSTEM] Members: You, Kelvin, Murna, Pitch, Ayo, Loray, Vi
[NARRATE] Dusk. The city feels too quiet. Rain somewhere far off.
[IF flag perimeter_partner = ayo]
AYO: moving now
VI: thirty minutes from perimeter
[ELSE IF flag perimeter_partner = loray]
LORAY: and we're off. me, Vi, and a forty kilometre haunted hole
VI: thirty minutes from perimeter
LORAY: he walks fast for someone who can't see the potholes
VI: I read them before you do
[ELSE]
VI: moving now
VI: thirty minutes from perimeter
MURNA: alone. great. love this plan we all signed off on
[ENDIF]
KELVIN: keep comms light
KELVIN: if the interference spikes I want clean logs
MURNA: he says while putting seven people in one gc
KELVIN: efficiency
MURNA: mental illness
LORAY: viewer
LORAY: are you seeing anything unusual on your end

> "everything's been quiet for too long"   → ch6_quiet_a   (Calibration +1)
> "notifications feel delayed"             → ch6_quiet_b   (Trust: Kelvin +1) (Calibration +2)
> "nothing yet"                            → ch6_quiet_c   (Integration +1)
```

### BEAT: ch6_quiet_a
Context: phone / sms (thread_group)

```
VIEWER: everything's been quiet for too long
KELVIN: yeah
PITCH: silence is information too

→ ch6_terrain
```

### BEAT: ch6_quiet_b
Context: phone / sms (thread_group)

```
VIEWER: notifications feel delayed
KELVIN: explain
VIEWER: typing indicators stop halfway. messages come in unevenly. like something is buffering before it reaches us.
[PAUSE 2s]
KELVIN: ...
KELVIN: don't like that

→ ch6_terrain
```

### BEAT: ch6_quiet_c
Context: phone / sms (thread_group)

```
VIEWER: nothing yet
LORAY: then enjoy that while it lasts
MURNA: positivity queen 😗

→ ch6_terrain
```

### BEAT: ch6_terrain — "Terrain changed"
Context: phone / sms (thread_group)

```
[NARRATE] Messages slow as the field team moves deeper toward the perimeter.
[IF flag perimeter_partner = ayo]
AYO: terrain changed
AYO: trees are bent inward
VI: aura pressure increasing
KELVIN: how bad
VI: manageable
VI: for now
MURNA: hate when people say "for now"
[SYSTEM] Signal instability detected
[NARRATE] One message appears twice.
AYO: terrain changed
AYO: terrain changed
[NARRATE] Then one copy deletes itself.
[ELSE IF flag perimeter_partner = loray]
LORAY: okay so the trees are doing a thing
LORAY: they're bent inward. all of them. like a crowd leaning over a railing
VI: aura pressure increasing
KELVIN: how bad
VI: manageable
VI: for now
LORAY: hate it here by the way. five stars. would not recommend
[SYSTEM] Signal instability detected
[NARRATE] One message appears twice.
LORAY: okay so the trees are doing a thing
LORAY: okay so the trees are doing a thing
[NARRATE] Then one copy deletes itself.
[ELSE]
VI: terrain modified
VI: trees bent inward
VI: aura pressure increasing
KELVIN: how bad
VI: manageable
VI: for now
MURNA: hate when people say "for now"
[SYSTEM] Signal instability detected
[NARRATE] One message appears twice.
VI: terrain modified
VI: terrain modified
[NARRATE] Then one copy deletes itself.
[ENDIF]
MURNA: okay no
MURNA: absolutely not
KELVIN: timestamp mismatch
PITCH: deliberate?
KELVIN: maybe
[SYSTEM] Unknown notification
[IF pattern silent]   [EDIT-A]
[GHOST 4s] the quiet one noticed first. you usually do
[ELSE IF pattern scrutinize]
[GHOST 4s] you saw the duplicate before they did
[ELSE]
[GHOST 4s] you're beginning to notice latency
[ENDIF]
[NARRATE] Gone.
LORAY: ...
MURNA: yeah nah he's getting too comfortable
VI: stop focusing on the messages
VI: focus on the environment
[IF flag perimeter_partner = ayo]
AYO: found something
[PAUSE 2s]
KELVIN: describe it
AYO: stone markers
AYO: buried halfway into the ground
[ELSE IF flag perimeter_partner = loray]
LORAY: found something
LORAY: and I do not want to be finding things out here
KELVIN: describe it
LORAY: stone markers. buried halfway. arranged like someone meant it
[ELSE]
VI: found them
KELVIN: describe it
VI: stone markers
VI: buried halfway into the ground
VI: I can feel them humming from here
[ENDIF]
VI: anchor points
KELVIN: how many
[PAUSE 4s]
VI: too many

> "destroy one"                → ch6_anchor_break   (flag: anchor_broken true) (Trust: Ayo +1, Vi −1) (Dominion +2)
> "don't touch anything yet"   → ch6_anchor_wait    (Trust: Kelvin +1, Vi +1) (Integration +2)
> "how are they arranged"      → ch6_anchor_read    (Trust: Pitch +1, Vi +1) (Calibration +2)
```

### BEAT: ch6_anchor_break   [EDIT-K: divergence #2 set]
Context: phone / sms (thread_group)

```
VIEWER: destroy one
[IF flag perimeter_partner = ayo]
AYO: finally
VI: reckless
AYO: effective
[NARRATE] Five minutes pass.
AYO: okay
AYO: Vi was right
MURNA: what happened
AYO: when I cracked one
AYO: the others changed position
[ELSE IF flag perimeter_partner = loray]
LORAY: I'm sorry. destroy it? with my hands??
VI: reckless
LORAY: agreed but I'm doing it
[NARRATE] Five minutes pass.
LORAY: done. and I want it on record that I hated every second
LORAY: also
LORAY: the other ones moved
[ELSE]
VI: ...
VI: fine
[NARRATE] Five minutes pass.
VI: cracked one
VI: the rest changed position
VI: while I was touching it
[ENDIF]
[PAUSE 2s]
KELVIN: impossible
VI: not impossible
VI: reactive

→ ch6_movement
```

### BEAT: ch6_anchor_wait
Context: phone / sms (thread_group)

```
VIEWER: don't touch anything yet
VI: agreed
[IF flag perimeter_partner = ayo]
AYO: hate agreeing with him this much
[ELSE IF flag perimeter_partner = loray]
LORAY: thank you. was not looking forward to punching a rock
[ENDIF]
KELVIN: smart call
KELVIN: if they're linked physically we could trigger a cascade

→ ch6_movement
```

### BEAT: ch6_anchor_read
Context: phone / sms (thread_group)

```
VIEWER: how are they arranged
[PAUSE 2s]
VI: ...
VI: that's not possible
KELVIN: what
VI: they're moving
[NARRATE] Everyone goes quiet.
[IF flag perimeter_partner = ayo]
AYO: no
AYO: they're not moving
VI: they are
AYO: Vi—
VI: the formation is changing every time I look away
[ELSE IF flag perimeter_partner = loray]
LORAY: I'm staring right at them Vi they are extremely stationary
VI: they move when neither of us is reading them
LORAY: that's worse. you understand that's worse
[ELSE]
VI: the formation is changing every time I rest my reading
VI: there's no one here to watch them for me
[ENDIF]
PITCH: adaptive geometry
KELVIN: no shot
PITCH: you've said "impossible" six times since meeting us

→ ch6_movement
```

### BEAT: ch6_movement — "Something moved"
Context: phone / sms (thread_group)

```
[SYSTEM] Signal instability increasing
[NARRATE] Messages begin arriving out of order.
MURNA: yo why are the timestamps weird
KELVIN: don't trust order right now
[IF flag perimeter_partner = ayo]
AYO: something moved
VI: where
AYO: behind us
MURNA: WHY WOULD YOU SAY THAT SO CASUALLY
[NARRATE] No response from Ayo for twelve seconds.
MURNA: ayo?
KELVIN: signal dipped
PITCH: no
PITCH: she stopped typing
[NARRATE] Three dots appear under Ayo's name.
[TYPING ayo start]
[NARRATE] Ayo is typing... Ayo is typing... Ayo is typing... It doesn't stop.
LORAY: ...
LORAY: Kelvin
KELVIN: that's not her
[TYPING ayo stop]
[SYSTEM] New Message — Ayo
AYO: turn around
[ELSE IF flag perimeter_partner = loray]
LORAY: something moved
VI: where
LORAY: behind us. and I'm not joking for once. clock that.
MURNA: the day Loray stops joking is the day I start praying
[NARRATE] No response from Loray for twelve seconds.
MURNA: loray?
KELVIN: signal dipped
PITCH: no
PITCH: she stopped typing
[NARRATE] Three dots appear under Loray's name.
[TYPING loray start]
[NARRATE] Loray is typing... Loray is typing... Loray is typing... It doesn't stop.
AYO: Kelvin
KELVIN: that's not her
[TYPING loray stop]
[SYSTEM] New Message — Loray
LORAY: turn around
[ELSE]
VI: something moved
KELVIN: where
VI: behind me
VI: which is interesting
VI: because I would have read it coming
MURNA: WHY ARE YOU CALM
[NARRATE] No response from Vi for twelve seconds.
MURNA: vi?
KELVIN: signal dipped
PITCH: no
PITCH: he stopped typing
[NARRATE] Three dots appear under Vi's name.
[TYPING vi start]
[NARRATE] Vi is typing... Vi is typing... Vi is typing... It doesn't stop.
AYO: Kelvin
KELVIN: that's not him
[TYPING vi stop]
[SYSTEM] New Message — Vi
VI: turn around
[ENDIF]
[NARRATE] Silence crashes into the chat.
MURNA: nope
MURNA: absolutely fucking not
[IF flag perimeter_partner = solo]
AYO: Vi where are you
[ELSE]
VI: hold position. I'm reading
[ENDIF]
KELVIN: viewer
KELVIN: that message bypassed routing
PITCH: meaning
KELVIN: meaning it wasn't sent through their device
[SYSTEM] Unknown notification
[GHOST 4s] wrong direction
LORAY: he's guiding movement now
PITCH: no
PITCH: he's testing obedience

> "don't turn around. nobody turns around."     → ch6_rescue_a   (Integration +1)
> "get out. both of you. now."                  → ch6_rescue_b   (Dominion +1)
> "Kelvin trace the injection point"            → ch6_rescue_c   (Trust: Kelvin +2) (Calibration +2)
```

### BEAT: ch6_rescue_a
Context: phone / sms (thread_group)

```
VIEWER: don't turn around. nobody turns around.
[PAUSE 3s]
[IF flag perimeter_partner = ayo]
AYO: wasn't planning to
MURNA: THANK YOU
[ELSE IF flag perimeter_partner = loray]
LORAY: viewer I have never agreed with anyone harder in my life
MURNA: THANK YOU
[ELSE]
VI: I don't use eyes
VI: but noted
[ENDIF]

→ ch6_footprints
```

### BEAT: ch6_rescue_b
Context: phone / sms (thread_group)

```
VIEWER: get out. both of you. now.
[IF flag perimeter_partner = ayo]
VI: moving
AYO: don't order him around
VI: I was already moving
[ELSE IF flag perimeter_partner = loray]
VI: moving
LORAY: he says moving. he means gliding. it's deeply unfair
[ELSE]
VI: already moving
VI: I was moving before you typed it
[ENDIF]

→ ch6_footprints
```

### BEAT: ch6_rescue_c
Context: phone / sms (thread_group)

```
VIEWER: Kelvin trace the injection point
KELVIN: trying
KELVIN: it's rerouting through dead channels
[PAUSE 2s]
KELVIN: viewer
KELVIN: it's using old architecture
PITCH: from you?
[NARRATE] Long silence.
KELVIN: ...
KELVIN: yes

→ ch6_footprints
```

### BEAT: ch6_footprints — "They stopped"
Context: phone / sms (thread_group)

```
[NARRATE] Signal stabilizes slightly.
[IF flag perimeter_partner = ayo]
AYO: we're pulling back
VI: agreed
[ELSE IF flag perimeter_partner = loray]
LORAY: we are leaving. democracy is over. I voted twice
VI: agreed
[ELSE]
VI: pulling back
[ENDIF]
KELVIN: good
KELVIN: I have enough data for now
MURNA: translation:
MURNA: we're cooked but scientifically
[IF flag perimeter_partner = solo]
LORAY: Vi did you actually read anything out there
[PAUSE 2s]
VI: no
[PAUSE 2s]
VI: that's the problem
[ELSE]
LORAY: did either of you actually see anything
[PAUSE 2s]
VI: no
[PAUSE 2s]
[IF flag perimeter_partner = ayo]
AYO: that's the problem
[ELSE]
LORAY: and that's the problem. I looked everywhere
[ENDIF]
[ENDIF]
[NARRATE] The mood shifts instantly.
PITCH: explain
[IF flag perimeter_partner = ayo]
AYO: there were footprints
AYO: fresh ones
MURNA: okay?
AYO: they stopped
[ELSE IF flag perimeter_partner = loray]
LORAY: footprints. fresh. mid-stride
MURNA: okay?
LORAY: they stop. mid-stride. like a sentence cut in half
[ELSE]
VI: footprints
VI: fresh pressure traces
VI: they stop
[ENDIF]
[NARRATE] Nobody types for several seconds.
VI: not faded
VI: stopped
KELVIN: ...
PITCH: someone stood there
PITCH: and disappeared

→ ch6_keepdelete
```

### BEAT: ch6_keepdelete — "Easier to separate"   [EDIT-L: divergence #6 — player's call now]
Context: phone / sms (thread_group)

```
[NARRATE] Then the messages begin glitching again.
[SYSTEM] Message duplication detected
MURNA: viewer don't
MURNA: viewer don't
MURNA: viewer don't
[NARRATE] The extra copies delete one by one.
MURNA: what the hell
[NARRATE] A final message appears.
[SYSTEM] Unknown Sender
[IF pattern silent]   [EDIT-A]
[GHOST 0s] you're easier to isolate than the loud ones
[ELSE]
[GHOST 0s] you're easier to separate than expected
[ENDIF]
[NARRATE] This one doesn't disappear. It's waiting to see what you do with it.

> Leave it there. It wants a reaction — starve it.   → ch6_keep    (flag: kept_message true) (Trust: Loray +1, Pitch +1) (Calibration +1)
> Delete it. Nobody stares at bait.                   → ch6_delete  (flag: kept_message false) (Dominion +1)
```

### BEAT: ch6_keep
Context: phone / sms (thread_group)

```
LORAY: good
LORAY: don't delete it
PITCH: agreed
PITCH: it wants us reacting
[NARRATE] Silence.
MURNA: hate when she's right too
[TRUST Kelvin +1]

→ ch6_contact_q
```

### BEAT: ch6_delete
Context: phone / sms (thread_group)

```
[NARRATE] Deleted.
LORAY: ...I was going to say keep it
VIEWER: it was bait
LORAY: bait is information viewer
PITCH: both readings are defensible
[NARRATE] A second later your phone buzzes once. No notification. No message. Just the buzz.
[NARRATE] Like an acknowledgement.

→ ch6_contact_q
```

### BEAT: ch6_contact_q — "Private contact"   [EDIT-M: divergence #3 payoff]
Context: phone / sms (thread_group)

```
KELVIN: one more thing before we log off
KELVIN: it's escalating through individual channels
KELVIN: so I need to know
KELVIN: has it — or anyone — contacted any of you privately
[PAUSE 2s]
MURNA: no
AYO: no
LORAY: nothing yet
VI: no
[PAUSE 3s]
[IF flag pitch_dm_secret]
[NARRATE] Pitch hasn't answered. Neither have you. Two private channels. One question.
PITCH: viewer and I spoke. operational advice. nothing more
KELVIN: ...noted
KELVIN: and viewer didn't think to mention it either
[NARRATE] He doesn't push further. He doesn't have to. Something just got logged in the audit.
[TRUST Kelvin −1]
[ELSE]
PITCH: viewer disclosed our exchange already
KELVIN: confirmed. transparency holds
KELVIN: keep it that way. all of you
[TRUST Kelvin +1]
[ENDIF]

→ ch6_close
```

### BEAT: ch6_close — "Noticed them back"
Context: phone / sms (thread_group)

```
[NARRATE] The rain finally starts outside. Soft against windows.
[NARRATE] The dead zone still forty kilometres northeast.
[NARRATE] But now it feels like something inside it has noticed them back.

→ ch6_milestone_check
```

### BEAT: ch6_milestone_check   [EDIT-N: Kelvin milestone + Loray re-check]
Context: phone / sms (thread_group)

```
[IF TRUST kelvin ≥ 70 → ch6_kelvin_photo / else → ch6_loray_recheck]
```

### BEAT: ch6_kelvin_photo — "Audit trail"   [EDIT-N]
Context: phone / sms (thread_kelvin)

```
[SYSTEM] Private Message — Kelvin
KELVIN: viewer
KELVIN: I don't do sentiment. consider this data retention
[PHOTO kelvin_milestone "the whole team. before. Halima took it — she's the blur in the corner, she hated being on camera"]
KELVIN: that's the only copy
KELVIN: now there are two
KELVIN: don't make me regret the redundancy

→ ch6_end
```

### BEAT: ch6_loray_recheck
Context: phone / sms (thread_group)

```
[IF TRUST loray ≥ 70 AND NOT beat ch5_loray_photo → ch5_loray_photo / else → ch6_end]
```

### BEAT: ch6_end
Context: phone / sms (thread_group)

```
[SYSTEM] Chapter 6 Complete — "Pattern Recognition"
[SYSTEM] Alignment Updated
[SYSTEM] Trust Updated
[SYSTEM] Dead Zone Anchor Points: Confirmed
[SYSTEM] Admin Activity: Escalating

→ ch7_entry   [STUB — is_ending until Ch7 converts]
```

---

## Conversion notes
- Ayo branch is Benjamin's text verbatim; Loray/solo branches are new but beat-identical — same events, same information, different voice. If a partner branch ever contradicts Ayo-branch facts, the Ayo branch wins.
- The solo-Vi possession variant ("that's not him") is the scariest read — Vi is the one who reads things; something writing AS him breaks his whole premise.
- ch6_delete's "acknowledgement buzz" gives the delete path its own flavor of dread so neither choice feels punished.
- The contact question intentionally does NOT resolve the pitch_dm_secret guilt — it banks it. Ch 7's "don't trust Kelv—" hits differently when Kelvin already has reason to distrust the viewer.
- Engine needs: flag-conditional blocks (one new directive or beat-level conditions), trust_check, and conditional [IF beat X] (beatHistory lookup).
