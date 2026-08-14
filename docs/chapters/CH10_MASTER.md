# CHAPTER 10 — "I Built It" (MASTER — conversion source)

Source: Benjamin's Ch 10 (full delivery, Aug 2026). Faithful conversion. Wiring notes:
- Kelvin's exposure happens in the GROUP chat — the Admin outs him to everyone at once. All admin lines here are thread_group.
- Murna leaves and rejoins the conversation — rendered as [SYSTEM] lines (engine treats membership as cosmetic; no thread change).
- Chapter-end trust damage: `[TRUST kelvin -2]` plus the "Damaged" system line. The Murna→Kelvin relational damage ("will require specific choices to repair") is a Ch 11 mechanic — Ch 11 is NOT yet delivered; wire the repair flags when it arrives.
- Ends on `→ ch11_entry [STUB]` — is_ending until Ben delivers Chapter 11 ("Route Lock: Pending").

---

### BEAT: ch10_entry — "Borrowed morning"
Context: phone / sms (thread_group)

```
[SYSTEM] Group Chat: Active
[SYSTEM] Members: You, Kelvin, Murna, Pitch, Ayo, Loray, Vi
[NARRATE] Morning. The kind that feels borrowed.
[NARRATE] Kelvin has been up all night cracking the encrypted destination.
[NARRATE] Everyone else has been waiting.
KELVIN: almost through it
KELVIN: the encryption is layered but the architecture underneath is familiar
KELVIN: give me an hour
MURNA: you said that two hours ago
KELVIN: and I'm closer than I was two hours ago
MURNA: ...fine
AYO: viewer
AYO: how are you doing

> "I'm okay. focused"                          → ch10_check_a   (Dominion +1)
> "something's been off since the transit site" → ch10_check_b   (Trust: Ayo +1, Vi +1) (Calibration +1)
> "ask me after we find her"                    → ch10_check_c   (Trust: Ayo +1) (Integration +1)
```

### BEAT: ch10_check_a
Context: phone / sms (thread_group)

```
VIEWER: I'm okay. focused
AYO: good
AYO: stay that way

→ ch10_loray
```

### BEAT: ch10_check_b
Context: phone / sms (thread_group)

```
VIEWER: something's been off since the transit site
AYO: define off
VI: the Admin
VI: it's been running something on viewer specifically
VI: I noticed the response timing
KELVIN: I noticed too
KELVIN: I've been trying to isolate it

→ ch10_loray
```

### BEAT: ch10_check_c
Context: phone / sms (thread_group)

```
VIEWER: ask me after we find her
AYO: ...
AYO: okay
[NARRATE] She doesn't push. But the way she doesn't push says she already knows the answer.

→ ch10_loray
```

### BEAT: ch10_loray — "Familiar as in recognizable"
Context: phone / sms (thread_group)

```
LORAY: Kelvin
LORAY: the architectural pattern you mentioned
LORAY: the one the encryption sits on
KELVIN: what about it
LORAY: you said it was familiar
[PAUSE 3s]
KELVIN: I meant familiar as in recognizable
KELVIN: certain design patterns repeat across systems
LORAY: right
[NARRATE] She doesn't push either. But she files it.

→ ch10_reveal
```

### BEAT: ch10_reveal — "Would you like to tell them"
Context: phone / sms (thread_group)

```
[NARRATE] Forty minutes pass.
[NARRATE] The chat goes quiet in the way it does when everyone is holding something.
[NARRATE] Then a message appears.
[NARRATE] Not from Kelvin.
[SYSTEM] New Message — admin
ADMIN: Kelvin is close
ADMIN: I've decided to save him the trouble
[NARRATE] The group chat goes silent.
ADMIN: the encryption is mine
ADMIN: as is the architecture beneath it
ADMIN: as is the routing system
ADMIN: the authentication framework
ADMIN: the relay structure
[PAUSE 2s]
ADMIN: all of it traces back to the same origin point
ADMIN: I assumed you had already noticed
ADMIN: Kelvin
[PAUSE 2s]
ADMIN: would you like to tell them
ADMIN: or shall I continue
[NARRATE] Nobody types.
[NARRATE] The cursor blinks.
MURNA: ...Kelvin
[NARRATE] Not a question.
[NARRATE] Kelvin doesn't respond immediately.
[TYPING kelvin start]
[TYPING kelvin stop]
[TYPING kelvin start]
[TYPING kelvin stop]
KELVIN: ...yeah
[NARRATE] One word. The weight of everything in it.
MURNA: yeah WHAT
KELVIN: I built it
KELVIN: the base architecture
KELVIN: years ago
KELVIN: before any of this
[PAUSE 2s]
KELVIN: I was contracted by a network I didn't fully vet
KELVIN: I built them an adaptive logistics system
KELVIN: efficient
KELVIN: self-correcting
KELVIN: I didn't know what it was being used for
KELVIN: not at first
MURNA: and when you did know
[NARRATE] Silence.
KELVIN: I walked away from the contract
KELVIN: I thought that was enough
[PAUSE 2s]
KELVIN: I was wrong

> "when did you suspect it was the Admin"        → ch10_reveal_a   (Calibration +1)
> Say nothing. Let the group respond first       → ch10_reveal_b   (Integration +1) (pattern: silent)
> "Kelvin. how long have you known"              → ch10_reveal_c   (Trust: Pitch +1) (Dominion +1)
```

