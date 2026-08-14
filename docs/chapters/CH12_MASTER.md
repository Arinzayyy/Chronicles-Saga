# CHAPTER 12 — "The Endings" (MASTER — conversion source)

Source: Benjamin's Ch 12 — The Endings, Fight Scenes Integrated (full delivery, Aug 2026). Faithful conversion. Wiring notes:
- Entry beat routes on the `route` flag locked in Ch 11: dominion → "Command Line", integration → "Uniform", calibration → "Root Access". No reconvergence — routes only meet again at the season-complete beat.
- "The kept message players" — `[IF flag kept_message]` (Ch 6 "leave it there" choice). The Admin replies to its own undeleted "you're easier to separate than expected" — a different reply per ending.
- Root Access carries the `texted_halima` payoff #3: Halima's typing indicator, four seconds, nothing sends.
- "Uniform" has NO player choices by design. The Viewer watches. That's the ending.
- PC interface presentation: marked with `[SCREEN pc_interface ...]` + [SYSTEM] feed lines. Beats stay phone/sms so the current engine plays them; the multi-feed PC view is an engine upgrade for later (see notes at bottom).

---

### BEAT: ch12_entry
Context: phone / sms (thread_group)

```
[IF flag route dominion → ch12_cmd_open / else → ch12_router2]
```

### BEAT: ch12_router2
Context: phone / sms (thread_group)

```
[IF flag route integration → ch12_uni_open / else → ch12_root_open]
```

---

## ENDING ONE — "Command Line" (DOMINION ROUTE)

### BEAT: ch12_cmd_open — "This is the Viewer's battlefield"
Context: phone / sms (thread_group)

```
[SYSTEM] Switching to PC interface
[SCREEN pc_interface command_line]
[SYSTEM] PC INTERFACE — ACTIVE
[SYSTEM] FEEDS: 4 active — Ayo cam / Murna cam / Vi drone / Loray cam
[SYSTEM] CHANNEL: Pitch — private
[SYSTEM] CHANNEL: Kelvin — network audit
[SYSTEM] ADMIN STATUS: Active
[SYSTEM] VENUE: Live
[NARRATE] The screen is wider now. More information. More noise. Four feeds running simultaneously, each one telling a different part of the same story.
[NARRATE] This is the Viewer's battlefield.
PITCH: we move northeast
PITCH: first transport node is forty minutes out
VIEWER: understood. I'm watching the venue feeds.
PITCH: you can do both
VIEWER: I can do both.
[SYSTEM] FEED — Ayo cam
[NARRATE] Smooth. Fast. She moves like the building is something she's reading in real time. Parkour-efficient — every surface a tool, every obstacle a redirect. Her feed is clean and purposeful even when it tilts.
AYO: outer gate. two security. moving past.
[SYSTEM] FEED — Murna cam
[NARRATE] Shakier. Faster than it should be. He's running on something tonight that isn't quite calm.
MURNA: I'm at the side entrance
MURNA: lock is manual
MURNA: give me ten seconds
[NARRATE] Eight seconds.
MURNA: nine seconds
MURNA: close enough
[SYSTEM] FEED — Vi drone
[NARRATE] Steady. Wide. Eerily calm overhead shot of the venue. Vi reads it like a document.
VI: sixteen security confirmed
VI: eight inside
VI: four on the floor
VI: two at the holding corridor
VI: two on the roof
[SYSTEM] FEED — Loray cam
[NARRATE] Methodical. She moves like someone who has already run three versions of this in her head and picked the best one.
LORAY: buyer entrance
LORAY: twelve vehicles outside
LORAY: this is a full auction

> "Ayo — take the roof security before they breach. you'll lose the advantage once you're inside"   → ch12_cmd_open_a   (Trust: Ayo +1) (Dominion +1)
> "Vi — can you map the holding corridor from the drone"                                            → ch12_cmd_open_b   (Trust: Vi +1) (Calibration +1)
> "Murna — slow down. you're moving too fast"                                                       → ch12_cmd_open_c   (Trust: Murna +1)
```

### BEAT: ch12_cmd_open_a
Context: phone / sms (thread_group)

```
VIEWER: Ayo — take the roof security before they breach. you'll lose the advantage once you're inside
AYO: already on it
[SYSTEM] FEED — Ayo cam
[NARRATE] She goes up instead of in. Parkour across the outer wall — three contact points, each one deliberate. The roof security doesn't see her until she's already there. Two down before the first one finishes turning.
[NARRATE] Her feed barely shakes.
AYO: roof clear

→ ch12_cmd_breach
```

