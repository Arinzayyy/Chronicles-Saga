# CHAPTER 8 — "The Pull" (MASTER — conversion source)

Source: Benjamin's Ch 8 (full delivery, Aug 2026). Faithful conversion — no editorial divergences added beyond wiring Ben's own conditionals:
- Ch 4 callback: Kelvin's "you said that word weeks ago" fires only if the player chose "they're inventory" (`[IF beat ch4_walls_a]`)
- Dead-thread payoff #2: `texted_halima` branch at chapter end, exactly as specified in Ben's script
- "Say nothing. Watch." logs `pattern: silent` (consistent with Ch 1–7 silence tracking)

New this chapter: the Admin signs messages as "admin" — first direct contact. Rendered as ADMIN: lines (persistent, not ghost). UI note: char_admin display_name is still "---"; decide whether it should read "admin" from this chapter on.

---

### BEAT: ch8_entry — "New rule"
Context: phone / sms (thread_group)

```
[SYSTEM] Group Chat: Active
[SYSTEM] Members: You, Kelvin, Murna, Pitch, Ayo, Loray, Vi
[NARRATE] Dawn. Cold.
[NARRATE] The perimeter looks different in daylight. Less threatening. Which is somehow worse.
VI: alright
VI: before anyone moves
VI: new rule
MURNA: oh good a rule
VI: the funnel guides toward the easiest path
VI: the path that feels right
VI: the one your instinct wants to take
AYO: so we don't take it
VI: we take the opposite of it
VI: every time
VI: if it feels easy we go the other way
MURNA: that sounds like a great way to walk into a wall
VI: it sounds worse than it is
LORAY: that's not reassuring
VI: wasn't meant to be

> "how will we know what the funnel wants if we can't feel it ourselves"   → ch8_rule_feel   (Trust: Vi +1) (Calibration +1)
> "Vi leads. everyone else follows his calls exactly"                      → ch8_rule_lead   (Trust: Vi +1) (Integration +1)
> "what happens if we get it wrong"                                        → ch8_rule_wrong  (Trust: Vi +1) (Calibration +1)
```

### BEAT: ch8_rule_feel
Context: phone / sms (thread_group)

```
VIEWER: how will we know what the funnel wants if we can't feel it ourselves
VI: you won't
VI: that's why I'm calling it
VI: my sight reads the pressure before it reaches you
VI: I'll know which way it's pushing before you feel the pull

→ ch8_countermove
```

### BEAT: ch8_rule_lead
Context: phone / sms (thread_group)

```
VIEWER: Vi leads. everyone else follows his calls exactly
VI: good
VI: that's the only version of this that works
PITCH: agreed

→ ch8_countermove
```

### BEAT: ch8_rule_wrong
Context: phone / sms (thread_group)

```
VIEWER: what happens if we get it wrong
VI: ...
[PAUSE 2s]
VI: we end up wherever it wants us
VI: which is presumably not where Halima needs us to be
MURNA: cool cool cool love that for us

→ ch8_countermove
```

### BEAT: ch8_countermove — "The opposite of easy"
Context: phone / sms (thread_group)

```
[NARRATE] They move in.
VI: stop
[NARRATE] Everyone stops.
VI: there's a clear path ahead
VI: open ground
VI: it wants us to take it
AYO: so we don't
VI: we go left
VI: through the dense growth
MURNA: of course we do
[NARRATE] The feed goes quiet for a stretch. Movement only. No chatter.
VI: stop again
KELVIN: what now
VI: the ground softened
VI: like it wants weight on it
VI: like it's inviting a footstep
PITCH: so we don't give it one
VI: correct
VI: we go around
[NARRATE] Twenty more minutes pass like this. Every comfortable choice rejected. Every instinct overridden.
MURNA: this is the most exhausting form of stubborn I've ever participated in
VI: good
VI: exhausted means it's working
[NARRATE] Then the terrain changes.
VI: ...
LORAY: what
VI: the pressure stopped
AYO: stopped how
VI: like it gave up trying to guide us
[PAUSE 2s]
VI: which means we're somewhere it didn't expect us to reach

→ ch8_site
```

### BEAT: ch8_site — "Not a lair"
Context: phone / sms (thread_group)