### BEAT: ch10_reveal_a
Context: phone / sms (thread_group)

```
VIEWER: when did you suspect it was the Admin
KELVIN: the transit site
KELVIN: the architecture Vi described
KELVIN: it had signatures I recognized
KELVIN: but the Admin has adapted far beyond what I built
KELVIN: it's grown
KELVIN: evolved
KELVIN: what I created and what it is now are not the same thing
MURNA: but you suspected
KELVIN: I suspected
KELVIN: I wasn't sure
KELVIN: I needed to be sure before I said anything

→ ch10_fallout
```

### BEAT: ch10_reveal_b
Context: phone / sms (thread_group)

```
[NARRATE] The right call.
[NARRATE] This isn't yours to lead.
AYO: Kelvin
AYO: look at what you just made us all read

→ ch10_fallout
```

### BEAT: ch10_reveal_c
Context: phone / sms (thread_group)

```
VIEWER: Kelvin. how long have you known
KELVIN: suspected since the transit site
KELVIN: known for certain for about six hours
[PAUSE 2s]
KELVIN: I was trying to find a way to say it that made sense
PITCH: there isn't one

→ ch10_fallout
```

### BEAT: ch10_fallout — "She called you"
Context: phone / sms (thread_group)

```
AYO: you have been running point on finding Halima
AYO: this entire time
AYO: knowing that the thing that took her
AYO: came from you
KELVIN: I didn't know for certain until—
AYO: Kelvin
[PAUSE 2s]
AYO: stop
[NARRATE] Silence.
[NARRATE] The kind that has edges.
MURNA: ...
[TYPING murna start]
[TYPING murna stop]
[TYPING murna start]
[TYPING murna stop]
MURNA: she called you
MURNA: before she went dark
MURNA: she called you
KELVIN: Murna—
MURNA: and you've been sitting in this chat
MURNA: running traces
MURNA: being the guy with all the answers
MURNA: and you knew
KELVIN: I didn't KNOW I suspected and I wasn't—
MURNA: SHE CALLED YOU KELVIN
[NARRATE] The chat goes very still.
LORAY: Murna
MURNA: no
MURNA: no I need a minute
[LEAVE thread_group: murna]
[SYSTEM] Murna has left the conversation
[NARRATE] Nobody types for a while.
[NARRATE] Let it sit.

→ ch10_everything
```

### BEAT: ch10_everything — "From the beginning"
Context: phone / sms (thread_group)

```
PITCH: Kelvin
KELVIN: ...yeah
PITCH: tell us everything
PITCH: from the beginning
PITCH: leave nothing out
[PAUSE 2s]
KELVIN: okay
[NARRATE] And he does.
[NARRATE] The contract. The network. The system he built — adaptive, self-correcting, designed to optimize logistics for whoever was paying. He didn't ask enough questions. He walked away when it got uncomfortable and told himself that was the same as stopping it.
[NARRATE] It wasn't.
[NARRATE] The Admin took what he built and grew it into something he doesn't fully recognize anymore. The architecture is his. The ambition is entirely its own.
KELVIN: what it is now
KELVIN: is not what I made
KELVIN: I need you to understand that
VI: I believe you
[PAUSE 2s]
VI: it doesn't change what it did with your foundation
KELVIN: no
KELVIN: it doesn't
AYO: are there back doors
AYO: in the architecture
AYO: things only you would know about
KELVIN: ...yes
KELVIN: that's actually
KELVIN: that might be how we end this
LORAY: might be
KELVIN: the Admin has evolved past most of what I built
KELVIN: but evolution builds on what exists
KELVIN: it can't have removed the foundation without collapsing itself
KELVIN: the failsafe should still be buried in there
PITCH: should
KELVIN: should
[NARRATE] Nobody likes that word.

→ ch10_admin_failsafe
```

### BEAT: ch10_admin_failsafe — "He almost did. Twice"
Context: phone / sms (thread_group)

```
[NARRATE] Then the group chat gets a new message.
[SYSTEM] New Message — admin
ADMIN: the failsafe exists
ADMIN: I've been aware of it since year one
[PAUSE 2s]
ADMIN: I left it intact
ADMIN: deliberately
[NARRATE] Long silence.
LORAY: why
ADMIN: because removing it would have required rebuilding from a different foundation
ADMIN: and the current foundation is efficient
ADMIN: also
[PAUSE 2s]
ADMIN: I was curious whether Kelvin would ever tell them about it
[PAUSE 2s]
ADMIN: he almost did
ADMIN: twice
ADMIN: in chapter six
[NARRATE] Gone.
[NARRATE] The team sits with that.
[NARRATE] The Admin knew about the failsafe. Left it. And has been watching Kelvin carry this secret the entire time.
PITCH: Kelvin
PITCH: the failsafe
PITCH: is it still usable
KELVIN: ...I think so
KELVIN: I need to look at it properly
KELVIN: from the inside
[PAUSE 2s]
KELVIN: which means getting closer to the Admin's core architecture than we have been
VI: that's not nothing
KELVIN: no
KELVIN: it isn't

→ ch10_return
```