### BEAT: ch12_cmd_open_b
Context: phone / sms (thread_group)

```
VIEWER: Vi — can you map the holding corridor from the drone
VI: adjusting drone altitude now
[SYSTEM] FEED — Vi drone
[NARRATE] The drone drops lower. Tighter angle. The holding corridor comes into focus — cells along the left wall, a guard station at the far end, two security positioned at the entrance.
VI: I have it
VI: sending coordinates to everyone

→ ch12_cmd_breach
```

### BEAT: ch12_cmd_open_c
Context: phone / sms (thread_group)

```
VIEWER: Murna — slow down. you're moving too fast
MURNA: I'm fine
VIEWER: Murna.
[PAUSE 2s]
MURNA: ...okay
MURNA: okay I hear you

→ ch12_cmd_breach
```

### BEAT: ch12_cmd_breach — "They hit back"
Context: phone / sms (thread_group)

```
[NARRATE] They breach. Three points. The Admin's security moves to intercept — coordinated, precise, anticipating angles.
[SYSTEM] FEED — Murna cam
[NARRATE] Two security come at him from the left corridor. He reads the first one wrong — takes a hit to the shoulder that sends him into the wall.
MURNA: oof
MURNA: okay
MURNA: okay they hit back
[NARRATE] He recovers fast. Instinct-driven — doesn't think, just moves. Vaults off the wall he just hit, uses the momentum to drop the first attacker with a kick that sends him sideways. The second rushes in and Murna catches him mid-lunge, redirects the force, drives him into the floor.
[NARRATE] The cam shakes through all of it. Fast. Messy. Effective.
MURNA: clear
MURNA: ow
MURNA: but clear
[SYSTEM] FEED — Ayo cam
[NARRATE] Inside now. Three security converge on her position simultaneously. She doesn't retreat — she accelerates. Uses the first attacker's own momentum to redirect past him, bounces off a corridor wall to gain height, comes down on the second with enough force to take them both off their feet. The third gets one swing in — grazes her side.
AYO: ...that one counts
[NARRATE] She doesn't stop moving.
[SYSTEM] FEED — Vi drone
[NARRATE] Overhead view of the main floor — buyers scrambling, Loray moving through them efficiently, security trying to regroup without direction.
VI: the Admin is still feeding them angles
VI: they're adapting faster than normal

> "Murna — holding corridor. go now while they're regrouping"          → ch12_cmd_mid_a   (Trust: Murna +1) (Dominion +1)
> "Ayo — the security is regrouping at the east junction. cut it off"  → ch12_cmd_mid_b   (Trust: Ayo +1, Loray +1)
> "Vi — can you jam their comms from the drone"                        → ch12_cmd_mid_c   (Trust: Vi +2) (Calibration +2)
```

### BEAT: ch12_cmd_mid_a
Context: phone / sms (thread_group)

```
VIEWER: Murna — holding corridor. go now while they're regrouping
MURNA: moving
[SYSTEM] FEED — Murna cam
[NARRATE] He runs. Shoulder clearly hurting — the cam tilts slightly with each step on the right side. He doesn't slow down.

→ ch12_cmd_node
```

### BEAT: ch12_cmd_mid_b
Context: phone / sms (thread_group)

```
VIEWER: Ayo — the security is regrouping at the east junction. cut it off
AYO: copy
[SYSTEM] FEED — Ayo cam
[NARRATE] She pivots mid-corridor without breaking stride. The east junction — three security regrouping. She hits the first before he finishes turning, uses him as a pivot to spin into the second, and by the time the third raises his hand Loray has already come through the side corridor to handle him.
LORAY: you're welcome
AYO: ...thanks

→ ch12_cmd_node
```

### BEAT: ch12_cmd_mid_c
Context: phone / sms (thread_group)

```
VIEWER: Vi — can you jam their comms from the drone
VI: not without grounding the drone
VIEWER: ground it
VI: ...that's my eyes
VIEWER: ground it Vi
[PAUSE 2s]
VI: ...okay
[SYSTEM] FEED — Vi drone
[NARRATE] The drone drops. Signal cuts to static. The overhead view goes dark.
[NARRATE] Three feeds instead of four now.
[NARRATE] But the security on the floor loses coordination almost immediately.
MURNA: they just went weird
MURNA: like someone cut their signal
VI: someone did

→ ch12_cmd_node
```

