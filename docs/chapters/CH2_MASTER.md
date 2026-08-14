# CHAPTER 2 — "No Aura Trail" (MASTER — conversion source)

Source: Benjamin's Ch 2. Edits applied:
- [EDIT-A] Admin playstyle variants on both intrusion lines (divergence #4)
- [EDIT-B] Case files in apps: Kelvin pushes the bounty posting + recon file to the computer (beef-up)
- [EDIT-C] Narration dosage: connective tissue → pauses/system lines; scene narration kept (warehouse fight untouched — it's the showcase)
- Benjamin's own silence options kept as written (he was already doing this)

New notation for variants — converter support pending:
`[IF pattern X]` / `[ELSE]` blocks select directives by logged player pattern.

---

### BEAT: ch2_open — "Scooby do this"
Context: phone / sms (thread_group)

```
[SYSTEM] Group Chat: Active
[SYSTEM] Members: You, Kelvin, Murna

> "you're a bit of an odd one aren't you"    → ch2_open_a   (Trust: Murna +1)
> "alright. where do we start"               → ch2_open_b   (Trust: Murna +1) (Dominion +1)
> "...is anyone going to explain what scooby do this shit means operationally"  → ch2_open_c   (Trust: Murna +1, Kelvin +1)
```

### BEAT: ch2_open_a
Context: phone / sms (thread_group)

```
VIEWER: you're a bit of an odd one aren't you
MURNA: at times

→ ch2_plan
```

### BEAT: ch2_open_b
Context: phone / sms (thread_group)

```
VIEWER: alright. where do we start
MURNA: straight to it
MURNA: I like that

→ ch2_plan
```

### BEAT: ch2_open_c
Context: phone / sms (thread_group)

```
VIEWER: ...is anyone going to explain what scooby do this shit means operationally
MURNA: it means we find her
KELVIN: it means we find her systematically
MURNA: same thing

→ ch2_plan
```

### BEAT: ch2_plan — "Broken map"
Context: phone / sms (thread_group)

```
VIEWER: so where do we start
MURNA: if we can't find any trace of Halima then we track what took her
KELVIN: but they left no trail either
MURNA: correction
MURNA: no aura trail
MURNA: from the video it's obvious what took her
KELVIN: right
[PAUSE 2s]
[NARRATE] The glowing dots behind her in the video. She sensed them too late. Halima doesn't sense things late.
VIEWER: so how do we track something that can eliminate aura trails
MURNA: that's where you come in buddy
VIEWER: right
VIEWER: my ability
MURNA: yeah so get to it
KELVIN: we need to get into Halima's phone
KELVIN: problem is whatever happened during that struggle corrupted a chunk of it
KELVIN: I can pull what I can when I can
KELVIN: but it's going to come in pieces. incomplete. out of order maybe
MURNA: so basically we're working with a broken map
KELVIN: basically yes
KELVIN: whatever comes through I'll feed to viewer as it clears
KELVIN: might be nothing. might be something
KELVIN: depends on how bad the damage is
MURNA: and the parts that don't clear?
KELVIN: that's where the sight comes in
KELVIN: fill the gaps with what you can viewer
KELVIN: I'll handle the rest on my end
VIEWER: understood. send whatever you get when you get it.
KELVIN: will do
[PAUSE 2s]
KELVIN: we're going to need Pitch
[PAUSE 3s]
[NARRATE] That lands quietly. Whoever Pitch is — the name carries weight.

> "who's Pitch"                          → ch2_pitch_a   (Integration +1)
> "how long has he been out"             → ch2_pitch_b   (Trust: Murna +1) (Calibration +1)
> Say nothing. Let them work through it  → ch2_pitch_c   (Calibration +1) (pattern: silent)
```

### BEAT: ch2_pitch_a
Context: phone / sms (thread_group)

```
VIEWER: who's Pitch
KELVIN: you'll understand once you see him work
MURNA: don't say that like it's a good thing

→ ch2_pitch_history
```

### BEAT: ch2_pitch_b
Context: phone / sms (thread_group)

```
VIEWER: how long has he been out
MURNA: ...
MURNA: a while
KELVIN: Murna
MURNA: I'm just answering the question

→ ch2_pitch_history
```

### BEAT: ch2_pitch_c
Context: phone / sms (thread_group)

```
[NARRATE] Sometimes the most useful thing is knowing when to be quiet.

→ ch2_pitch_history
```

### BEAT: ch2_pitch_history — "A while a while"
Context: phone / sms (thread_group)

```
MURNA: ...yeah
MURNA: figured you'd say that eventually
KELVIN: whatever these things are they mask aura, they move coordinated, and they left zero trail
KELVIN: if we're going in blind we need someone who owns the dark before they do
MURNA: I know why we need him Kelvin
MURNA: I'm just saying
MURNA: he's been quiet for a while
KELVIN: I know
MURNA: like
MURNA: a while a while
KELVIN: Murna.
MURNA: I'm just flagging it
KELVIN: flagged. noted. adding him now.
[SYSTEM] Pitch added to the conversation
[JOIN thread_group: pitch]
[PAUSE 4s]
[NARRATE] Long enough to wonder if he's going to respond at all.
PITCH: what is it
[NARRATE] Not a greeting. Not surprise. Just two words and a readiness underneath them that never really switched off.
KELVIN: Halima's gone. we're going in.
[PAUSE 2s]
PITCH: send me the location.
MURNA: that's it? no questions?
PITCH: you'll brief me on the way.
MURNA: and if I don't feel like it
PITCH: then don't.
MURNA: ...
MURNA: I'll brief you on the way

> "looking forward to seeing you work Pitch"  → ch2_react_a   (Dominion +1)
> "glad you're in"                            → ch2_react_b   (Integration +1)
> Say nothing. File everything away           → ch2_react_c   (Calibration +1) (pattern: silent)
```

### BEAT: ch2_react_a
Context: phone / sms (thread_group)

```
VIEWER: looking forward to seeing you work Pitch
MURNA: don't say that yet

→ ch2_fragment
```

### BEAT: ch2_react_b
Context: phone / sms (thread_group)

```
VIEWER: glad you're in
PITCH: …
[NARRATE] Read receipt. Nothing else.

→ ch2_fragment
```

### BEAT: ch2_react_c
Context: phone / sms (thread_group)

```
[NARRATE] These people have history you're only seeing the edges of. Watch. Learn. That's the job right now.

→ ch2_fragment
```

### BEAT: ch2_fragment — "The shape where a signal used to be"
Context: phone / sms (thread_group)

```
KELVIN: viewer. I've managed to clear a small fragment from Halima's phone
KELVIN: sending it through now
KELVIN: it's partial but it's something
[SYSTEM] FRAGMENT — Halima's phone. Partial data recovered
[NARRATE] Not a signal. The echo of one. The shape where something used to be — buried under corrupted data like something tried to scrub it on the way out. Not perfectly.
VIEWER: Kelvin. you see what I'm seeing
VIEWER: it's not a signal. more like the shape where one used to be
KELVIN: ...hm
KELVIN: that's not nothing
KELVIN: give me a second
MURNA: what does that mean in human
KELVIN: something was communicating near Halima's phone before she went dark
KELVIN: it scrubbed itself on the way out
KELVIN: not perfectly
MURNA: so we have a direction
KELVIN: cross referencing with her last known Nexus trail before it dropped
KELVIN: she was moving northeast
KELVIN: industrial area
[PHOTO murna_fence_photo ""]
[NARRATE photo murna_fence_photo] Grainy. Taken fast. A torn piece of fabric caught on a broken fence panel. Below it — faint impressions in the dust. Deliberate spacing. Someone who knew exactly where they were going.
MURNA: found this at the scene
MURNA: she wasn't dragged
PITCH: or was made to walk
KELVIN: there's an abandoned processing warehouse 2km northeast
KELVIN: that frequency viewer found — it's consistent with that location
KELVIN: viewer — I'm pushing the case file to your machine    [EDIT-B]
KELVIN: bounty posting, the scene photos, my scan logs
KELVIN: read it before we move. I don't repeat briefings
[UNLOCK files]
[FILE case_bounty "bounty_posting_archive.pdf"]
[FILE case_recon "scene_recon_kelvin.log"]
MURNA: we're moving
[SYSTEM] Scene Break

→ ch2_car
```

### BEAT: ch2_car — "Already here waiting"
Context: phone / sms (thread_group)

```
[NARRATE] Both feeds up. Signal already straining. Barely watchable. Enough.
[NARRATE] Murna's body cam tilts sharply.
MURNA: hold on
PITCH: I see it
MURNA: same car
MURNA: third time
[NARRATE] Dark car. Far end of the street. No plates. No movement inside. Just sitting there.
KELVIN: pulling street cams
KELVIN: …it was parked outside the original scene too
MURNA: so we picked up a tail
PITCH: or it was already here waiting for us to move
[NARRATE] That distinction matters. Being followed means someone is reacting to you. Being anticipated means they already knew your next step.

> "keep moving. don't change your pace"                  → ch2_car_a   (Calibration +2)
> "stop. we reassess"                                    → ch2_car_b   (Dominion +1)
> "Kelvin can you loop the street cam feed behind them"  → ch2_car_c   (Trust: Kelvin +1) (Calibration +2)
```

### BEAT: ch2_car_a
Context: phone / sms (thread_group)

```
VIEWER: keep moving. don't change your pace
MURNA: and if they follow
VIEWER: they will. let them think you haven't noticed
KELVIN: already looping the cam feed
KELVIN: give me ninety seconds

→ ch2_car_out
```

### BEAT: ch2_car_b
Context: phone / sms (thread_group)

```
VIEWER: stop. we reassess
PITCH: no
MURNA: yeah no we keep moving
MURNA: stopping tells them we noticed
[NARRATE] They're right.

→ ch2_car_out
```

### BEAT: ch2_car_c
Context: phone / sms (thread_group)

```
VIEWER: Kelvin can you loop the street cam feed behind them
KELVIN: ahead of you
KELVIN: give me ninety seconds
MURNA: nice

→ ch2_car_out
```

### BEAT: ch2_car_out — "Somehow worse"
Context: phone / sms (thread_group)

```
[NARRATE] They keep walking. The car pulls out slowly. No headlights. Rolling at distance. Deliberate. Patient.
KELVIN: done. whoever's watching that feed sees an empty street.
MURNA: nice
PITCH: the car stopped
[NARRATE] Two blocks back. Just parked. Like it already knew the destination.
MURNA: that's somehow worse
VIEWER: agreed. stay sharp.

→ ch2_approach
```

### BEAT: ch2_approach — "You're guiding"
Context: phone / sms (thread_group)

```
[NARRATE] They reach the warehouse.
KELVIN: feeds are barely holding
KELVIN: viewer
KELVIN: you're guiding
MURNA: great
MURNA: no pressure
MURNA: just my life in your hands and what not
[NARRATE] Murna's body cam — chains hanging from the ceiling, dust catching the motion sensor lights in slow drifts. Pitch's drone — wide overhead, the full shape of the building. Between them — most of what they can't see.
[NARRATE] Two heat signatures cluster behind a crate stack to Murna's left. Three more steps and he walks straight into them.
VIEWER: Murna. stop. two heat signatures your left.
[NARRATE] He freezes mid-step. The figures drift past without stopping. Murna waits until they're gone before he breathes again.
MURNA: yeah
MURNA: good call
[NARRATE] Switch to Pitch's feed. Repositioning along the upper level. A dead angle in his arc — high right. Something sitting in it that the drone isn't picking up.
VIEWER: Pitch. blind spot. high right.
PITCH: …I have no blind spots
[NARRATE] Something drops from the rafters exactly where he would have stepped.
PITCH: but it's good that you're paying attention
[NARRATE] He nearly died and came back with that.

> "kill the lights"                            → ch2_hold_a   (Dominion +1) (Calibration +1)
> "hold your positions. something's off"       → ch2_hold_b   (Calibration +2)
> "Kelvin what am I not seeing on these feeds" → ch2_hold_c   (Trust: Kelvin +1) (Integration +1)
```

### BEAT: ch2_hold_a
Context: phone / sms (thread_group)

```
VIEWER: kill the lights
KELVIN: that'll spike noise
KELVIN: you sure
MURNA: what are you scared just do it
[NARRATE] The feeds go dark. Emergency reds flicker on a second later. Everything turns the colour of a bad decision.
MURNA: Bueno

→ ch2_fight
```

### BEAT: ch2_hold_b
Context: phone / sms (thread_group)

```
VIEWER: hold your positions. something's off
MURNA: off how
PITCH: …agreed
PITCH: too quiet between movements
[NARRATE] Like the building already knows how this ends.

→ ch2_fight
```

### BEAT: ch2_hold_c
Context: phone / sms (thread_group)

```
VIEWER: Kelvin what am I not seeing on these feeds
KELVIN: running a thermal sweep now
KELVIN: …viewer
KELVIN: there's a third cluster
KELVIN: they're not moving
KELVIN: just watching

→ ch2_fight
```

### BEAT: ch2_fight — "Already waiting"
Context: phone / sms (thread_group)

```
[NARRATE] Murna's boot catches something on the ground. The whole building wakes up.
MURNA: Pitch! you triggered the alarm!
PITCH: I'll slap the taste out of your mouth worm
[NARRATE] Masked figures pour in on the drone feed before either of them finishes arguing. Both entry points at once. Coordinated timing. No hesitation. Already in position. Already waiting.
PITCH: they knew we were coming
MURNA: Omo. How we wan do?
[NARRATE] Eight. Maybe ten. A third cluster hanging back near the far wall. Not fighting. Watching. Someone is directing this.
VIEWER: left flank. now. don't let them split you.
[NARRATE] Murna pivots and drops the first attacker clean. A second rushes in — he reads it, kicks him sideways into Pitch's reach. Pitch catches him mid-air by the collar and drives him into the concrete.
[NARRATE] Two more break toward Pitch from the right. He steps into them. Pulls shadow from the ground around his feet. The corner of the warehouse goes dark in a way that has nothing to do with the lights.
VIEWER: ceiling. watch the chains.
PITCH: copy
[NARRATE] Three chains drop at once — swallowed into shadow mid-fall. A fourth attacker comes low with a sweep at his legs. Pitch steps over it almost lazily and takes the leg with one clean motion.
PITCH: was that supposed to be a trap?
[NARRATE] The cluster at the far wall still hasn't moved. Just watching. Can't make out who's directing from this angle.
VIEWER: Murna. the one at the back. don't let him leave.
MURNA: copy
[NARRATE] Already moving. Vaulting a crate. Cutting off the exit. The figure turns and runs. Murna closes the gap fast. Takes him down. Both of them skidding across the warehouse floor.
[NARRATE] The rest of the formation breaks without direction. Pitch moves through what's left quickly and without ceremony. The warehouse goes quiet.
MURNA: clear
[NARRATE] Breathing hard. Hands on knees.
MURNA: viewer
MURNA: nice
MURNA: don't let it go to your head
KELVIN: scanning
[PAUSE 4s]
KELVIN: …nothing
[NARRATE] Empty floor. No equipment. No exit trail. No Halima.

→ ch2_textbar
```

### BEAT: ch2_textbar — "The text bar flickers"   [EDIT-A: Admin variant slot #1]
Context: phone / sms (thread_group)

```
[NARRATE] Then the phone does something it shouldn't. Not the video feed. The phone itself. The text bar flickers.
[IF pattern silent]
[GHOST 4s] you watch them more than you help them
[ELSE IF pattern scrutinize]
[GHOST 4s] you check everything twice. it didn't help her
[ELSE]
[GHOST 4s] you hesitate when you calculate
[ENDIF]
[NARRATE] Gone before you can screenshot it.
KELVIN: …viewer
KELVIN: did you type something
MURNA: I swear
MURNA: if that wasn't you

> "wasn't me. something's in my notification layer"  → ch2_intrusion_a   (Integration +1) (Calibration +1)
> "ignore it. stay focused. what do we have"         → ch2_intrusion_b   (Dominion +1)
> "Kelvin. trace it."                                → ch2_intrusion_c   (Trust: Kelvin +1) (Calibration +2)
```

### BEAT: ch2_intrusion_a
Context: phone / sms (thread_group)

```
VIEWER: wasn't me. something's in my notification layer
KELVIN: ...
KELVIN: that shouldn't be possible
MURNA: and yet

→ ch2_staged
```

### BEAT: ch2_intrusion_b
Context: phone / sms (thread_group)

```
VIEWER: ignore it. stay focused. what do we have
[NARRATE] It's bait. Pocket the thought.
PITCH: correct call

→ ch2_staged
```

### BEAT: ch2_intrusion_c
Context: phone / sms (thread_group)

```
VIEWER: Kelvin. trace it.
KELVIN: already trying
KELVIN: it's not leaving a thread
KELVIN: whatever sent that knew I'd look

→ ch2_staged
```

### BEAT: ch2_staged — "Efficient"   [EDIT-A: Admin variant slot #2]
Context: phone / sms (thread_group)

```
PITCH: because this wasn't about her
MURNA: don't
MURNA: don't say that like you're sure
KELVIN: no residue. no extraction marks. no signal rebound.
KELVIN: this was staged
[VIBRATE]
[IF pattern silent]
[GHOST 4s] quiet ones are harder to stage for
[ELSE]
[GHOST 4s] efficient
[ENDIF]
[NARRATE] Gone.
[NARRATE] The car that followed them. The formation already waiting. The figure at the back who wasn't there to fight. This was assembled before a single decision was made.
[NARRATE] And everyone walked in because Halima's name was attached to it.
[SYSTEM] Chapter 2 Complete — "No Aura Trail"
[SYSTEM] Alignment Updated
[SYSTEM] Trust Updated

→ ch3_entry   [STUB — is_ending until Ch3 converts]
```

---

## Conversion notes
- Warehouse fight narration intentionally dense — it is the chapter's centerpiece; do not trim further.
- `[IF pattern]/[ELSE]/[ENDIF]` blocks need converter + engine support (conditional directive). Default branch = the `[ELSE]` line, which is Benjamin's original text.
- `[FILE]`/`[UNLOCK files]` — Files app content (engine has unlock_computer_app; file readables need the FilesApp content map).
- Bodycam/drone feed presentation: rendered via narrate overlay for now; a dedicated "feed" screen is a possible later upgrade, not a blocker.