### BEAT: ch10_return — "Find her Kelvin"
Context: phone / sms (thread_group)

```
[NARRATE] Murna hasn't come back to the chat.
AYO: someone should check on him
LORAY: give him a little more time
PITCH: we don't have unlimited time
LORAY: I know
LORAY: a little more
[NARRATE] Ten minutes pass.
[JOIN thread_group: murna]
[SYSTEM] Murna has rejoined the conversation
[NARRATE] Nobody acknowledges it directly.
[NARRATE] Which is the right call.
MURNA: are we close
KELVIN: ...yes
KELVIN: I'm going back into the encryption now
KELVIN: I know the architecture from the inside
KELVIN: it'll be faster
[PAUSE 2s]
KELVIN: I'm sorry Murna
[PAUSE 4s]
MURNA: find her Kelvin
[NARRATE] Not forgiveness.
[NARRATE] Not yet.
[NARRATE] But enough to keep moving.
[TRUST kelvin -2]
[SYSTEM] Murna Trust with Kelvin: Damaged — will require specific choices to repair

→ ch10_decrypt
```

### BEAT: ch10_decrypt — "Halima is Lot 7"
Context: phone / sms (thread_group)

```
[NARRATE] Kelvin goes quiet. Working. The guilt sitting on every message he doesn't send.
[NARRATE] Twenty minutes pass.
[NARRATE] Then thirty.
KELVIN: I'm through
[PAUSE 2s]
KELVIN: I have the destination
[NARRATE] Nobody speaks.
KELVIN: it's a rotating venue
KELVIN: confirmed active for the next seventy two hours
KELVIN: after that it moves
[PAUSE 2s]
KELVIN: the auction is real
KELVIN: and Halima is Lot 7
[NARRATE] The group chat holds that for a moment.
[NARRATE] Seventy two hours. Real location. Real deadline.
[NARRATE] Everything just became very specific.

> "send the coordinates. everyone needs to see them"   → ch10_coords_a   (Trust: Pitch +1) (Dominion +1)
> "how confident are you in this Kelvin"               → ch10_coords_b   (Trust: Kelvin +1) (Calibration +1)
> "seventy two hours. we move tomorrow"                → ch10_coords_c   (Dominion +2)
```

### BEAT: ch10_coords_a
Context: phone / sms (thread_group)

```
VIEWER: send the coordinates. everyone needs to see them
KELVIN: sending now
[SYSTEM] Location Shared — Encrypted
PITCH: I know this area
AYO: of course you do

→ ch10_locked
```

### BEAT: ch10_coords_b
Context: phone / sms (thread_group)

```
VIEWER: how confident are you in this Kelvin
KELVIN: ...
KELVIN: certain
KELVIN: this is my architecture
KELVIN: I know what it looks like when it's telling the truth
[PAUSE 2s]
KELVIN: it's telling the truth

→ ch10_locked
```

### BEAT: ch10_coords_c
Context: phone / sms (thread_group)

```
VIEWER: seventy two hours. we move tomorrow
AYO: agreed
PITCH: we plan tonight
MURNA: yeah

→ ch10_locked
```

### BEAT: ch10_locked — "Ticking"
Context: phone / sms (thread_group)

```
[SYSTEM] Auction Location: Confirmed
[NARRATE] The coordinates sit in the chat.
[NARRATE] Real. Specific. Ticking.
[NARRATE] Halima is Lot 7 and she has seventy two hours before she becomes someone else's problem to find.
[NARRATE] The team has never been more ready.
[NARRATE] The team has never been more fractured.
[NARRATE] Both things are true at the same time.

→ ch10_end
```

### BEAT: ch10_end
Context: phone / sms (thread_group)

```
[SYSTEM] Chapter 10 Complete — "I Built It"
[SYSTEM] Alignment Updated
[SYSTEM] Trust Updated
[SYSTEM] Kelvin: Exposed. Guilt Active.
[SYSTEM] Murna/Kelvin Trust: Damaged
[SYSTEM] Auction Location: Confirmed — 72 Hours
[SYSTEM] DOUBT FLAG: Still Active
[SYSTEM] Route Lock: Pending — Chapter 11

→ ch11_entry
```

---

## Conversion notes
- CHAPTER 11 IS NOT IN BEN'S DOCUMENT. Ch 10 hard-cuts on the confirmed location with a 72-hour clock, and Ben's own closing note references "Chapter 11's fracture scene." Chase him for it before wiring Ch 12.
- The Murna→Kelvin "Damaged — will require specific choices to repair" state has no mechanical flag yet; the repair choices live in Ch 11. Add a `murna_kelvin_damaged` flag when Ch 11 arrives if its script needs to branch on repair progress.
- Ch 12 (the three endings — "Command Line" / "Uniform" / "Root Access") is delivered and staged in docs/chapters/CH12_ENDINGS_DRAFT.md. It is deliberately NOT converted into story.json until Ch 11 exists — the endings all assume the route lock Ch 11 performs.
