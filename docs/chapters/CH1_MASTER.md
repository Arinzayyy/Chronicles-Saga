# CHAPTER 1 — "You Did Screw Up" (MASTER — conversion source)

Source: Benjamin's Ch 1 draft. Edits applied per green-lit brief:
- [EDIT-1] Silence/leave-on-read options added (3 spots), logged as pattern `silent`
- [EDIT-2] Halima dead-thread texting seeded at chapter end (flag `texted_halima`)
- [EDIT-3] Normalized beat IDs, choice targets, and effect notation for the converter
- Murna texts from Halima's phone until the group chat forms → `resolve_alias` at ch1_groupchat

Characters in this chapter: Halima (voice/photos only), Murna (as "Halima" until alias resolve), Kelvin.
New threads: `thread_halima` (DM), `thread_kelvin` (DM), `thread_group` (group, created at end).

---

### BEAT: ch1_lockscreen — "Wake up too late"
Context: phone / lockscreen

```
[SCREEN lockscreen 2:47 PM]
[NOTIF 7 missed calls — Halima 💀]
[NOTIF 23 messages — unknown numbers]
[NARRATE] The kind of notifications you don't want to wake up to.
[NARRATE] The headache doesn't help.
[NARRATE] Halima doesn't call seven times for nothing. She barely calls once.

→ ch1_halima_dms
```

### BEAT: ch1_halima_dms — "Look at this scene"
Context: phone / sms (thread_halima)

```
HALIMA: Viewer
HALIMA: hey
HALIMA: okay you're clearly asleep
HALIMA: look at this scene when you wake up
[PHOTO halima_scene_1 ""]
HALIMA: the bounty for this one is suspiciously high
HALIMA: like. unusually high
HALIMA: which either means whoever posted it is desperate
HALIMA: or they want someone like me walking in there
HALIMA: still taking it obviously
HALIMA: but if anything happens to me I need you to contact my friends
HALIMA: I'm sending you everything
HALIMA: got it?
[PHOTO halima_scene_2 ""]
[PHOTO halima_scene_3 ""]
[VIDEO halima_video_1 ""]
HALIMA: viewer
HALIMA: VIEWER
HALIMA: okay. fine. sleep through it
HALIMA: just check it when you wake up please
[PAUSE 2s]
[NARRATE] She sent this hours ago. Hours.

→ ch1_photos
```

### BEAT: ch1_photos — "Every stain is a sentence"
Context: phone / gallery

```
[NARRATE photo halima_scene_1] A large room. Walls covered in deep slashes, some overlapping, some deliberate. Dried blood in arcs across the surfaces like something moved fast and hit hard.
[NARRATE] A party. Maybe. Red cups on the floor. Broken bottles. The ghost of a gathering. But no bodies.
[NARRATE] All that blood and nothing to show for it. Where did they go. Hidden? Sold?
[NARRATE photo halima_scene_2] A different corner. Same story. One broken bottle still has liquid in it. Whoever was here left in a hurry or didn't leave at all.
[NARRATE photo halima_scene_3] Near what might have been a door. The slashes here are lower. Like something was crawling, or being dragged.
[NARRATE] Every stain is a sentence. The question is what language this is written in.
[NARRATE] And what kind of Esu writes like this.

→ ch1_video
```

### BEAT: ch1_video — "Play the video"
Context: phone / gallery

```
[NARRATE video halima_video_1] She's moving slowly. Checking corners. The light in the room is wrong. Too dim.
HALIMA (audio): whatever I'm hunting right now isn't our usual set of Esu
HALIMA (audio): in fact it seems like a particular type my friends faced years ago
HALIMA (audio): I smell blood, sweat and saliva
HALIMA (audio): a lot of it
HALIMA (audio): whatever was here wasn't subtle about it
[NARRATE] Behind her. Faint. Almost nothing. Glowing dots. A cluster of them.

> Pause and zoom in                  → ch1_video_zoom    (pattern: scrutinize)
> Keep watching first                → ch1_video_watch   (pattern: patient)
```

### BEAT: ch1_video_zoom — "Trick of the light"
Context: phone / gallery

```
[NARRATE] The image pixelates. The glow doesn't sharpen no matter how far in you go.
[NARRATE] Play it again from the start. The dots are gone. Like they were never there.
[NARRATE] Trick of the light. Has to be.
[NARRATE] Except Halima is trained for this. She doesn't miss tricks of the light.

→ ch1_video_end
```

### BEAT: ch1_video_watch — "She felt it first"
Context: phone / gallery

```
[NARRATE] She keeps moving. Slow. Methodical.
[NARRATE] Then she stops. Turns. Like something shifted in the room that only she could feel.
[NARRATE] She felt it before the camera did.

→ ch1_video_end
```