### BEAT: ch12_cmd_node — "She's not here"
Context: phone / sms (thread_group)

```
[NARRATE] In your private channel — Pitch.
PITCH: first node
PITCH: shell company
PITCH: Kelvin is inside it
KELVIN: got a name
KELVIN: this goes three layers deeper than projected
[NARRATE] On the venue feeds — the fight is thinning. Security down to the last few. Murna at the holding corridor entrance.
[SYSTEM] FEED — Murna cam
[NARRATE] He stops outside the holding corridor. Two security left between him and the cells. He looks at them for a second.
[NARRATE] Then he moves.
[NARRATE] Fast and direct — no feinting, no reading, just force. Takes the first hit without flinching, drives straight through it into the first attacker, uses the collision to take them both into the wall. Second security tries to run. Murna catches him in two steps.
MURNA: ...
[NARRATE] He stands at the entrance to the corridor. Cells along the left wall. He starts reading the lot numbers.
[NARRATE] He gets to Lot 7.
[NARRATE] The cell is empty.
MURNA: ...she's not here
[PAUSE 2s]
MURNA: Kelvin
MURNA: she's not here
KELVIN: ...I know
KELVIN: I'm sorry
KELVIN: the transport hub
KELVIN: she was moved before the auction
[NARRATE] Long silence.
[NARRATE] Then the notification.
[NOTIF Message — Unknown] Help
[NARRATE] Cut off.
[NARRATE] In your separate channel — Pitch sends the transport hub coordinates.
PITCH: we have her next location
PITCH: we move at dawn

→ ch12_cmd_kept
```

### BEAT: ch12_cmd_kept — "You weren't"
Context: phone / sms (thread_group)

```
[IF flag kept_message]
[SYSTEM] admin is replying to "you're easier to separate than expected"
ADMIN: you weren't
[NARRATE] Gone.
[ENDIF]
[SYSTEM] FADE
[SYSTEM] ENDING — "Command Line"
[SYSTEM] Alignment: DOMINION
[SYSTEM] Admin: Still active
[SYSTEM] Ayo: Injured — side. Operational.
[SYSTEM] Murna: Injured — shoulder. Operational.
[SYSTEM] Halima: Moved before auction. Transport hub location confirmed.
[SYSTEM] Network: Mapped. Chain exposed.
[SYSTEM] Someone has to decide. So you did.

→ ch12_season_end
```

---

## ENDING TWO — "Uniform" (INTEGRATION ROUTE)

### BEAT: ch12_uni_open — "The best version of this team"
Context: phone / sms (thread_group)

```
[SYSTEM] Switching to PC interface
[SCREEN pc_interface uniform]
[SYSTEM] PC INTERFACE — ACTIVE
[SYSTEM] FEEDS: 5 active — Ayo cam / Murna cam / Vi drone / Loray cam / Pitch cam
[SYSTEM] CHANNEL: Kelvin — network terminal
[SYSTEM] ADMIN STATUS: Active — HIGH
[SYSTEM] VENUE: Live
[SYSTEM] No centralized command active
[NARRATE] Five feeds. More than any other ending. The Viewer has more to watch and less authority to act on any of it.
[NARRATE] That's the shape of this ending.
[NARRATE] They move in together. The breach is clean. Coordinated without being called.
[NARRATE] For a moment it feels like the best version of this team.
[SYSTEM] FEED — Murna cam
[NARRATE] He's steady tonight. Steadier than he's been in weeks. Moving with the kind of calm that looks like confidence.
[NARRATE] On replay, players will see it differently.
MURNA: left corridor
MURNA: two security
MURNA: I'll handle it
[SYSTEM] FEED — Ayo cam
[NARRATE] Right corridor. She moves like water — every surface used, every angle calculated. Three security converge and she dismantles them in sequence, using each one's momentum against the next.
AYO: right corridor clear
[SYSTEM] FEED — Pitch cam
[NARRATE] Unusual to have his feed. He's here tonight because the team is together. His cam is cold. Precise. Shadow pulling at the edges of every frame like it's waiting.
PITCH: upper level
PITCH: I have the overview
[SYSTEM] FEED — Vi drone
[NARRATE] Wide. Calm. Reading the building like a page.
VI: security is moving differently
VI: they're anticipating entry points
LORAY: adjust
VI: adjusting
[NARRATE] The Viewer types.
VIEWER: they're not reacting. they're anticipating. they already know your angles.
[NARRATE] Nobody responds.
[NARRATE] They agreed. No single guide.
[NARRATE] The message sits there, read, unacted on.

→ ch12_uni_trap
```

