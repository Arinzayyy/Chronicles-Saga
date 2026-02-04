// home.js
// Controls the main phone home screen UI
// No story logic lives here
// Home requests inbox opening by dispatching an event

import { inbox, chatView, backBtn, headerTitle, settingsView, galleryView } from "./gui.js"

const homeView = document.getElementById("homeView")
const appChats = document.getElementById("appChats")
const appSettings = document.getElementById("appSettings")
const appGallery = document.getElementById("appGallery")


let swipeStartY = null

export function initHome() {
  if (!homeView) return

  if (appChats) {
    appChats.onclick = () => {
      window.dispatchEvent(new CustomEvent("home:open_inbox"))
    }
  }

  if (appSettings) {
  appSettings.onclick = () => {
    window.dispatchEvent(new CustomEvent("home:open_settings"))
  }
}

if (appGallery) {
  appGallery.onclick = () => {
    window.dispatchEvent(new CustomEvent("home:open_gallery"))
  }
}


  homeView.addEventListener("touchstart", onTouchStart)
  homeView.addEventListener("touchend", onTouchEnd)

  homeView.addEventListener("mousedown", onMouseDown)
}

export function showHome() {
  if (!homeView) return

  // Home must always be exclusive
  homeView.classList.remove("hidden")
  inbox.classList.add("hidden")
  chatView.classList.add("hidden")

  if (settingsView) settingsView.classList.add("hidden")
  if (galleryView) galleryView.classList.add("hidden")

  backBtn.classList.add("hidden")
  headerTitle.innerText = "Home"
}


function onTouchStart(e) {
  const t = e.touches && e.touches[0]
  if (!t) return
  swipeStartY = t.clientY
}

function onTouchEnd(e) {
  if (swipeStartY === null) return

  const t = e.changedTouches && e.changedTouches[0]
  if (!t) return

  const delta = swipeStartY - t.clientY
  swipeStartY = null

  if (delta > 60) {
    window.dispatchEvent(new CustomEvent("home:open_inbox"))
  }
}

function onMouseDown(e) {
  if (e.button !== 0) return
  swipeStartY = e.clientY

  const onUp = (ev) => {
    if (swipeStartY === null) return

    const delta = swipeStartY - ev.clientY
    swipeStartY = null

    if (delta > 60) {
      window.dispatchEvent(new CustomEvent("home:open_inbox"))
    }

    window.removeEventListener("mouseup", onUp)
  }

  window.addEventListener("mouseup", onUp)
}
