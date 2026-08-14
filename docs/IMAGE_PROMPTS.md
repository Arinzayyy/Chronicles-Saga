# Chronicles Saga — In‑Game Photo Prompts

AI prompts for the **10 in‑game photos** that currently render as gray placeholders.
Unified **manga / anime** style so they sit inside the game's world and UI.

Each photo is referenced in `src/data/story.json` by its `photo_id`. To use a
generated image, drop it in `src/assets/` and register it in the viewer's
`PHOTO_ASSETS` map (`src/screens/SceneViewer.jsx`) under the matching id.

---

## 0. Style bible (read first)

**Append this STYLE BLOCK to every prompt below** (or set it as a style preset / `--sref`):

> gritty modern manga and anime illustration, bold confident inking, heavy
> blacks and dramatic chiaroscuro, cel‑shaded with a painterly grimy finish,
> desaturated palette punched with blood‑red and cold teal accents, ink‑splatter
> and halftone texture, high contrast, cinematic, West African urban
> supernatural‑thriller mood, framed as a photo taken on a phone (slightly
> off‑kilter handheld framing, faint grain / compression)

**Negative prompt (all images):**

> 3D render, photorealistic, smooth render, watermark, signature, caption text,
> ui, logo, chibi, cute, pastel, bright cheerful lighting, extra fingers,
> deformed hands, lowres, jpeg artifacts (heavy), blurry faces

**Consistency tips**

- **Aspect ratio:** the viewer crops portrait — use **4:5** (or 3:4) for all photos; the two memes can be **1:1**.
- **Crime‑scene trio** (`halima_scene_1/2/3`): generate together / reuse one **seed** so it reads as *one location* from three angles.
- **Milestone trio** (`*_milestone`): no character designs exist yet, so these three effectively *define* the team — lock a **character reference / seed** and reuse it so Murna, Halima and the crew look the same across all three.
- Keep a light grain/compression so they read as phone photos, not splash art.

**Cast cues** (personalities, since looks aren't fixed yet — young West African monster‑hunters):
Murna = impulsive, hot‑blooded, hardened · Kelvin = precise, dry, snarky · Loray = warm, jokes, emoji · Ayo = clipped, stoic, camera‑shy · Pitch = cerebral, watchful · Halima = sharp, confident, the one now missing.

---

## 1. Crime‑scene photos (Halima's last location)

### `halima_scene_1` — the main room
> A dim ransacked room photographed in a hurry on a phone. The walls are covered
> in deep overlapping claw‑like slashes gouged into the plaster — some chaotic,
> some disturbingly deliberate. Dried blood flung in dark arcs across the
> surfaces, like something moved fast and hit hard. The aftermath of a party:
> crushed red cups, broken bottles, knocked‑over chairs — but no people, no
> bodies. One weak overhead light, cold hard shadows, deep dread. *[STYLE BLOCK]* — 4:5

### `halima_scene_2` — a different corner
> A different corner of the same blood‑marked room, phone photo. The same gouged
> slashes and dark dried‑blood spatter cross the wall. One broken bottle on the
> floor still holds a little liquid, catching the light. A toppled chair, scattered
> debris. Empty, hurried, wrong. Cold low light, deep blacks. *[STYLE BLOCK]* — 4:5

### `halima_scene_3` — near the door
> Phone photo near a doorway in the same scene, shot low. Here the slashes run
> LOW along the wall close to the floor — as if something was crawling, or being
> dragged. A smear of blood trails toward the threshold; the door hangs ajar into
> blackness. Tense ground‑level framing. *[STYLE BLOCK]* — 4:5

---

## 2. Field evidence

### `murna_room_video` — Murna in the room *(this is a video; use as the still/thumb)*
> Phone video still: a young West African man — **Murna**, late‑20s, hardened
> street‑hunter, worn jacket — standing alone in the same blood‑slashed room
> where Halima was last seen. The gouged walls and dark blood arcs loom behind
> him. His jaw is set tight; he's holding himself together but only barely —
> grief and fury kept under control. Slightly shaky handheld framing, grain.
> *[STYLE BLOCK]* — 4:5 (or 9:16)

### `murna_fence_photo` — the trail
> A grainy phone photo taken fast in a bleak industrial area at dusk. A torn
> scrap of fabric snagged on a broken chain‑link fence panel. Below it, faint
> deliberate footprint impressions pressed into pale dust — evenly spaced, made
> by someone who knew exactly where they were going. Motion blur, failing light,
> evidentiary and cold. *[STYLE BLOCK]* — 4:5

---

## 3. Memes (group‑chat humor — keep them scrappy)

> Note: render as a *reaction meme saved on a phone* — slightly low‑res /
> compressed, leave clean negative space top & bottom for caption text (you'll
> add the words yourself). Manga style, comedic exaggeration.

### `murna_lowblow_meme` — "low blow… but I respect low blows"
> A scrappy manga‑style reaction meme: a deadpan, utterly unbothered character
> taking a brutal verbal hit and respecting it anyway — flat stare, faint smirk,
> exaggerated comic framing. Trash‑talk energy. Clean banner space for impact‑font
> text. *[STYLE BLOCK, lighter]* — 1:1

### `murna_meme` — "we let it think it understands us"
> An ominous‑funny manga‑style meme: a character giving a flat, knowing side‑eye
> — the dread‑humor kind that pairs with the line "we let it think it understands
> us." Uneasy, deadpan, faintly sinister. Clean caption space. *[STYLE BLOCK]* — 1:1

---

## 4. Milestone / relationship photos (warm — these humanize the team)

> Warmer light and softer grime than the crime scenes — "before everything"
> nostalgia. Lock a character reference so the crew matches across all three.

### `murna_milestone` — Murna & Halima *(caption in game: "me and Halima. last year… proof she smiles")*
> A candid manga‑style phone photo, last year: **Murna** (young, hot‑blooded
> hunter) and **Halima** (sharp, confident — the one now missing) side by side,
> both genuinely smiling, rare for her. Casual, close, real friendship. Warm
> cheap indoor light, slight phone‑cam grain. Bittersweet in hindsight.
> *[STYLE BLOCK, warmer]* — 4:5

### `kelvin_milestone` — the whole team *(caption: "the whole team. before. Halima's the blur in the corner")*
> A candid manga‑style group phone photo: a tight‑knit crew of five or six young
> West African monster‑hunters crammed into frame — worn jackets, mismatched
> gear, tired grins, a safehouse / couch backdrop. One figure at the very edge is
> motion‑blurred, half‑turning away from the lens (**Halima**, who hated being
> photographed). Warm dim indoor light, grime under the nostalgia. *[STYLE BLOCK, warmer]* — 4:5

### `loray_milestone` — village run *(caption: "village run, three weeks ago. Ayo said no pictures.")*
> A candid manga‑style phone snapshot on a village run — dusty rural West African
> outskirts, golden hour. The crew caught off guard: one of them (**Ayo**) clearly
> objecting, a hand half‑raised to block the lens, others laughing. Long shadows,
> kicked‑up dust, worn field gear. A stolen warm moment. *[STYLE BLOCK, warmer]* — 4:5

---

### Wiring a generated image back in
1. Save as e.g. `src/assets/halima_scene_1.jpg`.
2. In `src/screens/SceneViewer.jsx`, add to `PHOTO_ASSETS`:
   `import halimaScene1 from '../assets/halima_scene_1.jpg'` → `{ halima_scene_1: halimaScene1, … }`.
   (The gallery/messages then show the real image instead of the placeholder.)
