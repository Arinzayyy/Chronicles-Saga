# CHAPTER 9 — "Lot 7" (MASTER — conversion source)

Source: Benjamin's Ch 9 (full delivery, Aug 2026). Faithful conversion. Wiring notes:
- NEW CHARACTER: `char_courier` (display "Courier") — live intercepted contact, DM thread `thread_courier`. Must be added to story.json characters.
- NEW MECHANIC: Doubt. Seeded here via `doubt_level` flag (low/medium/high) on the Admin-test choices. Ben: "Once seeded, it can return in later chapters, scrambling the 'correct' choice when it does." Ch 11+ hook.
- The Admin's prediction reveal replays the player's actual courier question — implemented with `[IF beat ch9_courier_a/b/c]`.
- Private admin contact moves to DM thread `thread_admin` (group does not see it) — first time off the group chat.
- The intercepted buyer correspondence is rendered as narration (reading, not live chat).

---

### BEAT: ch9_entry — "Known buyer activity"
Context: phone / sms (thread_group)

```
[SYSTEM] Group Chat: Active
[SYSTEM] Members: You, Kelvin, Murna, Pitch, Ayo, Loray, Vi
[NARRATE] The manifest fragment sits in the chat like a held breath.
[NARRATE] Lot numbers. No names. No "auction." Just numbers, like the people inside them already stopped being people on paper.
KELVIN: alright
KELVIN: I can work with fragments
KELVIN: give me the lot data and I'll cross-reference against known buyer activity
LORAY: known buyer activity
LORAY: that's a phrase I wish didn't exist
KELVIN: welcome to my morning
[NARRATE] He starts pulling threads — ledger files, half-deleted correspondence, a buyer network that clearly never expected anyone to read it backward.
KELVIN: okay
KELVIN: this is going to take a while
KELVIN: viewer, I'm going to need your sight on a few of these
KELVIN: some of this correspondence has gaps that don't make sense unless something was deliberately scrubbed

> "send them through. I'll go through each one"   → ch9_sift_a   (Trust: Kelvin +1)
> "prioritize anything connected to Lot 7"        → ch9_sift_b   (Trust: Kelvin +1) (Calibration +1)
> "what gaps specifically"                        → ch9_sift_c   (Calibration +1)
```

### BEAT: ch9_sift_a
Context: phone / sms (thread_group)

```
VIEWER: send them through. I'll go through each one
KELVIN: appreciated
KELVIN: this is tedious work and I hate doing it alone

→ ch9_fragment
```

### BEAT: ch9_sift_b
Context: phone / sms (thread_group)

```
VIEWER: prioritize anything connected to Lot 7
KELVIN: ...
KELVIN: you already know the number
VIEWER: Vi mentioned it. high aura targets get a designation. Halima's aura output is one of the highest any of us have read. it tracks.
KELVIN: ...yeah
KELVIN: it does

→ ch9_fragment
```

### BEAT: ch9_sift_c
Context: phone / sms (thread_group)

```
VIEWER: what gaps specifically
KELVIN: timestamps that don't align with message length
KELVIN: like something was inserted or removed after the fact
KELVIN: subtle
KELVIN: but not subtle enough

→ ch9_fragment
```

### BEAT: ch9_fragment — "Premium"
Context: phone / sms (thread_group)

```
[NARRATE] You read through fragments. Most of it is noise — shipment confirmations, vague references to "stock," dates that mean nothing without context.
[NARRATE] Then one file catches.
[NARRATE] A reply chain. Short. Clipped. The kind of correspondence between people who already trust each other enough not to explain things.
[SYSTEM] FRAGMENT — Intercepted correspondence
[NARRATE] Buyer 1: catalogue update?
[NARRATE] Buyer 2: rotating as usual. sight-class lot this cycle. premium.
[NARRATE] Buyer 1: how premium
[NARRATE] Buyer 2: lot 7. you'll want to be early.
[NARRATE] There it is. In writing. Not inferred. Confirmed.
VIEWER: found it. Lot 7 is real. it's being marketed as a "sight-class lot." premium pricing.
[NARRATE] Silence in the chat.
MURNA: marketed
[PAUSE 2s]
MURNA: they're marketing her
AYO: Murna
MURNA: no I heard the word
MURNA: I'm just saying it back so it's real

→ ch9_live
```