### BEAT: ch1_video_end — "Cuts to black"
Context: phone / gallery

```
[NARRATE] The phone hits the floor.
[NARRATE] Flashes. Light streaking across the frame in bursts.
[NARRATE] Sound — impact, movement, something that breathes wrong. A lot of them. Way too many.
[NARRATE] How did she not sense them when she came in. Halima doesn't miss things like that.
[NARRATE] Unless they mask their aura. Unless that's exactly what they do.
[SYSTEM] Video ended
[PAUSE 2s]
[NARRATE] Call her. No answer.
[NARRATE] Call again. No answer.
[PAUSE 3s]
[NARRATE] The notification sound has never felt this loud.
[NOTIF Halima 🔔]

→ ch1_hey
```

### BEAT: ch1_hey — "Halima doesn't hey"
Context: phone / sms (thread_halima)

```
> "Halima? please tell me that's you"       → ch1_hey_reply    (pattern: reach_out)
> Open it without saying anything first      → ch1_hey_silent   (pattern: silent)
```

### BEAT: ch1_hey_reply
Context: phone / sms (thread_halima)

```
VIEWER: Halima? please tell me that's you
HALIMA: ...
[NARRATE] The dots appear. Stay there longer than they should.
HALIMA: Hey

→ ch1_hey_off
```

### BEAT: ch1_hey_silent
Context: phone / sms (thread_halima)

```
[TYPING halima start]
[TYPING halima stop]
[TYPING halima start]
HALIMA: Hey...

→ ch1_hey_off
```

### BEAT: ch1_hey_off — "Same phone, different person"
Context: phone / sms (thread_halima)

```
[NARRATE] Something about that feels off. Halima doesn't hey. She never heys.

> "are you okay? I saw the video"                              → ch1_screwup_a
> "Halima I'm so sorry I missed your calls, I just woke up"    → ch1_screwup_b
```

### BEAT: ch1_screwup_a
Context: phone / sms (thread_halima)

```
VIEWER: are you okay? I saw the video
HALIMA: You did screw up
[PAUSE 1s]
HALIMA: and she called you before me
HALIMA: so I suggest you start talking

→ ch1_not_halima
```

### BEAT: ch1_screwup_b
Context: phone / sms (thread_halima)

```
VIEWER: Halima I'm so sorry I missed your calls, I just woke up
HALIMA: You did screw up
HALIMA: Halima is gone you piece of shit
HALIMA: and she called you first
HALIMA: so you better tell me what you know

→ ch1_not_halima
```

### BEAT: ch1_not_halima — "Figure out who this is"
Context: phone / sms (thread_halima)

```
[NARRATE] Gone. That word just sits there.
[NARRATE] That isn't Halima. Same phone. Completely different person.
[NARRATE] And whoever this is — they're not okay.
[NARRATE] The guilt tries to come in. Don't let it. Not yet. Figure out who this is first.

[RETRY LOOP — wrong answers return to ch1_whois_retry]
> "who is this"                                                → ch1_whois_a   (Trust: Murna −1)
> "if she hesitated to text you maybe I should too"            → ch1_whois_b   (Trust: Murna −2, Kelvin −1)
> "happy to help, me and Halima were close. I hope we can work together"  → ch1_whois_c   (Trust: Murna −1)
> "I'm not gonna pretend I'm not a piece of shit right now because I feel like one. but I don't know who you are. and I just watched my friend get attacked. so tell me why I should believe you aren't one of those things"  → ch1_whois_d   (Trust: Murna +1) (Calibration +1)
```

### BEAT: ch1_whois_a
Context: phone / sms (thread_halima)

```
VIEWER: who is this
HALIMA: someone who actually showed up
HALIMA: unlike you
HALIMA: now are you going to help or not
[NARRATE] Direct. Angry. Fair. But not enough to go on.
[NARRATE] Try a different approach.

→ ch1_whois_retry
```

### BEAT: ch1_whois_b
Context: phone / sms (thread_halima)

```
VIEWER: if she hesitated to text you maybe I should too
HALIMA: the hell did you just say to me
VIEWER: you heard me
VIEWER: how do you even have her phone
HALIMA: cause I went looking for her
HALIMA: while you were taking your little nap while she called for help
HALIMA: must be nice
[NARRATE] That lands. It's supposed to. Because it's true.
[NOTIF-DM kelvin] Viewer. Viewer. Viewer...
[NOTIF-DM kelvin] you just had to piss off our resident hot head didn't you
[NOTIF-DM kelvin] teamwork is going to be a nightmare from here 😩
[NARRATE] Not the move. Try again.

→ ch1_whois_retry
```

### BEAT: ch1_whois_c
Context: phone / sms (thread_halima)