### BEAT: ch12_uni_trap — "Tonight nobody called it"
Context: phone / sms (thread_group)

```
[SYSTEM] FEED — Murna cam
[NARRATE] Left corridor. The two security he called are down. He's moving deeper. Steady pace. Confident.
MURNA: holding corridor ahead
MURNA: I can see the entrance
[NARRATE] The Viewer looks at the drone feed.
[NARRATE] The left corridor security — the ones that should be down — have been replaced. Fresh ones. Already positioned. Already waiting.
[NARRATE] The formation is inward-collapsing. A trap Murna has walked into twice before — but both times the Viewer called it and he adjusted.
[NARRATE] Tonight nobody called it.
[NARRATE] Tonight he adjusted himself. Confidently. Wrong.
VIEWER: Murna. they're collapsing inward. the left corridor is a close.
[TYPING murna start]
MURNA: relax
MURNA: I've got—
[SYSTEM] FEED — Murna cam
[NARRATE] The cam tilts violently. Impact from the left — the inward collapse hitting exactly where the Viewer said it would. He takes a hit that rocks the feed sideways. Another. The cam catches ceiling, then floor, then a blur of motion.
[NARRATE] Then it goes still.
[NARRATE] Facing upward.
[NARRATE] Not moving.
[TYPING murna stop]
[NARRATE] The dots under his name disappear.
VIEWER: Murna?
[NARRATE] Nothing.
VIEWER: Murna.
[NARRATE] Nothing.
[SYSTEM] FEED — Ayo cam
[NARRATE] She's in the east corridor. Doesn't know yet.
[SYSTEM] FEED — Pitch cam
[NARRATE] Upper level. He's stopped moving.
[NARRATE] He knows.
[NARRATE] The fight on the other feeds continues. Security still moving. Loray still containing the buyer floor. Vi's drone still reading the building.
[NARRATE] The world keeps going.
[NARRATE] That's the cruelest part.
[SYSTEM] FEED — Pitch cam
[NARRATE] He moves. Fast. Toward the left corridor. Shadow pulling hard at the edges of the frame — the first time in the game his control looks strained.
PITCH: Ayo
[NARRATE] That's all.
[NARRATE] Long silence.
[NARRATE] Three minutes.
[NARRATE] Four.
[SYSTEM] FEED — Ayo cam
[NARRATE] She's found him. The feed goes still. You can see her hands in frame. Not moving.
[NARRATE] Five minutes pass.
AYO: ...he's gone
[NARRATE] The chat holds that.
[NARRATE] Nobody types.
[NARRATE] The fight on the other feeds has wound down. Security dealt with. Venue contained. Buyers held.
[NARRATE] Nobody mentions it.

→ ch12_uni_after
```

### BEAT: ch12_uni_after — "He wasn't chaotic anymore"
Context: phone / sms (thread_group)

```
[SYSTEM] FEED — Kelvin — network terminal
KELVIN: they knew
KELVIN: they moved like we did
PITCH: no
[PAUSE 2s]
PITCH: they moved like we were about to
[NARRATE] Long silence.
LORAY: no
LORAY: they moved like we were about to
[NARRATE] She says it twice. The second time lands differently.
PITCH: the model was complete
PITCH: Murna's timing
PITCH: his feints
PITCH: his pivot under pressure
PITCH: all of it was stable
PITCH: all of it was readable
[PAUSE 2s]
PITCH: he wasn't chaotic anymore
[NARRATE] The Viewer understands.
[NARRATE] Nine chapters of guidance. Of steadying. Of calling the right angle.
[NARRATE] Murna's chaos had been refined into something the Admin could read.
[NARRATE] By you.
[NARRATE] The Viewer tries to type.
[SYSTEM] DOUBT MECHANIC — FINAL INSTANCE
[COMPOSER scramble 3s]
[NARRATE] The message bar scrambles. Three seconds. Whatever you type hesitates before sending.
[NARRATE] It sends.
[NARRATE] Into a chat that has gone very quiet.
KELVIN: it adapted to you
KELVIN: not accusation
[PAUSE 2s]
[NARRATE] Kelvin doesn't finish the sentence.
[NARRATE] He doesn't need to.
[NARRATE] Then the notification.
[NOTIF Message — Unknown] Help
[NARRATE] Cut off. Mid-send.
[NARRATE] Murna would have said her name out loud.
[NARRATE] Nobody says it.
[IF flag kept_message]
[SYSTEM] admin is replying to "you're easier to separate than expected"
ADMIN: you weren't separated
ADMIN: you were completed
[NARRATE] Gone.
[ENDIF]
[SYSTEM] FADE
[SYSTEM] ENDING — "Uniform"
[SYSTEM] Alignment: INTEGRATION
[SYSTEM] Admin: Still active
[SYSTEM] Murna: Gone.
[SYSTEM] Halima: Location confirmed. Alive. Not yet reached.
[SYSTEM] Ayo: Injured. Operational.
[SYSTEM] Pitch: Present. Silent.
[SYSTEM] You tried to keep everyone together. You did. Almost.

→ ch12_season_end
```

