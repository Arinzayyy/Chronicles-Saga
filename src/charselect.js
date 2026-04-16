

const CHARACTERS = [
  {
    id: "char_a",
    label: "A",
    avatar: null,          // swap to "avatars/player_a.png" when ready
    color: "#1bdc89",      // placeholder background tint
    wallpaper: "wallpapers/unlock_a.jpg"   // unlocked after story trigger
  },
  {
    id: "char_b",
    label: "B",
    avatar: null,
    color: "#00aaff",
    wallpaper: "wallpapers/unlock_b.jpg"
  },
  {
    id: "char_c",
    label: "C",
    avatar: null,
    color: "#ff6b6b",
    wallpaper: "wallpapers/unlock_c.jpg"
  },
  {
    id: "char_d",
    label: "D",
    avatar: null,
    color: "#f5a623",
    wallpaper: "wallpapers/unlock_d.jpg"
  }
]

let selectedId = null

export function getSelectedCharacter() {
  return CHARACTERS.find(c => c.id === selectedId) ?? CHARACTERS[0]
}

export function initCharSelect() {
  const screen = document.getElementById("charSelect")
  if (!screen) return

  const grid    = document.getElementById("charGrid")
  const confirm = document.getElementById("charConfirm")

  if (!grid || !confirm) return

  // Build cards
  grid.innerHTML = ""
  CHARACTERS.forEach(char => {
    const card = document.createElement("button")
    card.className = "charCard"
    card.dataset.id = char.id

    if (char.avatar) {
      card.innerHTML = `<img class="charAvatar" src="${char.avatar}" alt="${char.label}">`
    } else {
      // Placeholder: coloured circle with letter
      card.innerHTML = `
        <div class="charAvatarPlaceholder" style="background:${char.color}22; border-color:${char.color}55;">
          <span style="color:${char.color}">${char.label}</span>
        </div>
      `
    }

    card.onclick = () => {
      // Deselect all, select this
      grid.querySelectorAll(".charCard").forEach(c => c.classList.remove("selected"))
      card.classList.add("selected")
      selectedId = char.id
      confirm.disabled = false
      confirm.classList.add("active")
    }

    grid.appendChild(card)
  })

  confirm.disabled = true

  confirm.onclick = () => {
    if (!selectedId) return
    hideCharSelect()
    window.dispatchEvent(new CustomEvent("charselect:confirmed", {
      detail: { characterId: selectedId }
    }))
  }
}

export function showCharSelect() {
  const screen = document.getElementById("charSelect")
  if (!screen) return

  // Reset state
  selectedId = null
  const confirm = document.getElementById("charConfirm")
  if (confirm) {
    confirm.disabled = true
    confirm.classList.remove("active")
  }
  const grid = document.getElementById("charGrid")
  if (grid) grid.querySelectorAll(".charCard").forEach(c => c.classList.remove("selected"))

  screen.style.display = "flex"
  requestAnimationFrame(() => screen.classList.add("visible"))
}

function hideCharSelect() {
  const screen = document.getElementById("charSelect")
  if (!screen) return
  screen.classList.add("out")
  setTimeout(() => {
    screen.style.display = "none"
    screen.classList.remove("visible", "out")
  }, 420)
}