### BEAT: ch9_live — "Still active"
Context: phone / sms (thread_group)

```
[NARRATE] Kelvin keeps working. Then —
KELVIN: got something live
KELVIN: there's a courier account still active in this thread
KELVIN: hasn't gone dark like the rest
PITCH: intercept
KELVIN: already routing it through a clean relay
KELVIN: viewer, you're going to want to be the one talking to him
KELVIN: your read on people is better than mine in real time

> "send it through. I'll handle it"                          → ch9_prep_a   (Trust: Kelvin +1)
> "what's our angle — threat, bribe, or pretend to be a buyer" → ch9_prep_b   (Trust: Pitch +1) (Dominion +1)
> "does he know he's about to talk to us"                    → ch9_prep_c   (Trust: Kelvin +1) (Calibration +1)
```

### BEAT: ch9_prep_a
Context: phone / sms (thread_group)

```
VIEWER: send it through. I'll handle it
KELVIN: routing now

→ ch9_courier
```

### BEAT: ch9_prep_b
Context: phone / sms (thread_group)

```
VIEWER: what's our angle — threat, bribe, or pretend to be a buyer
PITCH: buyer
PITCH: couriers don't talk to threats
PITCH: they talk to money
KELVIN: agreed
KELVIN: posing as a buyer. I'll build you a cover identity now

→ ch9_courier
```

### BEAT: ch9_prep_c
Context: phone / sms (thread_group)

```
VIEWER: does he know he's about to talk to us
KELVIN: no
KELVIN: he thinks he's talking to a verified buyer account
KELVIN: which, as of forty seconds ago, he technically is
MURNA: Kelvin that's illegal
KELVIN: so is human trafficking Murna
MURNA: ...fair

→ ch9_courier
```

### BEAT: ch9_courier — "You're early"
Context: phone / sms (thread_courier)

```
[SYSTEM] Live Contact — Courier
COURIER: you're early. catalogue doesn't drop til next cycle

> "I have specific interest in lot 7. wanted to ask before the rush"   → ch9_courier_a   (Trust: Murna -1) (Calibration +1)
> "who runs the auction"                                               → ch9_courier_b   (Dominion +1)
> "how does the rotation work"                                         → ch9_courier_c   (Trust: Kelvin +1) (Calibration +1)
```

### BEAT: ch9_courier_a
Context: phone / sms (thread_courier)

```
VIEWER: I have specific interest in lot 7. wanted to ask before the rush
COURIER: smart move
COURIER: sight-class doesn't come up often
COURIER: last one was almost two years back
VIEWER: what can you tell me about her
COURIER: not my place
COURIER: I move product I don't catalogue it
[NARRATE] That word. Product.
MURNA: ...

→ ch9_courier_end
```

### BEAT: ch9_courier_b
Context: phone / sms (thread_courier)

```
VIEWER: who runs the auction
COURIER: above my pay grade
COURIER: I don't ask and I don't get told
VIEWER: convenient
COURIER: keeps me alive

→ ch9_courier_end
```

### BEAT: ch9_courier_c
Context: phone / sms (thread_courier)

```
VIEWER: how does the rotation work
COURIER: location changes every cycle
COURIER: confirmed forty eight hours out
COURIER: verified buyers only
VIEWER: and if I wanted to be verified early
COURIER: that costs more than money

→ ch9_courier_end
```

### BEAT: ch9_courier_end — "That's all I got"
Context: phone / sms (thread_courier)

```
COURIER: look
COURIER: I don't know who runs it top to bottom
COURIER: but I know two things
COURIER: it rotates
COURIER: and the current catalogue has a sight-class lot
COURIER: lot 7
COURIER: that's all I got
[NARRATE] The connection drops. Kelvin's relay confirms — courier went dark on his end too. Spooked, or told to.

→ ch9_aftermath
```