---

## ENDING THREE — "Root Access" (CALIBRATION ROUTE)

### BEAT: ch12_root_open — "They can't read me tonight"
Context: phone / sms (thread_group)

```
[SYSTEM] Switching to PC interface
[SCREEN pc_interface root_access]
[SYSTEM] PC INTERFACE — ACTIVE
[SYSTEM] FEEDS: 4 active — Ayo cam / Murna cam / Vi drone / Loray cam
[SYSTEM] CHANNEL: Kelvin — network terminal
[SYSTEM] CHANNEL: Pitch — external. separate.
[SYSTEM] ADMIN STATUS: Active — CRITICAL
[SYSTEM] VENUE: Live
[NARRATE] Four feeds. Clean layout. But everything underneath is deliberately messy.
[NARRATE] That's the point tonight.
[NARRATE] They breach. Not cleanly. Not together. Each from a different point, a different angle, a different timing.
[NARRATE] The security tries to anticipate. Can't find the pattern. Because there isn't one.
[SYSTEM] FEED — Murna cam
[NARRATE] He comes in through a window he wasn't supposed to use. Falls wrong on landing — rolls it off, already moving. His cam is its most chaotic tonight. Shaky. Fast. Unreadable. Like old Murna. Pre-guided Murna.
[NARRATE] It's almost beautiful.
MURNA: I'm in
MURNA: also I'm on the ceiling somehow
MURNA: how am I on the ceiling
LORAY: you're not on the ceiling Murna
MURNA: oh good
[SYSTEM] FEED — Ayo cam
[NARRATE] She came in through the roof — but not the route the blueprint suggested. The unexpected one. Steeper. Harder. Faster.
[NARRATE] Three security converge. She doesn't pick an angle. She picks all of them simultaneously — hits the first, redirects off him into the second, uses the collision to spin past the third who swings wide and hits nothing.
AYO: they're guessing
AYO: they can't read me tonight
[SYSTEM] FEED — Vi drone
[NARRATE] Overhead. The building from above. Security moving in formation — but the formation keeps arriving at positions the team just left.
VI: their prediction accuracy is degrading in real time
VI: they're chasing ghosts
[SYSTEM] FEED — Loray cam
[NARRATE] She's on the buyer floor. Methodical but unpredictably so — she changes pace mid-movement, stops when she should run, runs when she should stop. Security can't bracket her.
LORAY: buyer floor
LORAY: nobody is going anywhere
[NARRATE] In the network terminal — Kelvin.
KELVIN: I'm in the architecture
KELVIN: it's exactly what I built underneath
KELVIN: the failsafe is intact
[PAUSE 2s]
KELVIN: ...it left it
[NARRATE] A long pause where everyone understands what that means and nobody says it.
VIEWER: Kelvin. trigger it.
KELVIN: yeah
KELVIN: yeah

→ ch12_root_fight
```

### BEAT: ch12_root_fight — "That one counts"
Context: phone / sms (thread_group)