```
VIEWER: happy to help, me and Halima were close. I hope we can work together
HALIMA: ...
HALIMA: you're trusting me pretty fast there
HALIMA: considering you have no idea who I am
HALIMA: that's either brave or stupid
[PAUSE 1s]
HALIMA: I haven't decided which
[NOTIF-DM kelvin] happy to help??
[NOTIF-DM kelvin] her phone wasn't found at a farmers market viewer
[NOTIF-DM kelvin] read the room 😭
[NARRATE] Wrong read. Try again.

→ ch1_whois_retry
```

### BEAT: ch1_whois_retry — "Try again"
Context: phone / sms (thread_halima)

```
[RETRY LOOP — same options as ch1_not_halima, minus narration]
> "who is this"                                                → ch1_whois_a   (Trust: Murna −1)
> "if she hesitated to text you maybe I should too"            → ch1_whois_b   (Trust: Murna −2, Kelvin −1)
> "happy to help, me and Halima were close. I hope we can work together"  → ch1_whois_c   (Trust: Murna −1)
> "I'm not gonna pretend I'm not a piece of shit right now because I feel like one. but I don't know who you are. and I just watched my friend get attacked. so tell me why I should believe you aren't one of those things"  → ch1_whois_d   (Trust: Murna +1) (Calibration +1)
```

### BEAT: ch1_whois_d — "Imagine how it feels"
Context: phone / sms (thread_halima)

```
VIEWER: I'm not gonna pretend I'm not a piece of shit right now because I feel like one. but I don't know who you are. and I just watched my friend get attacked. so tell me why I should believe you aren't one of those things
[NARRATE] Silence. Longer than comfortable.
[TYPING halima start]
[TYPING halima stop]
[TYPING halima start]
[VIDEO murna_room_video ""]
[NARRATE video murna_room_video] He's standing in the last room Halima was in. Same walls. Same blood. His jaw is set tight. He's holding it together. Barely.
HALIMA: sorry for being rude
HALIMA: I just need to find her
HALIMA: imagine how it feels to be standing here right now
[NARRATE] Yeah. That tracks.

→ ch1_alright
```

### BEAT: ch1_alright — "Kelvin will brief you"
Context: phone / sms (thread_halima)

```
VIEWER: alright
VIEWER: what do you need from me
HALIMA: Kelvin will brief you
VIEWER: who's Kelvin
HALIMA: you'll see
[PAUSE 3s]
[NARRATE] Thirty seconds later.
[NOTIF Kelvin 🔔]

→ ch1_kelvin_intro
```

### BEAT: ch1_kelvin_intro — "Been a while"
Context: phone / sms (thread_kelvin)

```
KELVIN: Viewer
KELVIN: been a while

> "Kelvin. talk to me. what's happening"        → ch1_kelvin_a   (Trust: Kelvin +1) (Integration +1)
> "let's skip the pleasantries. what's going on" → ch1_kelvin_b   (Trust: Kelvin +1) (Calibration +1)
> "how are you involved in this"                 → ch1_kelvin_c   (Dominion +1)
> Leave him on read                              → ch1_kelvin_d   (pattern: silent) (Calibration +1)   [EDIT-1]
```

### BEAT: ch1_kelvin_a
Context: phone / sms (thread_kelvin)

```
VIEWER: Kelvin. talk to me. what's happening
KELVIN: straight to it
KELVIN: I respect that

→ ch1_brief
```

### BEAT: ch1_kelvin_b
Context: phone / sms (thread_kelvin)

```
VIEWER: let's skip the pleasantries. what's going on
KELVIN: fair point
KELVIN: pleasantries are inefficient anyway

→ ch1_brief
```

### BEAT: ch1_kelvin_c
Context: phone / sms (thread_kelvin)

```
VIEWER: how are you involved in this
KELVIN: I'm involved in most things
KELVIN: occupational hazard
KELVIN: we can do the full biography later

→ ch1_brief
```

### BEAT: ch1_kelvin_d   [EDIT-1: silence option]
Context: phone / sms (thread_kelvin)

```
[PAUSE 4s]
KELVIN: I can see the read receipt viewer
KELVIN: this is a phone not a confessional 🌚
KELVIN: fine. I'll talk. you listen
[NARRATE] He doesn't sound offended. He sounds like he's filing it away.

→ ch1_brief
```

### BEAT: ch1_brief — "No Nexus trail"
Context: phone / sms (thread_kelvin)

