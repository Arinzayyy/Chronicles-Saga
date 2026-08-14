# First Steps — Luca

**Your lane:** the interface — the ending screen, presentation polish, and the running bug list from everyone's playthroughs.
**You block:** Ben, once (he needs a hosted build before he can play or review anything). Clear it early.
**You're blocked by:** Arinze's first commit. Ten minutes, then you're clear for good.

Your lane is deliberately independent of the minigame work. Arinze owns that system end to end, so nothing you build has to wait for a game to exist, and nothing he builds waits for you.

---

## 1. Get a clean base · 5 min

```bash
git pull
git checkout feat/ui
npm install
npm run dev
```

---

## 2. Ship a build Ben can play · 1 hour — HIGH PRIORITY

Ben can't run the repo, so right now he can't play the game he wrote — and his whole lane depends on seeing Ch 12 running.

```bash
npm run build
```

Host it anywhere he can open in a browser: Vercel, Netlify, GitHub Pages. It's a static Vite build, so all of them work in minutes.

**Done when:** Ben has a URL.
**Unblocks:** Ben, entirely. Do this before your own playthrough if he's waiting.

---

## 3. Play the full season · half a day

Start to finish. You own the bug list for the whole project now, so play like a QA pass — note anything broken, ugly, mistimed, or confusing, and keep it somewhere the other two can see.

Pay attention to the very end: playback currently just stops. That's your next task.

---

## 4. The ending screen · your call — the one live defect

Every player, every route, hits this. The season ends and nothing tells you it ended.

What you have to work with: the final beat carries `is_ending: true`, and the `route` flag holds `dominion` / `integration` / `calibration`, so you always know which ending was reached.

What it needs:

- A title card per ending — "Command Line" / "Uniform" / "Root Access"
- The season-complete summary (already written, sitting as system lines at `ch12_season_end`)
- A record of which ending was reached, for replays and any future gallery
- A route back to the main menu

Ben is writing the copy and mood for these as part of his lane — build the frame, drop his text in when it lands. Don't wait for it.

**Done when:** all three endings terminate in a screen rather than silence.

---

## 5. Presentation polish · ongoing

Small, self-contained, high-visibility. Roughly in value order:

- **Quoted-reply bubble.** "admin is replying to *you're easier to separate than expected*" is currently a plain system line. It should look like a real quoted reply — it's the payoff for a choice made six chapters earlier, and it lands in all three endings.
- **Admin display name.** It signs itself `admin` from Ch 8 onward but the UI still renders `---`. Ben is making the call on whether it changes; if it does, the mechanism already exists (the same alias-resolve that retroactively renamed Murna in Ch 1).
- **Prediction block** (Ch 9 and Ch 11). The Admin showing the player its prediction of their own choice, in three visual states keyed to `doubt_level`: blurred, clear, or two competing predictions. Currently plain narration.
- **Whatever the playthroughs surface.** Yours, Arinze's, and Ben's.

---

## 6. Ongoing — the bug list

You're the closest thing this project has to QA. Every time Arinze wires a new minigame, play that chapter. Every time Ben's Ch 12 work lands, play an ending. Keep the list current and shared.

Nobody else is going to notice the small stuff, and the small stuff is what makes it feel finished.