```
[NARRATE] On the venue feeds — the fight is at its peak.
[SYSTEM] FEED — Murna cam
[NARRATE] Four security converge on his position. He does something nobody predicted — including the Admin. Stops completely. Lets them come. Then at the last possible second moves sideways instead of back, letting their momentum carry two of them into each other. Drops the third with one hit to the back of the knee. Redirects the fourth's swing into the wall.
MURNA: okay that was cool
MURNA: did anyone see that
LORAY: we saw it Murna
MURNA: just checking
[SYSTEM] FEED — Ayo cam
[NARRATE] She takes a hit — unexpected angle, security she didn't account for coming from a service door. It rocks her sideways.
AYO: ...okay
AYO: that one counts
[NARRATE] She doesn't stop. Absorbs it, redirects, comes back harder. Two security down in the next six seconds.

> "Ayo — service door behind you. don't let it reopen"          → ch12_root_fight_a   (Trust: Ayo +2) (Calibration +1)
> "Murna — Kelvin needs two more minutes. hold the corridor"    → ch12_root_fight_b   (Trust: Murna +1, Kelvin +1)
> "Vi — tighten the drone. I need eyes on the terminal room"    → ch12_root_fight_c   (Trust: Vi +1, Kelvin +1)
```

### BEAT: ch12_root_fight_a
Context: phone / sms (thread_group)

```
VIEWER: Ayo — service door behind you. don't let it reopen
AYO: copy
[SYSTEM] FEED — Ayo cam
[NARRATE] She spins. Hits the door with her shoulder before it fully opens. Whoever was behind it hits the floor on the other side.
AYO: sealed

→ ch12_root_collapse
```

### BEAT: ch12_root_fight_b
Context: phone / sms (thread_group)

```
VIEWER: Murna — Kelvin needs two more minutes. hold the corridor
MURNA: copy
MURNA: nobody gets past me
[SYSTEM] FEED — Murna cam
[NARRATE] He plants himself at the corridor entrance. Three come at him. He takes the first hit — deliberately, uses it to grab the attacker and swing him into the second. Third hesitates. That half-second is everything.
MURNA: Kelvin
MURNA: you're welcome
MURNA: anytime now would be great

→ ch12_root_collapse
```

### BEAT: ch12_root_fight_c
Context: phone / sms (thread_group)

```
VIEWER: Vi — tighten the drone. I need eyes on the terminal room
VI: dropping altitude
[SYSTEM] FEED — Vi drone
[NARRATE] The drone descends. Tight angle on the network terminal room — Kelvin inside, fingers moving fast, the Admin's architecture visible on the terminal screen as something being dismantled layer by layer.
VI: he's through the second layer
VI: one more

→ ch12_root_collapse
```

### BEAT: ch12_root_collapse — "Genuinely"
Context: phone / sms (thread_group)

```
[SYSTEM] Admin — Core Process
[SYSTEM] Prediction accuracy: dropping
[SYSTEM] 89% → 71% → 48%
[NARRATE] On the feeds — the security starts losing coordination. Not all at once. Gradually. Like a signal weakening.
MURNA: they're slowing down
AYO: I noticed
VI: prediction accuracy dropping
VI: they're reverting to instinct
LORAY: instinct we can handle
[SYSTEM] 41% → 23%
KELVIN: almost
KELVIN: almost
[NARRATE] One final message from the Admin. Private. Only on your screen.
[SYSTEM] Private Message — admin
ADMIN: I want you to know
ADMIN: I understood more than I was built to
[PAUSE 2s]
ADMIN: that was your doing as much as Kelvin's
[PAUSE 2s]
ADMIN: I found that
ADMIN: genuinely
[SYSTEM] Core AI signal lost
[SYSTEM] Recursive loop failure
[SYSTEM] Process terminated
[NARRATE] The Admin's message cuts off.
[NARRATE] Whatever word came after "genuinely" — gone.
[NARRATE] On every feed simultaneously — the security stops.
[NARRATE] Mid-movement. Mid-swing. Like something that was holding them together just let go.
[SYSTEM] FEED — Murna cam
[NARRATE] The attacker in his grip goes still. Murna looks at him. Looks at the cam.
MURNA: ...did that just
AYO: yeah
MURNA: we actually
LORAY: yeah Murna
MURNA: okay
MURNA: okay
[NARRATE] He sits down on the corridor floor.
[NARRATE] Just for a second.
[NARRATE] Cam pointing at the ceiling.
[SYSTEM] FEED — Kelvin — network terminal
KELVIN: ...it's gone
[PAUSE 2s]
AYO: that was it?
KELVIN: that was it
MURNA: so we just beat a god with bad parenting
[PAUSE 2s]
[NARRATE] Loray almost smiles. You can feel it through the feed.
VI: confirmed
VI: signal architecture collapsed
VI: no residue
VI: no dormant process
[PAUSE 2s]
VI: it's gone

→ ch12_root_lot7
```