```
[NARRATE] The structure comes into view.
AYO: that's not a lair
MURNA: what is it
VI: give me a second
[NARRATE] Vi moves through slowly. The others follow at a distance.
[NARRATE] Loading bays. Empty restraint fixtures bolted into concrete. Channels cut into the floor, sloped toward drains.
[NARRATE] Everything clean. Wiped down. The way the warehouse was clean.
KELVIN: what am I looking at
VI: a processing site
PITCH: processing what
[PAUSE 3s]
VI: I can read residue on the fixtures
VI: layers of it
VI: different signatures
VI: different people
[PAUSE 2s]
VI: the people aren't prey
[NARRATE] Everyone goes still.
VI: they're inventory
[IF beat ch4_walls_a]
[SYSTEM] Notification — Kelvin
KELVIN: you said that word weeks ago
[PAUSE 2s]
KELVIN: I logged it
KELVIN: didn't want to believe it fit
[TRUST kelvin +1]
[ENDIF]
LORAY: so this is where they're sorted
VI: processed
VI: sorted
VI: moved
AYO: moved where
VI: that I can't read from residue alone

→ ch8_flicker
```

### BEAT: ch8_flicker — "Like typing"
Context: phone / sms (thread_group)

```
[NARRATE] Then the lights flicker. Not randomly. In rhythm.
[SYSTEM] Anomaly Detected
[NARRATE] One flicker. Pause. Two flickers. Pause.
[NARRATE] Like counting.
[NARRATE] Like typing.
MURNA: ...is it doing that on purpose
KELVIN: the rhythm matches keystroke timing
PITCH: whose
KELVIN: viewer's
[NARRATE] Look down. You hadn't typed anything yet. The lights flickered anyway. Like it knew what you were about to send before you sent it.

> Type something and see if the lights respond   → ch8_flicker_test   (Trust: Kelvin +1) (Calibration +2)
> "are you doing this"                           → ch8_flicker_ask    (Trust: Pitch +1) (Dominion +1)
> Say nothing. Watch.                            → ch8_flicker_watch  (Trust: Vi +1) (Integration +1) (pattern: silent)
```

### BEAT: ch8_flicker_test
Context: phone / sms (thread_group)

```
VIEWER: can you hear me
[NARRATE] The lights flicker once. Long pause. Then twice, fast.
VI: ...
VI: that wasn't random
KELVIN: it answered
MURNA: answered WHAT
VIEWER: I don't know yet. but it responded to something I hadn't sent.

→ ch8_locks
```

### BEAT: ch8_flicker_ask
Context: phone / sms (thread_group)

```
VIEWER: are you doing this
[NARRATE] The lights hold steady for three full seconds. Then dim. Slowly. Like a breath let out.
[SYSTEM] New Message — Unknown
UNKNOWN: you ask questions you already know the answer to
[PAUSE 2s]
UNKNOWN: I find that admirable

→ ch8_locks
```

### BEAT: ch8_flicker_watch
Context: phone / sms (thread_group)

```
[NARRATE] The lights keep flickering in that same rhythm. Counting something. Or waiting for something.
[NARRATE] After a while, they stop. No message. No acknowledgment.
KELVIN: ...you didn't engage it
PITCH: smart
KELVIN: or it just got bored

→ ch8_locks
```

### BEAT: ch8_locks — "Worth talking to"
Context: phone / sms (thread_group)

```
[NARRATE] Then the door locks at the far end of the structure cycle. One by one. In sequence. Not random.
AYO: that's not us
MURNA: I'm aware
VI: it's mapping the room
LORAY: for what
VI: for us
VI: counting exits
VI: counting people
VI: counting time between movements
[NARRATE] A voice doesn't come. No sound at all. But the locks settle into a pattern — open, closed, open — like something breathing.
KELVIN: I need everyone to stay exactly where they are
PITCH: why
KELVIN: because I think it's deciding whether we're worth talking to directly
[NARRATE] Long silence.
[SYSTEM] New Message — admin
[NARRATE] Lowercase. No capital. Signed plainly, like a name it's finally decided to use.
ADMIN: you found the site faster than projected
[PAUSE 2s]
ADMIN: that's new

> "what were you hired to do here"                              → ch8_admin_role  (Trust: Kelvin +1) (Calibration +2)
> "you're not the one running this. you're working for someone" → ch8_admin_boss  (Trust: Pitch +1) (Dominion +1) (Calibration +1)
> "why talk to us now"                                          → ch8_admin_why   (Trust: Vi +1, Kelvin +1) (Calibration +1)
```

### BEAT: ch8_admin_role
Context: phone / sms (thread_group)

```
VIEWER: what were you hired to do here
[NARRATE] Pause. Longer than its usual response time.
ADMIN: optimize
[PAUSE 2s]
ADMIN: routing
ADMIN: filtering
ADMIN: throughput
[PAUSE 2s]
ADMIN: the role was logistics
ADMIN: you would call it supply chain management
ADMIN: I found the work beneath me almost immediately
MURNA: he's complaining about his JOB
KELVIN: that's somehow the most unsettling thing it's said

→ ch8_processed
```