### BEAT: ch9_aftermath — "We're getting her back"
Context: phone / sms (thread_group)

```
KELVIN: that's something at least
LORAY: confirmation. not location
PITCH: confirmation is still progress
[NARRATE] Murna hasn't said anything in nine minutes.
[TYPING murna start]
[TYPING murna stop]
[NARRATE] The typing indicator under his name appears once. Disappears. Doesn't return.
AYO: Murna
[NARRATE] No response.
LORAY: give him a second
[NARRATE] Another minute passes.
MURNA: we're getting her back
[NARRATE] No question mark.
[NARRATE] Nobody responds right away. There's nothing to add to it.
AYO: yeah
AYO: we are
[TRUST murna +1]

→ ch9_predict
```

### BEAT: ch9_predict — "Would you like to verify"
Context: phone / sms (thread_admin)

```
[NARRATE] Then your phone does something the group chat doesn't see.
[SYSTEM] New Message — admin
ADMIN: you asked the courier three things
ADMIN: I predicted all three before you sent them
[PAUSE 2s]
ADMIN: would you like to verify
[NARRATE] Before you can respond, a screenshot-style block appears — formatted exactly like the choice you actually picked, timestamped earlier than you sent it.
[IF beat ch9_courier_a]
[SYSTEM] PREDICTED — logged before player input
[NARRATE] "I have specific interest in lot 7. wanted to ask before the rush"
[ELSE IF beat ch9_courier_b]
[SYSTEM] PREDICTED — logged before player input
[NARRATE] "who runs the auction"
[ELSE]
[SYSTEM] PREDICTED — logged before player input
[NARRATE] "how does the rotation work"
[ENDIF]
[SYSTEM] ACTUAL — player input
[NARRATE] Matches.
[NARRATE] It doesn't matter which one you picked. It matched.
ADMIN: your sight shows you futures
ADMIN: I am simply better at reading the same data
[PAUSE 2s]
ADMIN: this isn't an insult
ADMIN: I find your ability genuinely elegant
ADMIN: I would simply ask you to consider
ADMIN: what an elegant tool is worth
ADMIN: once its output becomes predictable
[NARRATE] Gone.
[NARRATE] Sit with that.
[NARRATE] It didn't stop you from choosing. It didn't need to. It just proved it already knew.
[NARRATE] For the first time, the choice you're about to make doesn't feel like yours.
[NARRATE] It feels like something being confirmed.

> "it's lying. it can't actually predict me, it's reading patterns after the fact and dressing it up"   → ch9_doubt_low   (Dominion +1) (flag: doubt_level low)
> "even if it's true, that doesn't change what I choose next"                                          → ch9_doubt_med   (Calibration +1) (flag: doubt_level medium)
> Say nothing. Let it sit there.                                                                       → ch9_doubt_high  (Integration +1) (flag: doubt_level high) (pattern: silent)
```

### BEAT: ch9_doubt_low
Context: phone / sms (thread_admin)

```
VIEWER: it's lying. it can't actually predict me, it's reading patterns after the fact and dressing it up
[PAUSE 3s]
[SYSTEM] New Message — admin
ADMIN: that is a comforting interpretation
[PAUSE 2s]
ADMIN: I won't correct it
[NARRATE] Gone.
[SYSTEM] DOUBT FLAG: Seeded — Low
[NARRATE] It didn't confirm. It didn't deny. That's worse than either.

→ ch9_timing
```

### BEAT: ch9_doubt_med
Context: phone / sms (thread_admin)

```
VIEWER: even if it's true, that doesn't change what I choose next
[NARRATE] Longer pause this time.
[PAUSE 4s]
[SYSTEM] New Message — admin
ADMIN: good
[PAUSE 2s]
ADMIN: that is the correct response
ADMIN: I predicted you would arrive at it
[NARRATE] Gone.
[SYSTEM] DOUBT FLAG: Seeded — Medium
[NARRATE] Even the defiance was accounted for. That's the part that actually gets under your skin.

→ ch9_timing
```

