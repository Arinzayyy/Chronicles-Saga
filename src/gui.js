// gui.js
// Handles all UI rendering logic
// Chat messages, typing indicator, inbox view, chat view, and toast notifications

// ===== DOM REFERENCES =====
export const homeView = document.getElementById("homeView")
export const appChats = document.getElementById("appChats")

export const chat = document.getElementById("chat")
export const typing = document.getElementById("typing")
export const choicesDiv = document.getElementById("choices")
export const phone = document.getElementById("phone")
export const inbox = document.getElementById("inbox")
export const chatView = document.getElementById("chatView")
export const backBtn = document.getElementById("backBtn")
export const headerTitle = document.getElementById("headerTitle")
export const settingsView = document.getElementById("settingsView")
export const galleryView = document.getElementById("galleryView")
export const btnRestart = document.getElementById("btnRestart")
export const btnSaveGame = document.getElementById("btnSaveGame")


export const toast = document.getElementById("toast")

// ===== CHAT MESSAGE RENDERING =====
export function addMessage(text, who = "them", glitch = false) {
  const msg = document.createElement("div")
  msg.className = `message ${who}`
  if (glitch) msg.classList.add("glitch")
  msg.innerText = text
  chat.appendChild(msg)
  chat.scrollTop = chat.scrollHeight
}

export function typingThen(text, who, glitch = false) {
  typing.innerHTML = `
    <div class="typing-bubble">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `

  setTimeout(() => {
    typing.innerHTML = ""
    addMessage(text, who, glitch)
  }, 800 + Math.random() * 600)
}
// ===== VISUAL EFFECTS =====
export function glitchUI(stability) {
  if (stability < 30) phone.classList.add("glitch")
}

// ===== VIEW SWITCHING =====
export function showInboxView() {
  if (homeView) homeView.classList.add("hidden")
  if (settingsView) settingsView.classList.add("hidden")
  if (galleryView) galleryView.classList.add("hidden")

  inbox.classList.remove("hidden")
  chatView.classList.add("hidden")

  backBtn.classList.remove("hidden")
  headerTitle.innerText = "Chats"
}

export function showChatView(title) {
  if (homeView) homeView.classList.add("hidden")
  if (settingsView) settingsView.classList.add("hidden")
  if (galleryView) galleryView.classList.add("hidden")

  inbox.classList.add("hidden")
  chatView.classList.remove("hidden")

  backBtn.classList.remove("hidden")
  headerTitle.innerText = title
}

export function showSettingsView() {
  if (homeView) homeView.classList.add("hidden")
  if (galleryView) galleryView.classList.add("hidden")

  inbox.classList.add("hidden")
  chatView.classList.add("hidden")
  if (settingsView) settingsView.classList.remove("hidden")

  backBtn.classList.remove("hidden")
  headerTitle.innerText = "Settings"
}

export function showGalleryView() {
  if (homeView) homeView.classList.add("hidden")
  if (settingsView) settingsView.classList.add("hidden")

  inbox.classList.add("hidden")
  chatView.classList.add("hidden")
  if (galleryView) galleryView.classList.remove("hidden")

  backBtn.classList.remove("hidden")
  headerTitle.innerText = "Gallery"
}

// Optional helper if you ever want to show home from gui side
export function showHomeView() {
  if (homeView) homeView.classList.remove("hidden")
  inbox.classList.add("hidden")
  chatView.classList.add("hidden")
  backBtn.classList.add("hidden")
  headerTitle.innerText = "Home"
}

// ===== TOAST NOTIFICATIONS =====
let toastTimer = null
let toastTap = null

export function showToast(text, onTap) {
  if (!toast) return

  toast.innerText = text
  toastTap = typeof onTap === "function" ? onTap : null

  toast.classList.remove("hidden")
  requestAnimationFrame(() => toast.classList.add("show"))

  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(hideToast, 3500)
}

export function hideToast() {
  if (!toast) return

  toast.classList.remove("show")
  setTimeout(() => {
    toast.classList.add("hidden")
    toastTap = null
  }, 180)
}

if (toast) {
  toast.onclick = () => {
    if (toastTap) toastTap()
    hideToast()
  }
}

export function initGallery() {
  const items = document.querySelectorAll(".galleryItem")
  const modal = document.getElementById("galleryModal")
  const backdrop = document.getElementById("galleryBackdrop")
  const closeBtn = document.getElementById("galleryClose")
  const img = document.getElementById("galleryModalImg")
  const title = document.getElementById("galleryModalTitle")

  if (!items.length || !modal || !backdrop || !closeBtn || !img || !title) return

  function close() {
    modal.classList.add("hidden")
    img.src = ""
    title.innerText = ""
  }

  items.forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-src") || ""
      const t = btn.getAttribute("data-title") || ""
      img.src = src
      title.innerText = t
      modal.classList.remove("hidden")
    })
  })

  backdrop.addEventListener("click", close)
  closeBtn.addEventListener("click", close)
}

