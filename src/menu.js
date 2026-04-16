

const SAVE_KEY = "chronicles_save_v1"

function hasSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return parsed && parsed.version === 1
  } catch {
    return false
  }
}

export function initMenu() {
  const menu = document.getElementById("mainMenu")
  if (!menu) return

  const btnNew     = document.getElementById("menuBtnNew")
  const btnCont    = document.getElementById("menuBtnContinue")
  const btnSettings = document.getElementById("menuBtnSettings")

  // Show/hide Continue based on save presence
  if (btnCont) {
    btnCont.style.display = hasSave() ? "block" : "none"
  }

  if (btnNew) {
    btnNew.onclick = () => {
      // Clear any existing save so main.js starts fresh
      localStorage.removeItem(SAVE_KEY)
      hideMenu()
      window.dispatchEvent(new CustomEvent("menu:new_game"))
    }
  }

  if (btnCont) {
    btnCont.onclick = () => {
      hideMenu()
      window.dispatchEvent(new CustomEvent("menu:continue_game"))
    }
  }

  if (btnSettings) {
    btnSettings.onclick = () => {
      window.dispatchEvent(new CustomEvent("menu:open_settings"))
    }
  }
}

function hideMenu() {
  const menu = document.getElementById("mainMenu")
  if (!menu) return
  menu.classList.add("menu-out")
  setTimeout(() => {
    menu.style.display = "none"
  }, 500)
}