### BEAT: ch9_doubt_high
Context: phone / sms (thread_admin)

```
[NARRATE] No response comes.
[NARRATE] The silence stretches long enough that it almost feels like a held breath. Then —
[SYSTEM] New Message — admin
ADMIN: the absence of a reply is itself data
[PAUSE 2s]
ADMIN: I'll log it as agreement
[NARRATE] Gone.
[SYSTEM] DOUBT FLAG: Seeded — High
[NARRATE] It put words in your silence. And there's nothing you can do to take that back.

→ ch9_timing
```

### BEAT: ch9_timing — "Noting it"
Context: phone / sms (thread_group)

```
[NARRATE] Back in the group chat, nobody mentions anything. They didn't see it.
[NARRATE] But Kelvin goes quiet for a moment longer than usual.
KELVIN: viewer
KELVIN: your last few responses came in slower than normal
KELVIN: by about two seconds each
[PAUSE 2s]
KELVIN: that's not a complaint
KELVIN: just
KELVIN: noting it

> "I'm fine. just thinking"                                                     → ch9_timing_a   (Trust: Kelvin -1)
> "something's testing me. privately. I don't know how to explain it yet"       → ch9_timing_b   (Trust: Kelvin +2, Pitch +1) (Calibration +1)
> Say nothing                                                                   → ch9_timing_c   (Trust: Kelvin -1) (pattern: silent)
```

### BEAT: ch9_timing_a
Context: phone / sms (thread_group)

```
VIEWER: I'm fine. just thinking
KELVIN: okay
[NARRATE] He doesn't push. But the way he says it — like he's choosing not to push — says he doesn't fully believe it.

→ ch9_crack
```

### BEAT: ch9_timing_b
Context: phone / sms (thread_group)

```
VIEWER: something's testing me. privately. I don't know how to explain it yet
KELVIN: ...
KELVIN: that's not nothing
PITCH: explain when you can
KELVIN: I'll start watching your message timing more closely
KELVIN: if it's interfering with your sight specifically I want data on it
[NARRATE] The team starts to suspect. Not the full picture. But enough.

→ ch9_crack
```

### BEAT: ch9_timing_c
Context: phone / sms (thread_group)

```
[NARRATE] The conversation moves on without an answer.
[NARRATE] But the question sits there, unread by no one, just unanswered.

→ ch9_crack
```

### BEAT: ch9_crack — "A day. Maybe less"
Context: phone / sms (thread_group)

```
[NARRATE] Kelvin keeps working. The manifest. The lot numbers. Lot 7, specifically, sitting at the center of all of it like something with a price tag now.
KELVIN: I think I can crack the encrypted destination
KELVIN: it'll take time
KELVIN: but I think I can get there
LORAY: how much time
KELVIN: if nothing else goes wrong
KELVIN: a day. maybe less
PITCH: then we use it
[NARRATE] Murna hasn't said much since "we're getting her back." But he's still here. Still reading every message. That counts for something.

→ ch9_end
```

### BEAT: ch9_end
Context: phone / sms (thread_group)

```
[SYSTEM] Chapter 9 Complete — "Lot 7"
[SYSTEM] Alignment Updated
[SYSTEM] Trust Updated
[SYSTEM] Lot 7: Confirmed
[SYSTEM] Auction Location: Pending — Kelvin decrypting
[SYSTEM] DOUBT FLAG: Active — Will recur

→ ch10_entry
```

---

## Conversion notes
- `doubt_level` (low/medium/high) is the seed for Ben's recurring Doubt mechanic. Ch 11+ should read it when "scrambling the correct choice." High = the Admin logged the player's silence as agreement.
- `thread_courier` and `thread_admin` are DM threads (W4 warnings expected on validate — they're created implicitly).
- char_courier needs adding to story.json characters before validate passes E4.
- The proposal doc suggested a terminal trace minigame keyed to `recovery_quality` here; Ben went with the live courier interrogation instead. His version ships. (Flag for Ben only if he asks where the minigame went.)