```
KELVIN: so. Halima
KELVIN: I'm guessing you saw the video
KELVIN: whatever she walked into — it won
KELVIN: she's completely off the grid
KELVIN: digitally and spiritually
KELVIN: no Nexus trail. nothing
KELVIN: I've been running scans since the phone dropped and I'm getting nothing
KELVIN: which shouldn't be possible
KELVIN: I can always find something
[PAUSE 1s]
KELVIN: I don't like that I can't find something
VIEWER: so they're masking their aura somehow
KELVIN: masking it completely
KELVIN: which tells us either they've done this before
KELVIN: or someone showed them how
[PAUSE 2s]
VIEWER: what do you need me for
KELVIN: in summary?
KELVIN: your sight
KELVIN: Halima believed you could help us find her
KELVIN: so that's the working theory
KELVIN: I personally think we'd get there eventually without you
KELVIN: but eventually isn't ideal right now

> "of course you don't oh great digital Messiah"  → ch1_messiah_a  (Trust: Kelvin +1) (Calibration +1)
> "I'll take it. what's the plan"                 → ch1_messiah_b  (Integration +1)
> "what aren't you telling me Kelvin"             → ch1_messiah_c  (Trust: Kelvin +1) (Calibration +2)
```

### BEAT: ch1_messiah_a
Context: phone / sms (thread_kelvin)

```
VIEWER: of course you don't oh great digital Messiah
KELVIN: your words
KELVIN: not mine 🌚
KELVIN: but yes. that's essentially the title
[NARRATE] He likes being pushed back on. Noted.

→ ch1_groupchat
```

### BEAT: ch1_messiah_b
Context: phone / sms (thread_kelvin)

```
VIEWER: I'll take it. what's the plan
KELVIN: smart
KELVIN: I'll explain as we go
KELVIN: easier that way

→ ch1_groupchat
```

### BEAT: ch1_messiah_c
Context: phone / sms (thread_kelvin)

```
VIEWER: what aren't you telling me Kelvin
KELVIN: ...
KELVIN: a lot of things
KELVIN: but nothing relevant yet
KELVIN: ask me that again later and I might give you a different answer
[NARRATE] That isn't reassuring. It isn't meant to be.

→ ch1_groupchat
```

### BEAT: ch1_groupchat — "Short list"
Context: phone / sms (thread_group)

```
KELVIN: I'm pulling together the people Halima trusted
KELVIN: which is a short list
KELVIN: you made it
KELVIN: congratulations I suppose
[SYSTEM] Group chat created
[SYSTEM] Members: You, Kelvin, Murna
[GROUP thread_group: kelvin, murna]
[REVEAL thread_halima: Halima → Murna (Halima's phone)]
[TYPING murna start]
[TYPING murna stop]
[TYPING murna start]
MURNA: alright
MURNA: let's scooby do this shit
[PAUSE 1s]
MURNA: and viewer
MURNA: don't sleep through anything else
[NARRATE] Fair. We're moving. That's what matters.

→ ch1_deadthread
```

### BEAT: ch1_deadthread — "Her thread is still there"   [EDIT-2: dead-thread seed]
Context: phone / sms (thread_halima)

```
[NARRATE] Before the phone goes down for the night — her thread is still there.
[NARRATE] Last message: "just check it when you wake up please"
[NARRATE] You did. Too late. But you did.

> Type something. Even if no one reads it.   → ch1_deadthread_text   (flag: texted_halima +1) (Integration +1)
> Close the phone.                            → ch1_end               (pattern: silent)
```

### BEAT: ch1_deadthread_text
Context: phone / sms (thread_halima)

```
VIEWER: I'm going to find you
VIEWER: I promise
[PAUSE 3s]
[NARRATE] Delivered. Not read.
[NARRATE] Obviously not read.
[NARRATE] You check one more time anyway.

→ ch1_end
```

### BEAT: ch1_end — "Chapter complete"
Context: phone / sms (thread_group)

```
[SYSTEM] Chapter 1 Complete — "You Did Screw Up"
[SYSTEM] Alignment Seeded
[SYSTEM] Trust Initialized

→ ch2_entry   [STUB — points to Chapter 2 when converted; until then mark is_ending]
```

---

## Conversion notes (dev-facing)

- `HALIMA:` lines before `[REVEAL]` are Murna on Halima's phone — send as `char_halima_phone`, alias-resolved at ch1_groupchat.
- `HALIMA (audio):` = video voiceover, not a text — needs the narration/media presentation, not a bubble.
- `[NOTIF-DM kelvin]` = NotificationBanner from another thread while player is in thread_halima. Engine has NotificationBanner; needs a directive.
- `[NARRATE]` beats need the narration screen (new engine feature — Ch 2's warehouse fight will need it heavily).
- `pattern: X` → engine `log_pattern` directive (exists). `flag:` → `set_flag` (exists).
- Retry loop is plain beats — no engine work needed.
- `texted_halima` read-receipt payoff: Ch 3+ inserts a silent `[SYSTEM] Read 2:13 AM` into thread_halima if flag set. Cheap, devastating.
