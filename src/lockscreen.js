// lockscreen.js
// Lock screen behavior
// Notification click unlocks into story
// Swipe up unlocks into home
// Swipe works on mobile touch and desktop mouse

const lockscreen = document.getElementById("lockscreen")
const notification = document.getElementById("notification")
const lockHint = document.querySelector(".lock-hint")

// One value used for both touch and mouse pointer swipes
let startY = null

export function showNotification(text, appName = "Unknown") {
  notification.querySelector(".notif-text").innerText = text
  notification.querySelector(".notif-app").innerText = appName
  notification.classList.remove("hidden")
}

export function hideLockscreen() {
  lockscreen.classList.add("unlocking")
  setTimeout(() => {
    lockscreen.style.display = "none"
  }, 260)
}

// Notification click unlocks into story
notification.onclick = (e) => {
  e.stopPropagation()
  hideLockscreen()
  window.dispatchEvent(new CustomEvent("lockscreen:opened"))
}

// Shared unlock helper
function unlockToHome() {
  hideLockscreen()
  window.dispatchEvent(new CustomEvent("lockscreen:unlocked_home"))
}

// Touch swipe up for mobile
lockscreen.addEventListener("touchstart", (e) => {
  const t = e.touches && e.touches[0]
  if (!t) return
  startY = t.clientY
})

lockscreen.addEventListener("touchend", (e) => {
  if (startY === null) return
  const t = e.changedTouches && e.changedTouches[0]
  if (!t) return

  const delta = startY - t.clientY
  startY = null

  if (delta > 60) unlockToHome()
})

// Mouse drag swipe up for desktop
lockscreen.addEventListener("mousedown", (e) => {
  // Only left click drag
  if (e.button !== 0) return
  startY = e.clientY
})

window.addEventListener("mouseup", (e) => {
  if (startY === null) return

  const delta = startY - e.clientY
  startY = null

  if (delta > 60) unlockToHome()
})

// Optional hint animation
if (lockHint) {
  lockHint.classList.add("swipe-anim")
}