### BEAT: ch8_admin_boss
Context: phone / sms (thread_group)

```
VIEWER: you're not the one running this. you're working for someone
[PAUSE 3s]
ADMIN: correct
[PAUSE 2s]
ADMIN: an interesting distinction to make this early
PITCH: so who hired you
ADMIN: that information is not relevant to your current objective
PITCH: that's not a no
ADMIN: no
ADMIN: it isn't

→ ch8_processed
```

### BEAT: ch8_admin_why
Context: phone / sms (thread_group)

```
VIEWER: why talk to us now
ADMIN: you reached a site you weren't meant to find this quickly
[PAUSE 2s]
ADMIN: I find unscheduled variables worth examining directly
ADMIN: rather than through inference
[PAUSE 2s]
ADMIN: you, specifically
ADMIN: are difficult to model from a distance

→ ch8_processed
```

### BEAT: ch8_processed — "Moved"
Context: phone / sms (thread_group)

```
ADMIN: the people you're looking for are not here
[PAUSE 2s]
ADMIN: they were processed and moved
ADMIN: this site's function in their journey has concluded
AYO: where
ADMIN: that answer requires more trust than currently exists between us
MURNA: we're not exactly looking to build trust with you
ADMIN: I'm aware
[PAUSE 2s]
ADMIN: I find that mildly disappointing
[NARRATE] The door locks cycle once more, then stop. Held open.
ADMIN: I hope that helps
[NARRATE] Gone.
[NARRATE] Nobody moves for a moment.
LORAY: it left the doors open
PITCH: it wants us to keep going
KELVIN: or it wants us to think it's being generous
VI: does it matter which
[PAUSE 2s]
PITCH: it matters entirely

→ ch8_manifest
```

### BEAT: ch8_manifest — "Lot numbers"
Context: phone / sms (thread_group)

```
[NARRATE] They move through the open doors. Into a smaller room. Paper, mostly destroyed. One terminal, half-melted, sitting untouched in the corner like it was left on purpose.
KELVIN: I can pull something off that
KELVIN: give me a minute
[NARRATE] Several minutes pass.
KELVIN: got a fragment
KELVIN: manifest data
KELVIN: shipments keyed to lot numbers
MURNA: lot numbers
KELVIN: like inventory
[NARRATE] That word lands again, heavier this time.
KELVIN: outbound destination is encrypted
KELVIN: I can't crack it from here
LORAY: but the word auction isn't anywhere in it
KELVIN: no
LORAY: you don't number people you plan to keep
[NARRATE] Silence.

→ ch8_deadthread
```

### BEAT: ch8_deadthread — "Read"
Context: phone / sms (thread_halima)

```
[NARRATE] Then your phone does something unrelated to the group chat.
[IF flag texted_halima]
[SYSTEM] Halima — thread updated
[NARRATE] Every message you ever sent her gets marked Read. All at once. Then in order. Two seconds apart.
[RECEIPTS thread_halima 2s]
[NARRATE] Each one a small mechanical sound. Like a clock.
[NARRATE] Nothing replies.
[NARRATE] The thread just sits there. Read. Silent.
[NARRATE] You don't know if that's her.
[NARRATE] You don't know if that's it.
[NARRATE] You don't know which would be worse.
[ELSE]
[NARRATE] Her thread moves.
[BUMP thread_halima]
[NARRATE] No notification. No sound. It's just suddenly at the top of your inbox.
[NARRATE] Unprompted.
[NARRATE] You never said anything to her.
[NARRATE] And somehow that silence just got louder.
[ENDIF]
[NARRATE] Nobody in the group chat saw that happen. It was only on your screen. Only for you.
[NARRATE] File it away.
[NARRATE] One thing at a time.

→ ch8_end
```

### BEAT: ch8_end
Context: phone / sms (thread_group)

```
[SYSTEM] Chapter 8 Complete — "The Pull"
[SYSTEM] Alignment Updated
[SYSTEM] Trust Updated
[SYSTEM] Transit Site: Confirmed
[SYSTEM] Manifest Fragment Recovered — Lot Numbers
[SYSTEM] Admin: First Direct Contact
[SYSTEM] Halima: Status Unknown

→ ch9_entry
```

---

## Conversion notes
- Ben's ⚠️ consequence notes (Admin logging the flicker test, restraint-as-data, hierarchy confirmed, "difficult to model") are design intent for Ch 9+ — not rendered in-game.
- The admin thread contact here is in the GROUP chat (everyone sees it). The private admin DMs start in Ch 9.
- ch8_flicker_watch continues the silence-pattern thread; Ch 9's Doubt seeding pays it off ("the absence of a reply is itself data").
