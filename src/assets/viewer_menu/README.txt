VIEWER MAIN-MENU KEY ART
========================

Drop one image per viewer in THIS folder, named exactly after the viewer.
The main menu automatically uses a viewer's image as its background once that
viewer has been chosen (i.e. once a save with that viewer exists). Before any
viewer is chosen, the menu shows the default art (src/assets/main_menu_persona.*).

Accepted extensions: .jpg .jpeg .png .webp   (any one per viewer)

Required filenames (case-insensitive) and which art goes where:

  Dara.jpg  -> the afro-puff character holding the phone (red splatter)
  Zael.jpg  -> the blond character with the bloodied trident (red splatter)
  Seun.jpg  -> the dreadlocked character, white shirt, smiling (orange splatter)
  Fox.jpg   -> the character in the cap + yellow goggles (pink/magenta splatter)

Notes:
- The names must match the viewer IDs in src/screens/CharacterSelect.jsx
  (Dara, Zael, Seun, Fox). Casing doesn't matter; spelling does.
- Landscape art works best — the menu crops to "center right" and the menu
  text sits over a dark wash on the left, so keep the character toward the
  right side of the image.
- Missing files are harmless: that viewer just falls back to the default art.
- You can delete this README once the four images are in place.