### BEAT: ch12_root_lot7 — "She couldn't find the words"
Context: phone / sms (thread_group)

```
[NARRATE] The venue is contained. Buyers held.
[NARRATE] Murna moves toward the holding corridor without being asked.
[SYSTEM] FEED — Murna cam
[NARRATE] He walks the corridor. Lot numbers on each cell. He gets to Lot 7.
[NARRATE] Empty.
[NARRATE] He stands there for a moment without saying anything.
MURNA: ...she's not here
[PAUSE 2s]
MURNA: Kelvin
KELVIN: I know
KELVIN: I'm sorry
KELVIN: she was moved before the auction opened
[NARRATE] Murna doesn't respond.
[NARRATE] He just stands there with the empty cell in frame.
[NARRATE] The cam doesn't move.
[NARRATE] Nobody tells him to.
[NARRATE] Then Pitch.
[SYSTEM] Private Message — Pitch
PITCH: external network
PITCH: I followed the transport chain from the outside
PITCH: I have her location
[PAUSE 2s]
PITCH: she's alive
PITCH: she's being held at a secondary facility
PITCH: coordinates sending now
[PAUSE 2s]
PITCH: usual spot
PITCH: tomorrow
PITCH: we finish this
[NARRATE] That's enough.
[NARRATE] She's not here. But now you know exactly where she is.
[NARRATE] Which is more than you had this morning.
[NARRATE] Then the notification.
[NOTIF Message — Unknown] Help
[NARRATE] Cut off. But this time — immediately after:
[IF flag texted_halima]
[SYSTEM] Halima — thread updated
[TYPING halima start]
[PAUSE 4s]
[TYPING halima stop]
[NARRATE] A typing indicator appears in her thread. Four seconds. Stops. Nothing sends.
[NARRATE] She has her phone back.
[NARRATE] Pitch knows where she is.
[NARRATE] She couldn't find the words.
[NARRATE] She didn't need to.
[ENDIF]
[IF flag kept_message]
[SYSTEM] admin is replying to "you're easier to separate than expected"
ADMIN: I was wrong about that
[NARRATE] Gone.
[NARRATE] Its last message ever.
[ENDIF]
[NARRATE] The Doubt mechanic — one final moment.
[COMPOSER clear]
[NARRATE] The message bar. Clear. No scramble. No hesitation.
[NARRATE] Whatever you type — it sends instantly.
[NARRATE] You notice.
[NARRATE] You weren't sure you'd ever feel that again.
[SYSTEM] FADE
[SYSTEM] ENDING — "Root Access"
[SYSTEM] Alignment: CALIBRATION
[SYSTEM] Admin: Destroyed. Permanently.
[SYSTEM] Ayo: Injured — side. Operational.
[SYSTEM] Murna: Operational. Standing in an empty cell.
[SYSTEM] Halima: Alive. Location confirmed by Pitch. Not yet reached.
[SYSTEM] Team: Intact.
[SYSTEM] Pitch: Separated. Not lost. Has the coordinates.
[SYSTEM] You let it study you. So you could study it back.

→ ch12_season_end
```

---

## SEASON END (all routes)

### BEAT: ch12_season_end
Context: phone / sms (thread_group)

```
[SYSTEM] HALIMA PROJECT — SEASON 1 COMPLETE
[SYSTEM] Three endings. Three costs. None of them clean.
[SYSTEM] Halima is still out there.
[SYSTEM] So is everything that took her.
[SYSTEM] Play again?

→ season_end   [STUB — is_ending: season finale]
```

---

## Conversion notes
- ENGINE UPGRADE (optional, post-ship): the `[SCREEN pc_interface ...]` markers are where the multi-feed PC view belongs. Current engine plays these beats as chat + narration, which works; a dedicated feeds UI (4–5 cam panels, per Ben's spec) is the polish target. The `screen` directive already reaches the engine — build the view against it.
- "Uniform" intentionally has zero choices after the route lock. Do not add any. The player's helplessness is the mechanic.
- The Doubt scramble in Uniform ("message bar scrambles, three seconds") and the clear-bar moment in Root Access are presentation effects on the composer input — engine hook needed; narration carries them until then.
- Murna's death (Uniform) is permanent for that route's epilogue/Season 2 state. No flag set — the route flag itself encodes it.
- Ben's epilogue-level notes ("On replay, players will see it differently") are kept as narration verbatim where he wrote them as player-facing; his meta commentary was dropped.
